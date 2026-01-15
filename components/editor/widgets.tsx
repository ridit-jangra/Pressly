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
import { ScrollArea } from "../shadcn/scroll-area";

export function Widgets({
  components,
  componentsPages,
  layouts,
  layoutsPages,
}: IWidgetsProps) {
  const [componentPage, setComponentPage] = useState<string>();
  const [layoutPage, setLayoutPage] = useState<string>();

  // Show filtered components
  if (componentPage && !layoutPage) {
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

  // Show filtered layouts
  if (layoutPage && !componentPage) {
    const filteredLayouts = layouts.filter((v) => v.pageId === layoutPage);

    filteredLayouts.forEach((v) => (v.content.node as any).update());

    return (
      <div className="flex flex-col h-full p-2 gap-2">
        <Tooltip>
          <TooltipTrigger className={"w-min"}>
            <Button variant={"ghost"} onClick={() => setLayoutPage("")}>
              <ArrowLeftIcon style={{ width: "24px", height: "auto" }} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Go back</TooltipContent>
        </Tooltip>
        <ScrollArea className="h-full">
          <div className="grid grid-cols-1 w-full gap-3 p-2">
            {filteredLayouts.map((v, i) => {
              const layout = v.content.node as any;
              const gridAreas = layout.getGridAreas();

              return (
                <DraggableItem key={i} id={v.id}>
                  <div className="w-full cursor-move select-none hover:bg-black/10 dark:hover:bg-white/10 bg-muted rounded-lg flex flex-col gap-2 border-2 p-3 transition-colors">
                    <p className="text-sm font-medium text-center">{v.label}</p>

                    {/* Visual preview of layout */}
                    <div
                      className="grid gap-1 w-full"
                      style={{
                        gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
                        gridTemplateRows: `repeat(${layout.rows}, 30px)`,
                      }}
                    >
                      {gridAreas.flat().map((zone: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-blue-200 dark:bg-blue-800 rounded border border-blue-400 dark:border-blue-600"
                        />
                      ))}
                    </div>
                  </div>
                </DraggableItem>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Show main menu
  return (
    <ScrollArea className={"h-[calc(100vh-9.5rem)]"}>
      <div className="p-2 space-y-2">
        {/* Layouts Section */}
        <Collapsible defaultOpen className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between px-4">
            <h4 className="text-sm font-semibold">Layouts</h4>
            <CollapsibleTrigger>
              <Button variant="ghost" size="icon">
                <ChevronsUpDown />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="grid h-full w-full gap-3 p-2 grid-cols-2">
            {layoutsPages.map((v, i) => (
              <div
                key={i}
                className="w-full h-32 cursor-pointer select-none hover:bg-black/10 dark:hover:bg-white/10 bg-muted rounded-lg flex flex-col gap-1 border-2 items-center justify-center transition-colors"
                onClick={() => setLayoutPage(v.id)}
              >
                <v.icon style={{ width: "40px", height: "auto" }} />
                <p className="text-sm font-medium">{v.name}</p>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Components Section */}
        <Collapsible defaultOpen className="flex w-full flex-col gap-2">
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
                className="w-full h-32 cursor-pointer select-none hover:bg-black/10 dark:hover:bg-white/10 bg-muted rounded-lg flex flex-col gap-1 border-2 items-center justify-center transition-colors"
                onClick={() => setComponentPage(v.id)}
              >
                <v.icon style={{ width: "40px", height: "auto" }} />
                <p className="text-sm font-medium">{v.name}</p>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ScrollArea>
  );
}
