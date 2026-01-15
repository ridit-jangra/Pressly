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
  ImageIcon,
  LinkIcon,
  MapIcon,
  MicIcon,
  SparklesIcon,
  TextCursorIcon,
  ToggleLeftIcon,
  VideoIcon,
  LayoutGrid,
} from "lucide-react";
import {
  Grid2x2Layout,
  ThreeColumnLayout,
  HeroLayout,
  SidebarLayout,
  TwoColumnLayout,
} from "../site/layouts/";

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
      tooltip: "Layers",
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

    // Define all layout components
    const layoutComponents: ILayoutComponent[] = [
      {
        pageId: "layouts",
        id: "grid-2x2",
        label: "2x2 Grid",
        content: { node: new Grid2x2Layout() as any },
      },
      {
        pageId: "layouts",
        id: "two-column",
        label: "Two Columns",
        content: { node: new TwoColumnLayout() as any },
      },
      {
        pageId: "layouts",
        id: "three-column",
        label: "Three Columns",
        content: { node: new ThreeColumnLayout() as any },
      },
      {
        pageId: "layouts",
        id: "hero-section",
        label: "Hero Section",
        content: { node: new HeroLayout() as any },
      },
      {
        pageId: "layouts",
        id: "sidebar-layout",
        label: "Sidebar Layout",
        content: { node: new SidebarLayout() as any },
      },
    ];

    const layoutPages: ILayoutPage[] = [
      {
        id: "layouts",
        name: "All Layouts",
        icon: LayoutGrid,
      },
    ];

    setComponents(components);
    setComponentsPages(componentsPages);
    setLayouts(layoutComponents);
    setLayoutsPages(layoutPages);
  }, []);

  return (
    <div className="h-full w-full bg-background border-r">
      <Tabs defaultValue="widgets" className="h-full w-full">
        <TabsList className="w-full justify-start rounded-none border-b">
          {tabs.map((v, i) => (
            <TabsTrigger key={i} value={v.value} className="flex-1">
              {v.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="widgets" className="h-[calc(100%-3rem)] m-0">
          <Widgets
            components={components}
            componentsPages={componentsPages}
            layouts={layouts}
            layoutsPages={layoutsPages}
          />
        </TabsContent>
        <TabsContent value="layers" className="h-[calc(100%-3rem)] m-0">
          <Layers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
