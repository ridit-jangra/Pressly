import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { LayoutComponentBase } from "../layoutComponent";

export class CardGrid extends LayoutComponentBase {
  editOptions: IComponentOption[] = [
    {
      id: "layout",
      label: "Layout",
    },
    {
      id: "style",
      label: "Style",
    },
    {
      id: "spacing",
      label: "Spacing",
    },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "layout",
      options: [
        {
          label: "Columns",
          default: 3,
          min: 1,
          max: 6,
          type: "number",
        },
        {
          label: "Responsive Breakpoint",
          default: "md",
          options: ["sm", "md", "lg", "xl"],
          type: "select",
        },
        {
          label: "Card Height",
          default: "Auto",
          options: ["Auto", "Equal"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "style",
      options: [
        {
          label: "Card Background",
          default: "#ffffff",
          type: "color",
        },
        {
          label: "Border",
          default: "Yes",
          options: ["Yes", "No"],
          type: "select",
        },
        {
          label: "Border Color",
          default: "#e2e8f0",
          type: "color",
        },
        {
          label: "Border Radius",
          default: 8,
          min: 0,
          max: 24,
          type: "number",
        },
        {
          label: "Shadow",
          default: "sm",
          options: ["none", "sm", "md", "lg", "xl"],
          type: "select",
        },
        {
          label: "Hover Effect",
          default: "lift",
          options: ["none", "lift", "shadow", "border"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "spacing",
      options: [
        {
          label: "Gap",
          default: 24,
          min: 0,
          max: 64,
          type: "number",
        },
        {
          label: "Padding",
          default: 24,
          min: 0,
          max: 64,
          type: "number",
        },
        {
          label: "Container Padding",
          default: 0,
          min: 0,
          max: 100,
          type: "number",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.id = "card-grid";
    this.update();
  }

  update() {
    const columns = this.state?.["layout-Columns"] || 3;
    const cardHeight = this.state?.["layout-Card Height"] || "Auto";

    const cardBg = this.state?.["style-Card Background"] || "#ffffff";
    const border = this.state?.["style-Border"] || "Yes";
    const borderColor = this.state?.["style-Border Color"] || "#e2e8f0";
    const borderRadius = this.state?.["style-Border Radius"] || 8;
    const shadow = this.state?.["style-Shadow"] || "sm";
    const hoverEffect = this.state?.["style-Hover Effect"] || "lift";

    this.gap = this.state?.["spacing-Gap"] || 24;
    this.padding = this.state?.["spacing-Padding"] || 24;
    const containerPadding = this.state?.["spacing-Container Padding"] || 0;

    this.columns = columns;
    this.backgroundColor = "transparent";
    this.borderRadius = 0;
    this.minHeight = 0;

    // Store card-specific properties
    (this as any).cardBg = cardBg;
    (this as any).border = border;
    (this as any).borderColor = borderColor;
    (this as any).cardBorderRadius = borderRadius;
    (this as any).shadow = shadow;
    (this as any).hoverEffect = hoverEffect;
    (this as any).cardHeight = cardHeight;
    (this as any).containerPadding = containerPadding;
  }

  getGridAreas(): string[][] {
    const columns = this.columns;
    const areas: string[] = [];

    for (let i = 0; i < columns; i++) {
      areas.push(`zone-${i}`);
    }

    return [areas];
  }
}
