"use client";

import { IWidgetsProps } from "@/lib/types";
import { ArrowLeftIcon, ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../shadcn/collapsible";
import { useState } from "react";
import { Button } from "../shadcn/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn/tooltip";
import { DraggableItem } from "../ui/draggableItem";

export function Widgets({ components, componentsPages }: IWidgetsProps) {
  const [componentPage, setComponentPage] = useState<string>();
  const [isOpen, setIsOpen] = useState(true);

  if (componentPage) {
    const filteredComponents = components.filter(
      (v) => v.pageId === componentPage
    );

    filteredComponents.forEach((v) => (v.content.node as any).update());

    return (
      <div className="flex flex-col h-full p-2 gap-2">
        <Tooltip>
          <TooltipTrigger className={"w-min"}>
            <Button variant={"ghost"} onClick={() => setComponentPage("")}>
              <ArrowLeftIcon style={{ width: "24px", height: "auto" }} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Go back</TooltipContent>
        </Tooltip>
        <div className="grid grid-cols-2 h-full w-full gap-3">
          {filteredComponents.map((v, i) => (
            <DraggableItem key={i} id={v.id}>
              <div className="w-full h-48 cursor-pointer select-none hover:bg-black/10 dark:hover:bg-white/10 bg-muted rounded-lg flex flex-col gap-1 border-2 items-center justify-center transition-colors">
                <p className="text-lg max-w-full truncate">{v.label}</p>
              </div>
            </DraggableItem>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2"
    >
      <div className="flex items-center justify-between px-4">
        <h4 className="text-sm font-semibold">Components</h4>
        <CollapsibleTrigger>
          <Button variant="ghost" size="icon">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="grid h-full w-full gap-3 p-2 grid-cols-2">
        {componentsPages.map((v, i) => (
          <div
            key={i}
            className="w-full h-48 cursor-pointer select-none hover:bg-black/10 dark:hover:bg-white/10 bg-muted rounded-lg flex flex-col gap-1 border-2 items-center justify-center transition-colors"
            onClick={() => setComponentPage(v.id)}
          >
            <v.icon style={{ width: "50px", height: "auto" }} />
            <p className="text-lg">{v.name}</p>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
