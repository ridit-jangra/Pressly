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

export interface ILayoutComponent {
  pageId: string;
  id: string;
  label: string;
  content: IContent;
}

export interface ILayoutContent {
  node: Component;
}

export interface ILayoutPage {
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
  layouts: ILayoutComponent[];
  setLayouts: (layouts: ILayoutComponent[]) => void;
  layoutsPages: ILayoutPage[];
  setLayoutsPages: (layoutPages: ILayoutPage[]) => void;
}

export interface IWidgetsProps {
  components: IComponent[];
  componentsPages: IComponentPage[];
  layouts: ILayoutComponent[];
  layoutsPages: ILayoutPage[];
}

export interface IEditorProps {
  draggableComponents: IExtendedComponent[];
  setDraggableComponents: (components: IExtendedComponent[]) => void;
  currentSelectedComponent?: IExtendedComponent;
  setCurrentSelectedComponent: (component: IExtendedComponent) => void;
  formValues: Record<string, any>;
  dragPreview?: { x: number; y: number } | null;
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
  formValues: Record<string, any>;
  setFormValues: (values: Record<string, any>) => void;
  setDraggableComponents: Function;
  draggableComponents: IExtendedComponent[];
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IComponentState {
  [key: string]: any;
}

export interface IExtendedComponent extends Omit<IComponent, "pageId"> {
  position: IPosition | null;
  inZone: boolean;
  state: IComponentState;
  instanceId: string;
}

export interface ISelectOption {
  label: string;
  type: "select";
  options: string[];
  default: string | number | boolean;
  onChange?: (value: string) => void;
}

export interface INumberOption {
  label: string;
  default: number;
  type: "number";
  max: number;
  min: number;
  onChange?: (value: number) => void;
}

export interface IColorOption {
  label: string;
  default: string;
  type: "color";
  onChange?: (value: string) => void;
}

export interface ITextOption {
  label: string;
  default: string;
  type: "text";
  onChange?: (value: string) => void;
}

export interface IComponentOption {
  label: string;
  id: string;
}

export interface IComponentChildOption {
  parentId: string;
  options: ISelectOption[] | INumberOption[] | ITextOption[] | IColorOption[];
}

export type TOption =
  | ITextOption[]
  | IColorOption[]
  | INumberOption[]
  | ISelectOption[];
