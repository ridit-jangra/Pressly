"use client";

import {
  IComponent,
  IComponentPage,
  ILayoutComponent,
  ILayoutPage,
  ISidebarProps,
} from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import { Layers } from "./layers";
import { Widgets } from "./widgets";
import { useEffect } from "react";
import { primaryButton } from "../site/components/button";
import {
  Grid2X2,
  Grid3X3,
  ImageIcon,
  LinkIcon,
  MapIcon,
  MicIcon,
  SparklesIcon,
  TextCursorIcon,
  ToggleLeftIcon,
  VideoIcon,
} from "lucide-react";

export function Sidebar({
  components,
  setComponents,
  componentsPages,
  setComponentsPages,
  layouts,
  setLayouts,
  layoutsPages,
  setLayoutsPages,
}: ISidebarProps) {
  const tabs = [
    {
      value: "widgets",
      label: "Widgets",
      tooltip: "Widgets",
    },
    {
      value: "layers",
      label: "Layers",
      tooltip: "Widgets",
    },
  ];

  useEffect(() => {
    const components: IComponent[] = [
      {
        pageId: "button",
        id: "primary-button",
        label: "Primary Button",
        content: { node: new primaryButton() },
      },
    ];
    const componentsPages: IComponentPage[] = [
      {
        id: "button",
        name: "Button",
        icon: ToggleLeftIcon,
      },
      {
        id: "text",
        name: "Text",
        icon: TextCursorIcon,
      },
      {
        id: "image",
        name: "Image",
        icon: ImageIcon,
      },
      {
        id: "video",
        name: "Video",
        icon: VideoIcon,
      },
      {
        id: "link",
        name: "Link",
        icon: LinkIcon,
      },
      {
        id: "audio",
        name: "Audio",
        icon: MicIcon,
      },
      {
        id: "icon",
        name: "Icon",
        icon: SparklesIcon,
      },
      {
        id: "map",
        name: "Map",
        icon: MapIcon,
      },
    ];

    const layouts: ILayoutComponent[] = [];

    const layoutPages: ILayoutPage[] = [
      {
        id: "layout-grid-2x2",
        name: "Layout Grid 2x2",
        icon: Grid2X2,
      },
      {
        id: "layout-grid-3x3",
        name: "Layout Grid 3x3",
        icon: Grid3X3,
      },
    ];

    setComponents(components);
    setComponentsPages(componentsPages);

    setLayouts(layouts);
    setLayoutsPages(layoutPages);
  }, []);

  return (
    <div className="flex flex-col h-full pt-3">
      <Tabs className="w-full h-full">
        <TabsList variant={"line"} className="w-full **:text-[16px]">
          {tabs.map((v, i) => (
            <TabsTrigger value={v.value} key={i}>
              {v.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={"widgets"} className={"h-full"}>
          <Widgets
            components={components}
            componentsPages={componentsPages}
            layouts={layouts}
            layoutsPages={layoutsPages}
          />
        </TabsContent>
        <TabsContent value={"layers"} className={"h-full"}>
          <Layers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
