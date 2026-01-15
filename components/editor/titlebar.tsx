"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn/tooltip";
import { IPage, ITitlebarProps, ITitlebarTool } from "@/lib/types";
import { useEffect, useState } from "react";
import { MonitorIcon, SmartphoneIcon, TabletIcon } from "lucide-react";
import { Button } from "../shadcn/button";

export function Titlebar({
  setCurrentViewTool,
  setViewTools,
  viewTools,
  currentViewTool,
  page,
  setPage,
  handleSavePage,
  pageTitle,
  setPageTitle,
  isSaveDisable,
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

  const handleChangePageTitle = (title: string) => {
    setPageTitle(title);
  };

  useEffect(() => {
    const updatedPage: IPage = {
      ...page,
      title: pageTitle,
    };

    setPage(updatedPage);
  }, [pageTitle]);

  return (
    <div className="flex items-center justify-between h-18 w-[calc(100vw-88px)] px-4 border-b">
      <span className="flex flex-col">
        <input
          className="font-medium text-xl bg-transparent focus:outline-0"
          value={pageTitle}
          onChange={(e) => handleChangePageTitle(e.target.value)}
        />
        <p className="text-sm">Page Editor</p>
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
        <Button onClick={handleSavePage} disabled={isSaveDisable}>
          Save
        </Button>
      </div>
    </div>
  );
}
