import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { LayoutComponentBase } from "../layoutComponent";

export class Section extends LayoutComponentBase {
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
          label: "Max Width",
          default: "lg",
          options: ["sm", "md", "lg", "xl", "2xl", "full"],
          type: "select",
        },
        {
          label: "Content Alignment",
          default: "start",
          options: ["start", "center", "end"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "style",
      options: [
        {
          label: "Background",
          default: "transparent",
          type: "color",
        },
        {
          label: "Border Top",
          default: "No",
          options: ["Yes", "No"],
          type: "select",
        },
        {
          label: "Border Bottom",
          default: "No",
          options: ["Yes", "No"],
          type: "select",
        },
        {
          label: "Border Color",
          default: "#e2e8f0",
          type: "color",
        },
      ] as TOption,
    },
    {
      parentId: "spacing",
      options: [
        {
          label: "Padding Top",
          default: 64,
          min: 0,
          max: 200,
          type: "number",
        },
        {
          label: "Padding Bottom",
          default: 64,
          min: 0,
          max: 200,
          type: "number",
        },
        {
          label: "Padding X",
          default: 24,
          min: 0,
          max: 100,
          type: "number",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.id = "section-layout";
    this.columns = 1;
    this.rows = 1;
    this.update();
  }

  update() {
    const maxWidth = this.state?.["layout-Max Width"] || "lg";
    const contentAlign = this.state?.["layout-Content Alignment"] || "start";

    this.backgroundColor = this.state?.["style-Background"] || "transparent";
    const borderTop = this.state?.["style-Border Top"] || "No";
    const borderBottom = this.state?.["style-Border Bottom"] || "No";
    const borderColor = this.state?.["style-Border Color"] || "#e2e8f0";

    const paddingTop = this.state?.["spacing-Padding Top"] || 64;
    const paddingBottom = this.state?.["spacing-Padding Bottom"] || 64;
    const paddingX = this.state?.["spacing-Padding X"] || 24;

    this.gap = 0;
    this.borderRadius = 0;
    this.minHeight = 0;

    (this as any).maxWidth = maxWidth;
    (this as any).contentAlign = contentAlign;
    (this as any).borderTop = borderTop;
    (this as any).borderBottom = borderBottom;
    (this as any).borderColor = borderColor;
    (this as any).paddingTop = paddingTop;
    (this as any).paddingBottom = paddingBottom;
    (this as any).paddingX = paddingX;
  }

  getGridAreas(): string[][] {
    return [["zone-0"]];
  }
}
