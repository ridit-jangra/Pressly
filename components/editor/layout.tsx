"use client";

import { useEffect, useState } from "react";
import { ActivityBar } from "./activitybar";
import {
  IActivitybarTool,
  IComponent,
  IComponentPage,
  IComponentState,
  IExtendedComponent,
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
  const [layouts, setLayouts] = useState<ILayoutComponent[]>([]);
  const [layoutsPages, setLayoutsPages] = useState<ILayoutPage[]>([]);
  const [currentSelectedComponent, setCurrentSelectedComponents] =
    useState<IExtendedComponent>();
  const [draggableComponents, setDraggableComponents] = useState<
    IExtendedComponent[]
  >([]);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;

    if (!over) return;

    setDraggableComponents((prev: IExtendedComponent[]) => {
      const existingItem = prev.find((item) => item.instanceId === active.id);

      if (existingItem) {
        return prev.map((item) => {
          if (item.instanceId === active.id && item.position) {
            return {
              ...item,
              position: {
                x: item.position.x + delta.x,
                y: item.position.y + delta.y,
              },
            };
          }
          return item;
        });
      } else {
        const component = components.find((c) => c.id === active.id);
        if (component && over.id === "component-zone") {
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
            position: { x: delta.x, y: delta.y },
            state: initialState,
          };
          return [...prev, newComponent];
        }
      }

      return prev;
    });
  }

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
  }, [pageTitle, draggableComponents, formValues]);

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

  // Updated useEffect to reconstruct components from saved data
  useEffect(() => {
    if (InitPage.body?.components && Array.isArray(InitPage.body.components)) {
      const reconstructedComponents = InitPage.body.components
        .map((savedComp: any) => {
          // Find the component definition from your components array
          const componentDef = components.find((c) => c.id === savedComp.id);

          if (componentDef) {
            // Create a new instance of the component class
            const ComponentClass = componentDef.content.node
              .constructor as new () => Component;
            const newNode = new ComponentClass();

            // Apply the saved state to the component
            newNode.applyState(savedComp.state || {});

            // Optionally restore visual properties if they were saved
            if (savedComp.componentData) {
              newNode.tag = savedComp.componentData.tag;
              newNode.text = savedComp.componentData.text;
              newNode.classes = savedComp.componentData.classes;
              newNode.styles = savedComp.componentData.styles;
              newNode.code = savedComp.componentData.code;
            }

            return {
              id: savedComp.id,
              instanceId: savedComp.instanceId,
              label: savedComp.label,
              content: { node: newNode },
              inZone: savedComp.inZone,
              position: savedComp.position,
              state: savedComp.state,
            } as IExtendedComponent;
          }

          return null;
        })
        .filter(Boolean) as IExtendedComponent[];

      setDraggableComponents(reconstructedComponents);
    }
  }, [InitPage, components]);

  // Updated handleSavePage method for EditorLayout component

  const handleSavePage = async () => {
    try {
      const existingPages = (await Storage.getItem("pages", "pages")) as
        | IPage[]
        | null;

      if (!existingPages || !Array.isArray(existingPages)) {
        toast.error("Error: Could not retrieve pages");
        return;
      }

      // Serialize components - save everything needed to reconstruct them
      const serializedComponents = draggableComponents.map((comp) => ({
        id: comp.id,
        instanceId: comp.instanceId,
        label: comp.label,
        inZone: comp.inZone,
        position: comp.position,
        state: comp.state,
        // Store the component's current visual properties
        componentData: {
          tag: comp.content.node.tag,
          text: comp.content.node.text,
          classes: comp.content.node.classes,
          styles: comp.content.node.styles,
          code: comp.content.node.code,
        },
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
          components: serializedComponents as any,
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
                  layouts={layouts}
                  setLayouts={setLayouts}
                  layoutsPages={layoutsPages}
                  setLayoutsPages={setLayoutsPages}
                />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={currentSelectedComponent ? 50 : 75}>
                <Editor
                  draggableComponents={draggableComponents}
                  setDraggableComponents={setDraggableComponents}
                  currentSelectedComponent={currentSelectedComponent}
                  setCurrentSelectedComponent={setCurrentSelectedComponents}
                  formValues={formValues}
                  page={page}
                />
              </ResizablePanel>
              {currentSelectedComponent && (
                <>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={25} minSize={15} maxSize={35}>
                    <ComponentEditor
                      currentSelectedComponent={currentSelectedComponent}
                      setCurrentSelectedComponent={setCurrentSelectedComponents}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      setDraggableComponents={setDraggableComponents}
                      draggableComponents={draggableComponents}
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
