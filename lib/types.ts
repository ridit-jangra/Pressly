import { Component } from "@/components/site/component";
import { LucideIcon } from "lucide-react";
import { JSX } from "react";

export interface IUser {
  name: string;
  email: string;
  password: string;
  isCompletedSetup: boolean;
}

export interface ISite {
  url: string;
  name: string;
}

export interface IComponent {
  pageId: string;
  id: string;
  label: string;
  content: IContent;
}

export interface IContent {
  node: Component;
}

export interface IComponentPage {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface IMetaData {
  description: string;
  keywords: string[];
}

export interface IHead {
  title: string;
  metadata: IMetaData;
}

export interface IBody {
  text: string;
  components: IComponent[];
}

export interface IFooter {
  text: string;
  components: IComponent[];
}

export interface IPostContent {
  heading: string;
  body: IComponent[];
  footer: IFooter;
}

export interface IPost {
  title: string;
  head: IHead;
  body: IBody;
  footer: IFooter;
}

export interface IActivitybarProps {
  cursorTools: IActivitybarTool[];
  currentCursorTool?: string;
  setCurrentCursorTool: (tool: string) => void;
  setCursorTools: (tools: IActivitybarTool[]) => void;
}

export interface IActivitybarTool {
  id: string;
  name: string;
  icon: LucideIcon;
  tooltip: string;
  onClick: () => void;
}

export interface IActivitybarOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tooltip: string;
}

export interface ITitlebarTool {
  id: string;
  name: string;
  icon: LucideIcon;
  tooltip: string;
  onClick: () => void;
}

export interface ITitlebarProps {
  viewTools: ITitlebarTool[];
  currentViewTool?: string;
  setCurrentViewTool: (tool: string) => void;
  setViewTools: (tools: ITitlebarTool[]) => void;
}

export interface ISidebarProps {
  components: IComponent[];
  setComponents: (components: IComponent[]) => void;
  componentsPages: IComponentPage[];
  setComponentsPages: (componentsPages: IComponentPage[]) => void;
}

export interface IWidgetsProps {
  components: IComponent[];
  componentsPages: IComponentPage[];
}

export interface IEditorProps {
  draggableComponents: IExtendedComponent[];
  setDraggableComponents: (components: IExtendedComponent[]) => void;
  currentSelectedComponent?: IExtendedComponent;
  setCurrentSelectedComponent: (component: IExtendedComponent) => void;
}

export interface IDropZoneProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export interface IDraggableItemProps {
  id: string;
  children: JSX.Element;
  className?: string;
}

export interface IComponentEditorProps {
  currentSelectedComponent?: IExtendedComponent;
  setCurrentSelectedComponent: (component: IExtendedComponent) => void;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IExtendedComponent extends Omit<IComponent, "pageId"> {
  position: IPosition | null;
  inZone: boolean;
}

export interface ISelectOption {
  label: string;
  type: string;
  options: string[];
  default: string | number | boolean;
}

export interface IComponentOption {
  label: string;
  id: string;
}

export interface IComponentChildOption {
  parentId: string;
  options: ISelectOption[];
}
