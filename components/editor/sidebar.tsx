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
  TextCursorIcon,
  ToggleLeftIcon,
  LayoutGrid,
  ToggleRight,
  FormInputIcon,
  ImageIcon,
  MicIcon,
  SparklesIcon,
  Video,
} from "lucide-react";
import {
  Grid2x2Layout,
  ThreeColumnLayout,
  HeroLayout,
  SidebarLayout,
  TwoColumnLayout,
} from "../site/layouts/";
import {
  primaryButton,
  badge,
  input,
  toggleSwitch,
  Video as VideoComponent,
  Image as ImageComponent,
  Text as TextComponent,
  Audio as AudioComponent,
  Icon as IconComponent,
} from "../site/components/";

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
      {
        pageId: "input",
        id: "input-field",
        label: "Input Field",
        content: { node: new input() },
      },
      {
        pageId: "badge",
        id: "badge",
        label: "Badge",
        content: { node: new badge() },
      },
      {
        pageId: "toggle-switch",
        id: "switch",
        label: "Toggle Switch",
        content: { node: new toggleSwitch() },
      },
      {
        pageId: "video",
        id: "video-player",
        label: "Video Player",
        content: { node: new VideoComponent() },
      },
      {
        pageId: "image",
        id: "image",
        label: "Image",
        content: { node: new ImageComponent() },
      },
      {
        pageId: "text",
        id: "text",
        label: "Text",
        content: { node: new TextComponent() },
      },
      {
        pageId: "audio",
        id: "audio-player",
        label: "Audio Player",
        content: { node: new AudioComponent() },
      },
      {
        pageId: "icon",
        id: "icon",
        label: "Icon",
        content: { node: new IconComponent() },
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
        id: "toggle-switch",
        name: "Toggle Switch",
        icon: ToggleRight,
      },
      {
        id: "input",
        name: "Input",
        icon: FormInputIcon,
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
        id: "audio",
        name: "Audio",
        icon: MicIcon,
      },
      {
        id: "icon",
        name: "Icon",
        icon: SparklesIcon,
      },
    ];

    const layoutComponents: ILayoutComponent[] = [
      {
        pageId: "layouts",
        id: "grid-2x2",
        label: "2x2 Grid",
        content: { node: new Grid2x2Layout() },
      },
      {
        pageId: "layouts",
        id: "two-column",
        label: "Two Columns",
        content: { node: new TwoColumnLayout() },
      },
      {
        pageId: "layouts",
        id: "three-column",
        label: "Three Columns",
        content: { node: new ThreeColumnLayout() },
      },
      {
        pageId: "layouts",
        id: "hero-section",
        label: "Hero Section",
        content: { node: new HeroLayout() },
      },
      {
        pageId: "layouts",
        id: "sidebar-layout",
        label: "Sidebar Layout",
        content: { node: new SidebarLayout() },
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
