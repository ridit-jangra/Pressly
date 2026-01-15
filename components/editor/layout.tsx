"use client";

import { useEffect, useState, useRef } from "react";
import { ActivityBar } from "./activitybar";
import {
  IActivitybarTool,
  IComponent,
  IComponentPage,
  IComponentState,
  IExtendedComponent,
  IExtendedLayout,
  ILayoutComponent,
  ILayoutPage,
  IPage,
  ISite,
  IUser,
} from "@/lib/types";
import { Titlebar } from "./titlebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../shadcn/resizable";
import { Sidebar } from "./sidebar";
import { Editor } from "./editor";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { ComponentEditor } from "./component-editor";
import { Component } from "../site/component";
import { AuthService } from "@/lib/authService";
import { Storage } from "@/lib/storage";
import { toast } from "sonner";
import { LayoutComponentBase } from "../site/layoutComponent";
import { MinusIcon, PlusIcon } from "lucide-react";

export function EditorLayout({ page: InitPage }: { page: IPage }) {
  const [site, setSite] = useState<ISite | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [page, setPage] = useState<IPage>(InitPage);
  const [isSaveDisable, setIsSaveDisabled] = useState<boolean>(true);
  const [pageTitle, setPageTitle] = useState<string>(page.title);
  const [cursorTools, setCursorTools] = useState<IActivitybarTool[]>([]);
  const [currentCursorTool, setCurrentCursorTool] = useState<string>();
  const [viewTools, setViewTools] = useState<IActivitybarTool[]>([]);
  const [currentViewTool, setCurrentViewTool] = useState<string>();
  const [components, setComponents] = useState<IComponent[]>([]);
  const [componentsPages, setComponentsPages] = useState<IComponentPage[]>([]);
  const [layoutComponents, setLayoutComponents] = useState<ILayoutComponent[]>(
    []
  );
  const [layouts, setLayouts] = useState<IExtendedLayout[]>([]);
  const [layoutsPages, setLayoutsPages] = useState<ILayoutPage[]>([]);
  const [currentSelectedComponent, setCurrentSelectedComponents] =
    useState<IExtendedComponent | null>(null);
  const [currentSelectedLayout, setCurrentSelectedLayout] =
    useState<IExtendedLayout | null>(null);
  const [draggableComponents, setDraggableComponents] = useState<
    IExtendedComponent[]
  >([]);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // Canvas transform state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const overId = String(over.id);

    // Check if dropping a layout onto the main zone
    if (overId === "component-zone") {
      const layout = layoutComponents.find((l) => l.id === active.id);

      if (layout) {
        const LayoutClass = layout.content.node
          .constructor as new () => LayoutComponentBase;
        const newLayoutInstance = new LayoutClass();

        const initialState: any = {};
        newLayoutInstance.childOptions?.forEach((child) => {
          child.options.forEach((option) => {
            const key = `${child.parentId}-${option.label}`;
            initialState[key] = option.default ?? "";
          });
        });

        newLayoutInstance.applyState(initialState);

        const layoutInstanceId = `layout-${Date.now()}`;

        const newLayout: IExtendedLayout = {
          id: layout.id,
          instanceId: layoutInstanceId,
          type: layout.id,
          name: layout.label,
          layout: newLayoutInstance,
          position: layouts.length,
          components: {},
          state: initialState,
        };

        setLayouts((prev) => [...prev, newLayout]);
        return;
      }
    }

    // Check if dropping a component into a layout zone
    if (overId.includes("-zone-")) {
      const parts = overId.split("-zone-");
      const layoutInstanceId = parts[0];
      const zoneIndex = parts[1];

      const component = components.find((c) => c.id === active.id);
      if (component) {
        const ComponentClass = component.content.node
          .constructor as new () => Component;
        const newNode = new ComponentClass();

        const initialState: IComponentState = {};
        newNode.childOptions?.forEach((child) => {
          child.options.forEach((option) => {
            const key = `${child.parentId}-${option.label}`;
            initialState[key] = option.default ?? "";
          });
        });

        newNode.applyState(initialState);

        const instanceId = `${component.id}-${Date.now()}`;

        const newComponent: IExtendedComponent = {
          id: component.id,
          instanceId: instanceId,
          label: component.label,
          content: { node: newNode },
          inZone: true,
          position: null,
          state: initialState,
        };

        setLayouts((prev) =>
          prev.map((layout) => {
            if (layout.instanceId === layoutInstanceId) {
              const zoneKey = `zone-${zoneIndex}`;
              return {
                ...layout,
                components: {
                  ...layout.components,
                  [zoneKey]: [
                    ...(layout.components[zoneKey] || []),
                    newComponent,
                  ],
                },
              };
            }
            return layout;
          })
        );
      }
    }
  }

  // Canvas pan and zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      const newScale = Math.min(Math.max(0.1, scale + delta), 3);
      setScale(newScale);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      setIsPanning(true);
      setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPosition({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (cursorTools && cursorTools.length > 0)
      setCurrentCursorTool(cursorTools[1].id);
  }, [cursorTools]);

  useEffect(() => {
    if (viewTools && viewTools.length > 0) setCurrentViewTool(viewTools[0].id);
  }, [viewTools]);

  useEffect(() => {
    const getSite = async () => {
      const v = await AuthService.getSiteData();
      setSite(v);
    };

    getSite();
  }, []);

  useEffect(() => {
    setIsSaveDisabled(false);
  }, [pageTitle, layouts, formValues]);

  useEffect(() => {
    const getUser = async () => {
      const v = await AuthService.getCurrentUser();
      setUser(v!);
    };

    getUser();
  }, []);

  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    if (
      InitPage.body?.components &&
      Array.isArray(InitPage.body.components) &&
      layoutComponents.length > 0
    ) {
      const reconstructedLayouts = InitPage.body.components
        .map((savedLayout: any) => {
          const layoutDef = layoutComponents.find(
            (l) => l.id === savedLayout.id
          );

          if (layoutDef) {
            const LayoutClass = layoutDef.content.node
              .constructor as new () => LayoutComponentBase;
            const newLayoutInstance = new LayoutClass();
            newLayoutInstance.applyState(savedLayout.state || {});

            const reconstructedComponents: {
              [key: string]: IExtendedComponent[];
            } = {};
            Object.keys(savedLayout.components || {}).forEach((zoneKey) => {
              reconstructedComponents[zoneKey] = savedLayout.components[zoneKey]
                .map((savedComp: any) => {
                  const componentDef = components.find(
                    (c) => c.id === savedComp.id
                  );
                  if (componentDef) {
                    const ComponentClass = componentDef.content.node
                      .constructor as new () => Component;
                    const newNode = new ComponentClass();
                    newNode.applyState(savedComp.state || {});

                    return {
                      id: savedComp.id,
                      instanceId: savedComp.instanceId,
                      label: savedComp.label,
                      content: { node: newNode },
                      inZone: true,
                      position: null,
                      state: savedComp.state,
                    } as IExtendedComponent;
                  }
                  return null;
                })
                .filter(Boolean);
            });

            return {
              id: savedLayout.id,
              instanceId: savedLayout.instanceId,
              type: savedLayout.type,
              name: savedLayout.name,
              layout: newLayoutInstance,
              position: savedLayout.position,
              components: reconstructedComponents,
              state: savedLayout.state,
            } as IExtendedLayout;
          }
          return null;
        })
        .filter(Boolean) as IExtendedLayout[];

      setLayouts(reconstructedLayouts);
    }
  }, [InitPage, components, layoutComponents]);

  const handleSavePage = async () => {
    try {
      const existingPages = (await Storage.getItem("pages", "pages")) as
        | IPage[]
        | null;

      if (!existingPages || !Array.isArray(existingPages)) {
        toast.error("Error: Could not retrieve pages");
        return;
      }

      const serializedLayouts = layouts.map((layout) => ({
        id: layout.id,
        instanceId: layout.instanceId,
        type: layout.type,
        name: layout.name,
        position: layout.position,
        state: layout.state,
        layoutData: {
          gap: layout.layout.gap,
          padding: layout.layout.padding,
          backgroundColor: layout.layout.backgroundColor,
          borderRadius: layout.layout.borderRadius,
          minHeight: layout.layout.minHeight,
        },
        components: Object.keys(layout.components).reduce((acc, zoneKey) => {
          acc[zoneKey] = layout.components[zoneKey].map((comp) => ({
            id: comp.id,
            instanceId: comp.instanceId,
            label: comp.label,
            state: comp.state,
            componentData: {
              tag: comp.content.node.tag,
              text: comp.content.node.text,
              classes: comp.content.node.classes,
              styles: comp.content.node.styles,
              code: comp.content.node.code,
            },
          }));
          return acc;
        }, {} as any),
      }));

      const updatedPage: IPage = {
        ...page,
        title: pageTitle,
        head: {
          ...page.head,
          title: pageTitle,
        },
        updatedAt: formatDate(new Date()),
        body: {
          components: serializedLayouts as any,
        },
      };

      const updatedPages = existingPages.map((p) =>
        p.id === updatedPage.id ? updatedPage : p
      );

      await Storage.setItem("pages", "pages", updatedPages);

      setPage(updatedPage);
      setIsSaveDisabled(true);

      toast.success("Page saved successfully.");
    } catch (err) {
      console.error("Save error:", err);
      toast.error(`Error saving page: ${err}`);
    }
  };

  const hasSelection = currentSelectedComponent || currentSelectedLayout;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {site && user && (
        <div className="flex min-h-screen w-full bg-background">
          <ActivityBar
            cursorTools={cursorTools}
            setCursorTools={setCursorTools}
            currentCursorTool={currentCursorTool}
            setCurrentCursorTool={setCurrentCursorTool}
            user={user}
          />
          <div className="flex flex-col w-full">
            <Titlebar
              viewTools={viewTools}
              setViewTools={setViewTools}
              currentViewTool={currentViewTool}
              setCurrentViewTool={setCurrentViewTool}
              page={page}
              setPage={setPage}
              site={site}
              handleSavePage={handleSavePage}
              pageTitle={pageTitle}
              setPageTitle={setPageTitle}
              isSaveDisable={isSaveDisable}
              setIsSaveDisable={setIsSaveDisabled}
            />
            <ResizablePanelGroup
              direction="horizontal"
              className="h-[calc(100vh-72px)]"
            >
              <ResizablePanel defaultSize={25} minSize={15} maxSize={35}>
                <Sidebar
                  components={components}
                  setComponents={setComponents}
                  componentsPages={componentsPages}
                  setComponentsPages={setComponentsPages}
                  layouts={layoutComponents}
                  setLayouts={setLayoutComponents}
                  layoutsPages={layoutsPages}
                  setLayoutsPages={setLayoutsPages}
                />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={hasSelection ? 50 : 75}>
                <div className="relative h-full w-full bg-gray-100">
                  <div className="absolute bottom-4 right-4 z-10 flex gap-2 bg-white rounded-lg shadow-lg p-2">
                    <button
                      onClick={() => setScale(Math.min(scale + 0.1, 3))}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                      title="Zoom In"
                    >
                      <PlusIcon />
                    </button>
                    <span className="px-3 py-1 text-sm">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      onClick={() => setScale(Math.max(scale - 0.1, 0.1))}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                      title="Zoom Out"
                    >
                      <MinusIcon />
                    </button>
                    <button
                      onClick={resetView}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                      title="Reset View"
                    >
                      Reset
                    </button>
                  </div>

                  <div
                    ref={canvasRef}
                    className="h-full w-full max-h-[calc(100vh-72px)] overflow-hidden"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ cursor: isPanning ? "grabbing" : "grab" }}
                  >
                    <div
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: "0 0",
                        transition: isPanning
                          ? "none"
                          : "transform 0.1s ease-out",
                      }}
                    >
                      <Editor
                        draggableComponents={draggableComponents}
                        setDraggableComponents={setDraggableComponents}
                        currentSelectedComponent={currentSelectedComponent}
                        setCurrentSelectedComponent={
                          setCurrentSelectedComponents
                        }
                        currentSelectedLayout={currentSelectedLayout}
                        setCurrentSelectedLayout={setCurrentSelectedLayout}
                        formValues={formValues}
                        page={page}
                        layouts={layouts}
                        setLayouts={setLayouts}
                      />
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              {hasSelection && (
                <>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={25} minSize={15} maxSize={35}>
                    <ComponentEditor
                      currentSelectedComponent={currentSelectedComponent}
                      setCurrentSelectedComponent={setCurrentSelectedComponents}
                      currentSelectedLayout={currentSelectedLayout}
                      setCurrentSelectedLayout={setCurrentSelectedLayout}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      setDraggableComponents={setDraggableComponents}
                      draggableComponents={draggableComponents}
                      layouts={layouts}
                      setLayouts={setLayouts}
                      setPage={setPage}
                      page={page}
                    />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </div>
        </div>
      )}
    </DndContext>
  );
}
