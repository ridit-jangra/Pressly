import { IEditorProps } from "@/lib/types";
import { DropZone } from "../ui/dropZone";
import { DraggableItem } from "../ui/draggableItem";

export function Editor({
  draggableComponents,
  setCurrentSelectedComponent,
  currentSelectedComponent,
}: IEditorProps) {
  const itemsInZone = draggableComponents.filter(
    (component) => component.inZone
  );

  return (
    <div className="bg-muted h-full w-full flex items-center justify-center p-16">
      <div className="bg-background w-full h-full rounded-lg">
        <DropZone id="component-zone">
          {itemsInZone.map((item) => {
            const style: React.CSSProperties = item.position
              ? {
                  position: "absolute",
                  left: `${item.position.x}px`,
                  top: `${item.position.y}px`,
                }
              : {};

            return (
              <div key={item.id} style={style}>
                <DraggableItem id={item.id}>
                  <span
                    onClick={() => setCurrentSelectedComponent(item)}
                    dangerouslySetInnerHTML={{
                      __html: item.content.node?.getCode(),
                    }}
                  />
                </DraggableItem>
              </div>
            );
          })}
          {itemsInZone.length === 0 && (
            <p className="text-muted-foreground text-center">Drag items here</p>
          )}
        </DropZone>
      </div>
    </div>
  );
}
