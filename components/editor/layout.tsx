"use client";

import { useEffect, useState } from "react";
import { ActivityBar } from "./activitybar";
import {
  IActivitybarTool,
  IComponent,
  IComponentPage,
  IExtendedComponent,
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

export function Layout() {
  const [cursorTools, setCursorTools] = useState<IActivitybarTool[]>([]);
  const [currentCursorTool, setCurrentCursorTool] = useState<string>();
  const [viewTools, setViewTools] = useState<IActivitybarTool[]>([]);
  const [currentViewTool, setCurrentViewTool] = useState<string>();
  const [components, setComponents] = useState<IComponent[]>([]);
  const [componentsPages, setComponentsPages] = useState<IComponentPage[]>([]);
  const [currentSelectedComponent, setCurrentSelectedComponents] =
    useState<IExtendedComponent>();
  const [draggableComponents, setDraggableComponents] = useState<
    IExtendedComponent[]
  >([]);

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
      const existingItem = prev.find((item) => item.id === active.id);

      if (existingItem) {
        return prev.map((item) => {
          if (item.id === active.id && item.position) {
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
          const newComponent: IExtendedComponent = {
            id: `${component.id}-${Date.now()}`,
            label: component.label,
            content: component.content,
            inZone: true,
            position: { x: delta.x, y: delta.y },
          };
          return [...prev, newComponent];
        }
      }

      return prev;
    });
  }

  useEffect(() => {
    if (cursorTools && cursorTools.length > 0)
      setCurrentCursorTool(cursorTools[0].id);
  }, [cursorTools]);

  useEffect(() => {
    if (viewTools && viewTools.length > 0) setCurrentViewTool(viewTools[0].id);
  }, [viewTools]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex min-h-screen w-full bg-background">
        <ActivityBar
          cursorTools={cursorTools}
          setCursorTools={setCursorTools}
          currentCursorTool={currentCursorTool}
          setCurrentCursorTool={setCurrentCursorTool}
        />
        <div className="flex flex-col w-full">
          <Titlebar
            viewTools={viewTools}
            setViewTools={setViewTools}
            currentViewTool={currentViewTool}
            setCurrentViewTool={setCurrentViewTool}
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
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={currentSelectedComponent ? 50 : 75}>
              <Editor
                draggableComponents={draggableComponents}
                setDraggableComponents={setDraggableComponents}
                currentSelectedComponent={currentSelectedComponent}
                setCurrentSelectedComponent={setCurrentSelectedComponents}
              />
            </ResizablePanel>
            {currentSelectedComponent && (
              <>
                <ResizableHandle />
                <ResizablePanel defaultSize={25} minSize={15} maxSize={35}>
                  <ComponentEditor
                    currentSelectedComponent={currentSelectedComponent}
                    setCurrentSelectedComponent={setCurrentSelectedComponents}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </DndContext>
  );
}
