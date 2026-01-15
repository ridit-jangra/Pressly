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

export function Layout() {
  const [site, setSite] = useState<ISite | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
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

    setDraggableComponents((prev) => {
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
    const getUser = async () => {
      const v = await AuthService.getCurrentUser();
      setUser(v!);
    };

    getUser();
  }, []);

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
              site={site}
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
