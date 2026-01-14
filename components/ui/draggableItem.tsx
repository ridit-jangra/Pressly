import { IDraggableItemProps } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { JSX } from "react";

export function DraggableItem({
  id,
  children,
  className,
}: IDraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex ${
        isDragging ? "opacity-50" : "opacity-100"
      } z-10 h-min w-full ${className}`}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
