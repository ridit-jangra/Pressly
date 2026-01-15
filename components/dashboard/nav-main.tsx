"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../shadcn/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../shadcn/sidebar";
import { JSX } from "react";

export function NavMain({
  items,
  setCurrentContent,
  contentMap,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  setCurrentContent: (content: JSX.Element) => void;
  contentMap: Record<string, JSX.Element>;
}) {
  const handleSetContent = (subItem: { title: string; url: string }) => {
    const content = contentMap[subItem.url];

    setCurrentContent(content);
  };

  return (
    <SidebarGroup className="w-full">
      <SidebarGroupLabel>Contents</SidebarGroupLabel>
      <SidebarMenu className="w-full">
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
            className="group/collapsible w-full"
          >
            <SidebarMenuItem className="w-full">
              <CollapsibleTrigger className="w-full">
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        onClick={() => handleSetContent(subItem)}
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
