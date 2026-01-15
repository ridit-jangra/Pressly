"use client";

import { IEditorProps, IExtendedComponent, IExtendedLayout } from "@/lib/types";
import { DropZone } from "../ui/dropZone";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../shadcn/context-menu";
import { Trash2, ArrowUp, ArrowDown, Settings } from "lucide-react";

export function Editor({
  draggableComponents,
  setCurrentSelectedComponent,
  currentSelectedComponent,
  currentSelectedLayout,
  setCurrentSelectedLayout,
  formValues,
  setDraggableComponents,
  page,
  layouts,
  setLayouts,
}: IEditorProps & {
  layouts: IExtendedLayout[];
  currentSelectedLayout: IExtendedLayout | null;
  setCurrentSelectedLayout: (layout: IExtendedLayout | null) => void;
  setLayouts: (
    layouts:
      | IExtendedLayout[]
      | ((prev: IExtendedLayout[]) => IExtendedLayout[])
  ) => void;
}) {
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
    instanceId: string
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
                (comp) => comp.instanceId !== instanceId
              ),
            },
          };
        }
        return layout;
      })
    );

    if (currentSelectedComponent?.instanceId === instanceId) {
      setCurrentSelectedComponent(null as any);
    }
  };

  const handleDeleteLayout = (layoutId: string) => {
    setLayouts((prev) =>
      prev.filter((layout) => layout.instanceId !== layoutId)
    );

    if (currentSelectedLayout?.instanceId === layoutId) {
      setCurrentSelectedLayout(null);
    }
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

  return (
    <DropZone id="component-zone" className="h-full w-full bg-white">
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
                        // Only select layout if clicking the layout container itself
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
                      {/* Layout Controls */}
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

                      <div
                        className="grid"
                        style={{
                          gap: `${layout.layout.gap}px`,
                          padding: `${layout.layout.padding}px`,
                          backgroundColor: layout.layout.backgroundColor,
                          borderRadius: `${layout.layout.borderRadius}px`,
                          gridTemplateColumns:
                            layout.layout.id === "sidebar-layout"
                              ? (layout.layout as any).getSidebarWidth()
                              : `repeat(${layout.layout.columns}, 1fr)`,
                          gridTemplateRows: `repeat(${layout.layout.rows}, minmax(${layout.layout.minHeight}px, auto))`,
                        }}
                      >
                        {layout.layout
                          .getGridAreas()
                          .flat()
                          .map((zone, zoneIndex) => {
                            const zoneKey = `zone-${zoneIndex}`;
                            const zoneComponents =
                              layout.components[zoneKey] || [];

                            return (
                              <DropZone
                                key={`${layout.instanceId}-${zoneIndex}`}
                                id={`${layout.instanceId}-zone-${zoneIndex}`}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-37.5 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                              >
                                {zoneComponents.length === 0 ? (
                                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                    Drop component here
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {zoneComponents.map((comp) => (
                                      <ContextMenu key={comp.instanceId}>
                                        <ContextMenuTrigger>
                                          <div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSetComponent(comp);
                                            }}
                                            className={`cursor-pointer ${
                                              currentSelectedComponent?.instanceId ===
                                              comp.instanceId
                                                ? "ring-2 ring-blue-500"
                                                : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                comp.content.node.getCode(),
                                            }}
                                          ></div>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                          <ContextMenuItem
                                            onClick={() =>
                                              handleDeleteComponent(
                                                layout.instanceId,
                                                zoneIndex,
                                                comp.instanceId
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
                              </DropZone>
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
