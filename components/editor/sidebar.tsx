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
import {
  LayoutGrid,
  MousePointerClick,
  Heading1,
  ImageIcon,
  Video,
  SeparatorHorizontal,
  Container,
  SparklesIcon,
} from "lucide-react";
import {
  WordPressButton,
  WordPressHeading,
  WordPressImage,
  WordPressVideo,
  WordPressSpacer,
  WordPressIcon,
} from "../site/components/";
import { WordPressContainer, WordPressColumns } from "../site/layouts/";

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
        id: "wp-button",
        label: "Button",
        content: { node: new WordPressButton() },
      },
      {
        pageId: "heading",
        id: "wp-heading",
        label: "Heading",
        content: { node: new WordPressHeading() },
      },
      {
        pageId: "image",
        id: "wp-image",
        label: "Image",
        content: { node: new WordPressImage() },
      },
      {
        pageId: "video",
        id: "wp-video",
        label: "Video",
        content: { node: new WordPressVideo() },
      },
      {
        pageId: "spacer",
        id: "wp-spacer",
        label: "Spacer",
        content: { node: new WordPressSpacer() },
      },
      {
        pageId: "icon",
        id: "wp-icon",
        label: "Icon",
        content: { node: new WordPressIcon() },
      },
    ];

    const componentsPages: IComponentPage[] = [
      {
        id: "button",
        name: "Button",
        icon: MousePointerClick,
      },
      {
        id: "heading",
        name: "Heading",
        icon: Heading1,
      },
      {
        id: "image",
        name: "Image",
        icon: ImageIcon,
      },
      {
        id: "video",
        name: "Video",
        icon: Video,
      },
      {
        id: "spacer",
        name: "Spacer",
        icon: SeparatorHorizontal,
      },
      {
        id: "icon",
        name: "Icon",
        icon: SparklesIcon,
      },
    ];

    const layoutComponents: ILayoutComponent[] = [
      {
        pageId: "wordpress-layouts",
        id: "wordpress-container",
        label: "Container",
        content: { node: new WordPressContainer() },
      },
      {
        pageId: "wordpress-layouts",
        id: "wordpress-columns",
        label: "Columns",
        content: { node: new WordPressColumns() },
      },
    ];

    const layoutPages: ILayoutPage[] = [
      {
        id: "wordpress-layouts",
        name: "WordPress Layouts",
        icon: Container,
      },
      {
        id: "classic-layouts",
        name: "Classic Layouts",
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
        <TabsList
          className="w-full justify-start rounded-none border-b"
          variant={"line"}
        >
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
