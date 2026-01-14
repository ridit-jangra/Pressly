"use client";

import { IComponent, IComponentPage, ISidebarProps } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import { Layers } from "./layers";
import { Widgets } from "./widgets";
import { useEffect } from "react";
import { primaryButton, secondaryButton } from "../site/components/buttons";
import { RadioIcon, RectangleHorizontalIcon } from "lucide-react";

export function Sidebar({
  components,
  setComponents,
  componentsPages,
  setComponentsPages,
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
        pageId: "buttons",
        id: "primary-button",
        label: "Primary Button",
        content: { node: new primaryButton() },
      },
      {
        pageId: "buttons",
        id: "secondary-button",
        label: "Secondary Button",
        content: { node: new secondaryButton() },
      },
    ];
    const componentsPages: IComponentPage[] = [
      {
        id: "buttons",
        name: "Buttons",
        icon: RadioIcon,
      },
      {
        id: "cards",
        name: "Cards",
        icon: RectangleHorizontalIcon,
      },
    ];

    setComponents(components);
    setComponentsPages(componentsPages);
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
          <Widgets components={components} componentsPages={componentsPages} />
        </TabsContent>
        <TabsContent value={"layers"} className={"h-full"}>
          <Layers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
