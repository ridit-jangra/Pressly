"use client";

import { IEditorProps, IExtendedComponent, IExtendedLayout } from "@/lib/types";
import { DropZone } from "../ui/dropZone";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../shadcn/context-menu";
import {
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
  Copy,
  GripVertical,
} from "lucide-react";
import { useState } from "react";

export function Editor({
  setCurrentSelectedComponent,
  currentSelectedComponent,
  currentSelectedLayout,
  setCurrentSelectedLayout,
  layouts,
  setLayouts,
  navigation,
}: IEditorProps & {
  layouts: IExtendedLayout[];
  currentSelectedLayout: IExtendedLayout | null;
  setCurrentSelectedLayout: (layout: IExtendedLayout | null) => void;
  setLayouts: (
    layouts:
      | IExtendedLayout[]
      | ((prev: IExtendedLayout[]) => IExtendedLayout[]),
  ) => void;
}) {
  const [draggedComponent, setDraggedComponent] = useState<{
    layoutId: string;
    zoneIndex: number;
    componentIndex: number;
    component: IExtendedComponent;
  } | null>(null);

  const handleSetComponent = (v: IExtendedComponent) => {
    setCurrentSelectedComponent(v);
    setCurrentSelectedLayout(null);
  };

  const handleSetLayout = (v: IExtendedLayout) => {
    setCurrentSelectedLayout(v);
    setCurrentSelectedComponent(null as any);
  };

  const handleDeleteComponent = (
    layoutId: string,
    zoneIndex: number,
    instanceId: string,
  ) => {
    setLayouts((prev) =>
      prev.map((layout) => {
        if (layout.instanceId === layoutId) {
          const zoneKey = `zone-${zoneIndex}`;
          return {
            ...layout,
            components: {
              ...layout.components,
              [zoneKey]: (layout.components[zoneKey] || []).filter(
                (comp) => comp.instanceId !== instanceId,
              ),
            },
          };
        }
        return layout;
      }),
    );

    if (currentSelectedComponent?.instanceId === instanceId) {
      setCurrentSelectedComponent(null as any);
    }
  };

  const handleDuplicateComponent = (
    layoutId: string,
    zoneIndex: number,
    component: IExtendedComponent,
  ) => {
    const ComponentClass = component.content.node.constructor as new () => any;
    const newNode = new ComponentClass();
    newNode.applyState(component.state);

    const newComponent: IExtendedComponent = {
      ...component,
      instanceId: `${component.id}-${Date.now()}`,
      content: { node: newNode },
    };

    setLayouts((prev) =>
      prev.map((layout) => {
        if (layout.instanceId === layoutId) {
          const zoneKey = `zone-${zoneIndex}`;
          return {
            ...layout,
            components: {
              ...layout.components,
              [zoneKey]: [...(layout.components[zoneKey] || []), newComponent],
            },
          };
        }
        return layout;
      }),
    );
  };

  const handleMoveComponent = (
    layoutId: string,
    zoneIndex: number,
    componentIndex: number,
    direction: "up" | "down",
  ) => {
    setLayouts((prev) =>
      prev.map((layout) => {
        if (layout.instanceId === layoutId) {
          const zoneKey = `zone-${zoneIndex}`;
          const components = [...(layout.components[zoneKey] || [])];
          const newIndex =
            direction === "up" ? componentIndex - 1 : componentIndex + 1;

          if (newIndex >= 0 && newIndex < components.length) {
            [components[componentIndex], components[newIndex]] = [
              components[newIndex],
              components[componentIndex],
            ];
          }

          return {
            ...layout,
            components: {
              ...layout.components,
              [zoneKey]: components,
            },
          };
        }
        return layout;
      }),
    );
  };

  const handleDeleteLayout = (layoutId: string) => {
    setLayouts((prev) =>
      prev.filter((layout) => layout.instanceId !== layoutId),
    );

    if (currentSelectedLayout?.instanceId === layoutId) {
      setCurrentSelectedLayout(null);
    }
  };

  const handleDuplicateLayout = (layout: IExtendedLayout) => {
    const LayoutClass = layout.layout.constructor as new () => any;
    const newLayoutInstance = new LayoutClass();
    newLayoutInstance.applyState(layout.state);

    const duplicatedComponents: { [key: string]: IExtendedComponent[] } = {};
    Object.keys(layout.components).forEach((zoneKey) => {
      duplicatedComponents[zoneKey] = layout.components[zoneKey].map((comp) => {
        const ComponentClass = comp.content.node.constructor as new () => any;
        const newNode = new ComponentClass();
        newNode.applyState(comp.state);

        return {
          ...comp,
          instanceId: `${comp.id}-${Date.now()}-${Math.random()}`,
          content: { node: newNode },
        };
      });
    });

    const newLayout: IExtendedLayout = {
      ...layout,
      instanceId: `layout-${Date.now()}`,
      layout: newLayoutInstance,
      position: layouts.length,
      components: duplicatedComponents,
    };

    setLayouts((prev) => [...prev, newLayout]);
  };

  const handleMoveLayout = (layoutId: string, direction: "up" | "down") => {
    setLayouts((prev) => {
      const layouts = [...prev];
      const index = layouts.findIndex((l) => l.instanceId === layoutId);
      const newIndex = direction === "up" ? index - 1 : index + 1;

      if (newIndex >= 0 && newIndex < layouts.length) {
        [layouts[index], layouts[newIndex]] = [
          layouts[newIndex],
          layouts[index],
        ];
        layouts.forEach((layout, i) => (layout.position = i));
      }

      return layouts;
    });
  };

  const handleDragStart = (
    e: React.DragEvent,
    layoutId: string,
    zoneIndex: number,
    componentIndex: number,
    component: IExtendedComponent,
  ) => {
    setDraggedComponent({ layoutId, zoneIndex, componentIndex, component });
    e.dataTransfer.effectAllowed = "move";

    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "1";
    setDraggedComponent(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent,
    targetLayoutId: string,
    targetZoneIndex: number,
    targetComponentIndex?: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedComponent) return;

    const {
      layoutId: sourceLayoutId,
      zoneIndex: sourceZoneIndex,
      componentIndex: sourceComponentIndex,
      component,
    } = draggedComponent;

    setLayouts((prev) => {
      const newLayouts = prev.map((layout) => ({
        ...layout,
        components: { ...layout.components },
      }));

      const sourceLayout = newLayouts.find(
        (l) => l.instanceId === sourceLayoutId,
      );
      const targetLayout = newLayouts.find(
        (l) => l.instanceId === targetLayoutId,
      );

      if (!sourceLayout || !targetLayout) return prev;

      const sourceZoneKey = `zone-${sourceZoneIndex}`;
      const targetZoneKey = `zone-${targetZoneIndex}`;

      const sourceComponents = [
        ...(sourceLayout.components[sourceZoneKey] || []),
      ];
      const [movedComponent] = sourceComponents.splice(sourceComponentIndex, 1);
      sourceLayout.components[sourceZoneKey] = sourceComponents;

      const targetComponents = [
        ...(targetLayout.components[targetZoneKey] || []),
      ];
      const insertIndex =
        targetComponentIndex !== undefined
          ? targetComponentIndex
          : targetComponents.length;
      targetComponents.splice(insertIndex, 0, movedComponent);
      targetLayout.components[targetZoneKey] = targetComponents;

      return newLayouts;
    });

    setDraggedComponent(null);
  };

  // Update getLayoutStyles function in Editor.tsx to support new layouts

  const getLayoutStyles = (layout: IExtendedLayout): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      gap: `${layout.layout.gap}px`,
      padding: `${layout.layout.padding}px`,
      backgroundColor: layout.layout.backgroundColor,
      borderRadius: `${layout.layout.borderRadius}px`,
      minHeight: `${layout.layout.minHeight}px`,
    };

    // Card Grid Layout
    if (layout.id === "card-grid") {
      const shadowMap: Record<string, string> = {
        none: "none",
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.07)",
        lg: "0 10px 15px rgba(0,0,0,0.1)",
        xl: "0 20px 25px rgba(0,0,0,0.1)",
      };

      const hoverClass = (layout.layout as any).hoverEffect || "lift";

      // Set CSS variables for card zones
      document.documentElement.style.setProperty(
        "--zone-bg",
        (layout.layout as any).cardBg || "#ffffff",
      );
      document.documentElement.style.setProperty(
        "--zone-border",
        (layout.layout as any).border === "Yes"
          ? `1px solid ${(layout.layout as any).borderColor || "#e2e8f0"}`
          : "none",
      );
      document.documentElement.style.setProperty(
        "--zone-radius",
        `${(layout.layout as any).cardBorderRadius || 8}px`,
      );
      document.documentElement.style.setProperty(
        "--zone-padding",
        `${(layout.layout as any).padding || 24}px`,
      );
      document.documentElement.style.setProperty(
        "--zone-shadow",
        shadowMap[(layout.layout as any).shadow] || shadowMap.sm,
      );

      return {
        ...baseStyles,
        display: "grid",
        gridTemplateColumns: `repeat(${layout.layout.columns}, 1fr)`,
        padding: `${(layout.layout as any).containerPadding || 0}px`,
        backgroundColor: "transparent",
      };
    }

    // Hero Section Layout
    if (layout.id === "hero-section") {
      const layoutType = (layout.layout as any).layoutType || "centered";
      const verticalAlign = (layout.layout as any).verticalAlign || "center";
      const contentWidthMap: Record<string, string> = {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        full: "100%",
      };
      const contentWidth =
        contentWidthMap[(layout.layout as any).contentWidth] ||
        contentWidthMap.lg;

      const alignMap: Record<string, string> = {
        start: "flex-start",
        center: "center",
        end: "flex-end",
      };

      const borderBottom =
        (layout.layout as any).borderBottom === "Yes"
          ? `1px solid ${(layout.layout as any).borderColor || "#e2e8f0"}`
          : "none";

      return {
        ...baseStyles,
        display: "grid",
        gridTemplateColumns: layoutType === "centered" ? "1fr" : "1fr 1fr",
        alignItems: alignMap[verticalAlign] || "center",
        maxWidth: contentWidth,
        margin: "0 auto",
        padding: `${(layout.layout as any).paddingTop}px ${layout.layout.padding}px ${(layout.layout as any).paddingBottom}px`,
        borderBottom,
      };
    }

    // Section Layout
    if (layout.id === "section-layout") {
      const maxWidthMap: Record<string, string> = {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        full: "100%",
      };
      const maxWidth =
        maxWidthMap[(layout.layout as any).maxWidth] || maxWidthMap.lg;

      const borderTop =
        (layout.layout as any).borderTop === "Yes"
          ? `1px solid ${(layout.layout as any).borderColor || "#e2e8f0"}`
          : "none";
      const borderBottom =
        (layout.layout as any).borderBottom === "Yes"
          ? `1px solid ${(layout.layout as any).borderColor || "#e2e8f0"}`
          : "none";

      return {
        ...baseStyles,
        display: "grid",
        gridTemplateColumns: "1fr",
        maxWidth,
        margin: "0 auto",
        width: "100%",
        padding: `${(layout.layout as any).paddingTop}px ${(layout.layout as any).paddingX}px ${(layout.layout as any).paddingBottom}px`,
        borderTop,
        borderBottom,
        gap: 0,
      };
    }

    // Feature Grid Layout
    if (layout.id === "feature-grid") {
      const featureStyle = (layout.layout as any).featureStyle || "icon-top";

      return {
        ...baseStyles,
        display: "grid",
        gridTemplateColumns: `repeat(${layout.layout.columns}, 1fr)`,
      };
    }

    // Existing layouts (Container, Columns)
    if (layout.id === "wordpress-columns") {
      const columnTemplate =
        (layout.layout as any).getColumnTemplate?.() ||
        `repeat(${layout.layout.columns}, 1fr)`;
      const alignItems =
        (layout.layout as any).getAlignItems?.() || "flex-start";

      return {
        ...baseStyles,
        display: "grid",
        gridTemplateColumns: columnTemplate,
        alignItems,
      };
    }

    if (layout.id === "wordpress-container") {
      const contentWidth = (layout.layout as any).contentWidth || "Full Width";
      const customWidth = (layout.layout as any).customWidth || 1140;
      const borderType = (layout.layout as any).borderType || "None";
      const borderWidth = (layout.layout as any).borderWidth || 0;
      const borderColor = (layout.layout as any).borderColor || "#e5e7eb";
      const paddingTop = (layout.layout as any).paddingTop || 40;
      const paddingRight = (layout.layout as any).paddingRight || 40;
      const paddingBottom = (layout.layout as any).paddingBottom || 40;
      const paddingLeft = (layout.layout as any).paddingLeft || 40;
      const boxShadow = (layout.layout as any).boxShadow || "None";

      const shadowMap: Record<string, string> = {
        None: "none",
        Small: "0 1px 3px rgba(0,0,0,0.12)",
        Medium: "0 4px 6px rgba(0,0,0,0.1)",
        Large: "0 10px 15px rgba(0,0,0,0.15)",
      };

      return {
        ...baseStyles,
        display: "grid",
        gridTemplateColumns: "1fr",
        maxWidth: contentWidth === "Boxed" ? `${customWidth}px` : "100%",
        width: "100%",
        margin: contentWidth === "Boxed" ? "0 auto" : "0",
        border:
          borderType !== "None"
            ? `${borderWidth}px ${borderType.toLowerCase()} ${borderColor}`
            : "none",
        padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
        boxShadow: shadowMap[boxShadow],
      };
    }

    // Default grid layout
    return {
      ...baseStyles,
      display: "grid",
      gridTemplateColumns: `repeat(${layout.layout.columns}, 1fr)`,
      gridTemplateRows: `repeat(${layout.layout.rows}, minmax(${layout.layout.minHeight}px, auto))`,
    };
  };

  return (
    <DropZone id="component-zone" className="h-full w-full bg-white">
      {navigation && (
        <div className="w-full p-3 flex items-center justify-center">
          <ul className="flex gap-2 items-center justify-center">
            {navigation.items.map((v, i) => (
              <li key={i} className="text-lg hover:underline">
                {v.title}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="min-h-full p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          {layouts.length === 0 ? (
            <div className="h-96 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-lg">
                Drag a layout here to get started
              </p>
            </div>
          ) : (
            layouts
              .sort((a, b) => a.position - b.position)
              .map((layout, layoutIndex) => (
                <ContextMenu key={layout.instanceId}>
                  <ContextMenuTrigger>
                    <div
                      onClick={(e) => {
                        if (
                          e.target === e.currentTarget ||
                          (e.target as HTMLElement).closest(".layout-header")
                        ) {
                          handleSetLayout(layout);
                        }
                      }}
                      className={`bg-white rounded-lg border-2 ${
                        currentSelectedLayout?.instanceId === layout.instanceId
                          ? "border-blue-500"
                          : "border-gray-200"
                      } p-4 relative group hover:border-gray-400 transition-colors cursor-pointer`}
                    >
                      <div className="absolute -top-3 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded px-2 py-1 shadow-md z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveLayout(layout.instanceId, "up");
                          }}
                          disabled={layoutIndex === 0}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveLayout(layout.instanceId, "down");
                          }}
                          disabled={layoutIndex === layouts.length - 1}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateLayout(layout);
                          }}
                          className="p-1 hover:bg-green-100 rounded text-green-600"
                          title="Duplicate layout"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetLayout(layout);
                          }}
                          className="p-1 hover:bg-blue-100 rounded text-blue-600"
                          title="Edit layout settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLayout(layout.instanceId);
                          }}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                          title="Delete layout"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mb-2 layout-header">
                        <span className="text-sm font-medium text-gray-600">
                          {layout.name}
                        </span>
                      </div>

                      <div style={getLayoutStyles(layout)}>
                        {layout.layout
                          .getGridAreas()
                          .flat()
                          .map((zone, zoneIndex) => {
                            const zoneKey = `zone-${zoneIndex}`;
                            const zoneComponents =
                              layout.components[zoneKey] || [];

                            return (
                              <div
                                key={`${layout.instanceId}-${zoneIndex}`}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-37.5 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                                onDragOver={handleDragOver}
                                onDrop={(e) =>
                                  handleDrop(e, layout.instanceId, zoneIndex)
                                }
                              >
                                {zoneComponents.length === 0 ? (
                                  <DropZone
                                    id={`${layout.instanceId}-zone-${zoneIndex}`}
                                    className="h-full"
                                  >
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                      Drop component here
                                    </div>
                                  </DropZone>
                                ) : (
                                  <div className="space-y-2">
                                    {zoneComponents.map((comp, compIndex) => (
                                      <ContextMenu key={comp.instanceId}>
                                        <ContextMenuTrigger>
                                          <div
                                            draggable
                                            onDragStart={(e) =>
                                              handleDragStart(
                                                e,
                                                layout.instanceId,
                                                zoneIndex,
                                                compIndex,
                                                comp,
                                              )
                                            }
                                            onDragEnd={handleDragEnd}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => {
                                              e.stopPropagation();
                                              handleDrop(
                                                e,
                                                layout.instanceId,
                                                zoneIndex,
                                                compIndex,
                                              );
                                            }}
                                            className={`group/component cursor-move rounded transition-all relative ${
                                              currentSelectedComponent?.instanceId ===
                                              comp.instanceId
                                                ? "ring-2 ring-blue-500"
                                                : "hover:ring-2 hover:ring-gray-300"
                                            }`}
                                          >
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover/component:opacity-100 transition-opacity">
                                              <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                                            </div>

                                            <div className="absolute -top-2 right-2 flex gap-1 opacity-0 group-hover/component:opacity-100 transition-opacity bg-white rounded shadow-md z-10">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleMoveComponent(
                                                    layout.instanceId,
                                                    zoneIndex,
                                                    compIndex,
                                                    "up",
                                                  );
                                                }}
                                                disabled={compIndex === 0}
                                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Move up"
                                              >
                                                <ArrowUp className="w-3 h-3" />
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleMoveComponent(
                                                    layout.instanceId,
                                                    zoneIndex,
                                                    compIndex,
                                                    "down",
                                                  );
                                                }}
                                                disabled={
                                                  compIndex ===
                                                  zoneComponents.length - 1
                                                }
                                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Move down"
                                              >
                                                <ArrowDown className="w-3 h-3" />
                                              </button>
                                            </div>

                                            <div
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleSetComponent(comp);
                                              }}
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  comp.content.node.getCode(),
                                              }}
                                            />
                                          </div>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                          <ContextMenuItem
                                            onClick={() =>
                                              handleDuplicateComponent(
                                                layout.instanceId,
                                                zoneIndex,
                                                comp,
                                              )
                                            }
                                            className="focus:bg-green-50"
                                          >
                                            <Copy className="w-4 h-4 mr-2" />
                                            Duplicate
                                          </ContextMenuItem>
                                          <ContextMenuItem
                                            onClick={() =>
                                              handleDeleteComponent(
                                                layout.instanceId,
                                                zoneIndex,
                                                comp.instanceId,
                                              )
                                            }
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                          >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                          </ContextMenuItem>
                                        </ContextMenuContent>
                                      </ContextMenu>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={() => handleSetLayout(layout)}
                      className="focus:bg-blue-50"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Layout Settings
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => handleDuplicateLayout(layout)}
                      className="focus:bg-green-50"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate Layout
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => handleDeleteLayout(layout.instanceId)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Layout
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
          )}
        </div>
      </div>
    </DropZone>
  );
}
