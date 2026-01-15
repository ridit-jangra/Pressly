import {
  IActivitybarProps,
  IActivitybarOption,
  IActivitybarTool,
  IUser,
} from "@/lib/types";
import {
  ArrowLeftIcon,
  MousePointer2Icon,
  SettingsIcon,
  TextCursorIcon,
  UserIcon,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../shadcn/tooltip";
import { Button } from "../shadcn/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ActivityBar({
  cursorTools,
  setCursorTools,
  currentCursorTool,
  setCurrentCursorTool,
  user,
}: IActivitybarProps) {
  const router = useRouter();

  const [options, setOptions] = useState<IActivitybarOption[]>([
    {
      id: "settings",
      title: "Settings",
      icon: SettingsIcon,
      description: "Settings",
      tooltip: "Settings",
    },
    {
      id: "profile",
      title: user!.name,
      icon: UserIcon,
      description: user!.name,
      tooltip: user!.name,
    },
  ]);

  useEffect(() => {
    const tools: IActivitybarTool[] = [
      {
        id: "go-back",
        icon: ArrowLeftIcon,
        name: "Go Back",
        onClick: () => {
          router.back();
        },
        tooltip: "Go Back",
      },
      {
        id: "select-tool",
        icon: MousePointer2Icon,
        name: "Select Tool",
        onClick: () => {
          setCurrentCursorTool("select-tool");
        },
        tooltip: "Select Tool",
      },
      {
        id: "text-tool",
        icon: TextCursorIcon,
        name: "Text Tool",
        onClick: () => {
          setCurrentCursorTool("text-tool");
        },
        tooltip: "Text Tool",
      },
    ];

    setCursorTools(tools);
  }, []);

  return (
    <div className="flex flex-col h-screen items-center justify-between min-w-22 py-6 border-r">
      <div className="flex flex-col gap-4">
        {cursorTools.map((v, i) => (
          <Tooltip key={i}>
            <TooltipTrigger>
              <Button
                variant={"outline"}
                className={`p-4 py-7 rounded-full ${
                  currentCursorTool === v.id &&
                  "bg-black/10 border-black/40 hover:bg-black/15 dark:bg-white/15 dark:border-white/40 dark:hover:bg-white/20"
                }`}
                onClick={v.onClick}
              >
                <v.icon style={{ width: "25px", height: "auto" }} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{v.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {options.map((v, i) => (
          <Tooltip key={i}>
            <TooltipTrigger>
              <Button variant={"outline"} className="p-4 py-7 rounded-full">
                <v.icon style={{ width: "25px", height: "auto" }} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{v.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
