import { IDropZoneProps } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";

export function DropZone({ id, children, className }: IDropZoneProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className={`relative w-full min-h-full ${className}`}>
      {children}
    </div>
  );
}
