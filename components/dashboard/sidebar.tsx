"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  NavigationIcon,
  NotebookIcon,
  PaletteIcon,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "../shadcn/sidebar";
import { NavMain } from "./nav-main";
import { INavMainItems, IUser } from "@/lib/types";
import { AuthService } from "@/lib/authService";

const navMainItems: INavMainItems[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "pages",
    isActive: true,
    items: [
      {
        title: "Site",
        url: "dashboard/site",
      },
    ],
  },
  {
    title: "Pages",
    icon: NotebookIcon,
    url: "pages",
    items: [
      {
        title: "All Pages",
        url: "pages/all-pages",
      },
      {
        title: "Add Page",
        url: "pages/add-page",
      },
    ],
  },
  {
    title: "Navigation",
    icon: NavigationIcon,
    url: "pages",
    items: [
      {
        title: "Manage Navigation",
        url: "navigation/manage",
      },
      {
        title: "Add/Remove Links",
        url: "navigation/edit",
      },
    ],
  },
  {
    title: "Colors",
    icon: PaletteIcon,
    url: "pages",
    items: [
      {
        title: "Manage Colors",
        url: "colors/manage",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<IUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const getUser = async () => {
      try {
        const v = await AuthService.getCurrentUser();
        setUser(v);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="w-full">
        <NavMain
          items={navMainItems}
          contentMap={props.contentMap}
          setCurrentContent={props.setCurrentContent}
        />
      </SidebarContent>
      <SidebarFooter>
        {!isLoading && user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
