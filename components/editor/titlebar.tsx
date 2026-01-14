"use client";

import { site } from "@/data/sample/user";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn/tooltip";
import { ITitlebarProps, ITitlebarTool } from "@/lib/types";
import { useEffect } from "react";
import {
  MonitorIcon,
  SaveIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import { Button } from "../shadcn/button";

export function Titlebar({
  setCurrentViewTool,
  setViewTools,
  viewTools,
  currentViewTool,
}: ITitlebarProps) {
  useEffect(() => {
    const tools: ITitlebarTool[] = [
      {
        id: "computer-tool",
        icon: MonitorIcon,
        name: "Select Tool",
        onClick: () => {
          setCurrentViewTool("computer-tool");
        },
        tooltip: "Computer View",
      },
      {
        id: "tab-tool",
        icon: TabletIcon,
        name: "Tab Tool",
        onClick: () => {
          setCurrentViewTool("tab-tool");
        },
        tooltip: "Tab View",
      },
      {
        id: "mobile-tool",
        icon: SmartphoneIcon,
        name: "Mobile Tool",
        onClick: () => {
          setCurrentViewTool("mobile-tool");
        },
        tooltip: "Mobile View",
      },
    ];

    setViewTools(tools);
  }, []);

  return (
    <div className="flex items-center justify-between h-18 w-[calc(100vw-88px)] px-4 border-b">
      <span className="flex flex-col">
        <p className="font-medium text-2xl">{site.name}</p>
        <p className="text-sm">Post Editor</p>
      </span>
      <div className="flex bg-muted rounded-lg">
        {viewTools.map((v, i) => (
          <Tooltip key={i}>
            <TooltipTrigger>
              <Button
                variant={"ghost"}
                className={`${
                  currentViewTool === v.id &&
                  "bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15"
                }`}
                onClick={v.onClick}
              >
                <v.icon style={{ width: "20px", height: "auto" }} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{v.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant={"ghost"}
              className={"text-black/60 dark:text-white/60"}
            >
              <SaveIcon style={{ width: "20px", height: "auto" }} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save Draft</TooltipContent>
        </Tooltip>
        <Button>Publish</Button>
      </div>
    </div>
  );
}
