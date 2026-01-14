"use client";

import { IEditorProps, IExtendedComponent } from "@/lib/types";
import { DropZone } from "../ui/dropZone";
import { DraggableItem } from "../ui/draggableItem";
import { useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../shadcn/context-menu";
import { Trash2 } from "lucide-react";

export function Editor({
  draggableComponents,
  setCurrentSelectedComponent,
  currentSelectedComponent,
  formValues,
  setDraggableComponents,
}: IEditorProps) {
  const [itemsInZone, setItemsInZone] = useState<IExtendedComponent[]>([]);

  const handleSetComponent = (v: IExtendedComponent) => {
    setCurrentSelectedComponent(v);
  };

  useEffect(() => {
    setItemsInZone(draggableComponents.filter((component) => component.inZone));
  }, [draggableComponents]);

  const handleDeleteComponent = (instanceId: string) => {
    setDraggableComponents(
      draggableComponents.filter((item) => item.instanceId !== instanceId)
    );

    if (currentSelectedComponent?.instanceId === instanceId) {
      setCurrentSelectedComponent(null as any);
    }
  };

  return (
    <div className="bg-muted h-full w-full flex items-center justify-center p-16">
      <div className="bg-background w-full h-full rounded-lg">
        <DropZone id="component-zone">
          {itemsInZone.map((v) => {
            if (!v || !v.content.node) return null;

            const style: React.CSSProperties = {
              position: "absolute",
              left: v.position ? `${v.position.x}px` : 0,
              top: v.position ? `${v.position.y}px` : 0,
              ...v.content.node.styles,
            };

            return (
              <div key={v.instanceId} style={style}>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <DraggableItem id={v.instanceId}>
                      <div
                        onClick={() => handleSetComponent(v)}
                        className={`${v.content.node.classes.join(" ")} ${
                          currentSelectedComponent?.instanceId === v.instanceId
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        style={v.content.node.styles}
                      >
                        {v.content.node.text}
                      </div>
                    </DraggableItem>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem
                      onClick={() => handleDeleteComponent(v.instanceId)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            );
          })}
          {itemsInZone.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Drag items here
              </p>
            </div>
          )}
        </DropZone>
      </div>
    </div>
  );
}
