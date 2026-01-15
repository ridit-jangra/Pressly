import { Component } from "@/components/site/component";
import { LayoutComponentBase } from "@/components/site/layoutComponent";
import { LucideIcon } from "lucide-react";
import { JSX } from "react";

export interface IUser {
  name: string;
  email: string;
  password: string;
  isCompletedSetup: boolean;
  id: string;
  isVerified?: boolean;
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

export interface ILayoutContent {
  node: LayoutComponentBase;
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
  content: ILayoutContent;
}

export interface IExtendedLayout {
  id: string;
  instanceId: string;
  type: string;
  name: string;
  layout: LayoutComponentBase;
  position: number;
  components: { [zoneKey: string]: IExtendedComponent[] };
  state: any;
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
  components: IExtendedComponent[];
}

export interface IFooter {
  components: IExtendedComponent[];
}

export interface IPage {
  id: string;
  title: string;
  head: IHead;
  body: IBody;
  footer: IFooter;
  createdAt: string;
  updatedAt: string;
}

export interface IActivitybarProps {
  cursorTools: IActivitybarTool[];
  currentCursorTool?: string;
  setCurrentCursorTool: (tool: string) => void;
  setCursorTools: (tools: IActivitybarTool[]) => void;
  user: IUser;
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
  site: ISite;
  page: IPage;
  setPage: (page: IPage) => void;
  handleSavePage: () => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
  isSaveDisable: boolean;
  setIsSaveDisable: (isDisabled: boolean) => void;
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
  currentSelectedComponent: IExtendedComponent | null;
  setCurrentSelectedComponent: (component: IExtendedComponent) => void;
  formValues: Record<string, any>;
  dragPreview?: { x: number; y: number } | null;
  page: IPage;
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
  currentSelectedComponent?: IExtendedComponent | null;
  setCurrentSelectedComponent: (component: IExtendedComponent | null) => void;
  currentSelectedLayout?: IExtendedLayout | null;
  setCurrentSelectedLayout: (layout: IExtendedLayout | null) => void;
  formValues: Record<string, any>;
  setFormValues: (values: Record<string, any>) => void;
  setDraggableComponents: Function;
  draggableComponents: IExtendedComponent[];
  layouts: IExtendedLayout[];
  setLayouts: (
    layouts:
      | IExtendedLayout[]
      | ((prev: IExtendedLayout[]) => IExtendedLayout[])
  ) => void;
  setPage: (page: IPage) => void;
  page: IPage;
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

export interface IDashboardContentProps {
  currentContent: string;
  contentMap: Record<string, JSX.Element>;
}

export interface INavMainItems {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface IPendingRegistration {
  name: string;
  email: string;
  password: string;
  otp: string;
  otpExpiry: Date;
}

export interface IAllPagesProps {}

export type TOption =
  | ITextOption[]
  | IColorOption[]
  | INumberOption[]
  | ISelectOption[];
