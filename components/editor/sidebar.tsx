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
  VideoIcon,
  SeparatorHorizontal,
  ContainerIcon,
  SparklesIcon,
  LayoutTemplate,
  Blocks,
  Grid3x3,
  Star,
} from "lucide-react";

import {
  Button,
  Heading,
  Image,
  Video,
  Spacer,
  Icon,
} from "../site/components/";

import {
  Container,
  Columns,
  CardGrid,
  HeroSection,
  Section,
  FeatureGrid,
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
        id: "wp-button",
        label: "Button",
        content: { node: new Button() },
      },
      {
        pageId: "heading",
        id: "wp-heading",
        label: "Heading",
        content: { node: new Heading() },
      },
      {
        pageId: "image",
        id: "wp-image",
        label: "Image",
        content: { node: new Image() },
      },
      {
        pageId: "video",
        id: "wp-video",
        label: "Video",
        content: { node: new Video() },
      },
      {
        pageId: "spacer",
        id: "wp-spacer",
        label: "Spacer",
        content: { node: new Spacer() },
      },
      {
        pageId: "icon",
        id: "wp-icon",
        label: "Icon",
        content: { node: new Icon() },
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
        icon: VideoIcon,
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
        pageId: "basic",
        id: "container",
        label: "Container",
        content: { node: new Container() },
      },
      {
        pageId: "basic",
        id: "columns",
        label: "Columns",
        content: { node: new Columns() },
      },
      {
        pageId: "basic",
        id: "section",
        label: "Section",
        content: { node: new Section() },
      },
      {
        pageId: "advanced",
        id: "hero-section",
        label: "Hero Section",
        content: { node: new HeroSection() },
      },
      {
        pageId: "advanced",
        id: "card-grid",
        label: "Card Grid",
        content: { node: new CardGrid() },
      },
      {
        pageId: "advanced",
        id: "feature-grid",
        label: "Feature Grid",
        content: { node: new FeatureGrid() },
      },
    ];

    const layoutPages: ILayoutPage[] = [
      {
        id: "basic",
        name: "Basic",
        icon: ContainerIcon,
      },
      {
        id: "advanced",
        name: "Advanced",
        icon: LayoutTemplate,
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
