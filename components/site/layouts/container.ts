import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { LayoutComponentBase } from "../layoutComponent";

export class WordPressContainer extends LayoutComponentBase {
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
      id: "advanced",
      label: "Advanced",
    },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "layout",
      options: [
        {
          label: "Content Width",
          default: "Full Width",
          options: ["Boxed", "Full Width", "Full Width Stretched"],
          type: "select",
        },
        {
          label: "Width",
          default: 1140,
          min: 400,
          max: 2000,
          type: "number",
        },
        {
          label: "Gap Between Columns",
          default: 20,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Minimum Height",
          default: 400,
          min: 0,
          max: 1000,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "style",
      options: [
        {
          label: "Background Type",
          default: "Color",
          options: ["Color", "Gradient", "Image"],
          type: "select",
        },
        {
          label: "Background Color",
          default: "#ffffff",
          type: "color",
        },
        {
          label: "Secondary Color",
          default: "#f3f4f6",
          type: "color",
        },
        {
          label: "Border Type",
          default: "None",
          options: ["None", "Solid", "Dashed", "Dotted"],
          type: "select",
        },
        {
          label: "Border Width",
          default: 1,
          min: 0,
          max: 20,
          type: "number",
        },
        {
          label: "Border Color",
          default: "#e5e7eb",
          type: "color",
        },
        {
          label: "Border Radius",
          default: 8,
          min: 0,
          max: 50,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "advanced",
      options: [
        {
          label: "Padding Top",
          default: 40,
          min: 0,
          max: 200,
          type: "number",
        },
        {
          label: "Padding Right",
          default: 40,
          min: 0,
          max: 200,
          type: "number",
        },
        {
          label: "Padding Bottom",
          default: 40,
          min: 0,
          max: 200,
          type: "number",
        },
        {
          label: "Padding Left",
          default: 40,
          min: 0,
          max: 200,
          type: "number",
        },
        {
          label: "Box Shadow",
          default: "None",
          options: ["None", "Small", "Medium", "Large"],
          type: "select",
        },
        {
          label: "Z-Index",
          default: 0,
          min: -10,
          max: 100,
          type: "number",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.id = "wordpress-container";
    this.rows = 1;
    this.columns = 1;
    this.update();
  }

  update() {
    const contentWidth = this.state?.["layout-Content Width"] || "Full Width";
    const width = this.state?.["layout-Width"] || 1140;
    this.gap = this.state?.["layout-Gap Between Columns"] || 20;
    const minHeight = this.state?.["layout-Minimum Height"] || 400;

    const bgType = this.state?.["style-Background Type"] || "Color";
    const bgColor = this.state?.["style-Background Color"] || "#ffffff";
    const secondaryColor = this.state?.["style-Secondary Color"] || "#f3f4f6";
    const borderType = this.state?.["style-Border Type"] || "None";
    const borderWidth = this.state?.["style-Border Width"] || 1;
    const borderColor = this.state?.["style-Border Color"] || "#e5e7eb";
    this.borderRadius = this.state?.["style-Border Radius"] || 8;

    const paddingTop = this.state?.["advanced-Padding Top"] || 40;
    const paddingRight = this.state?.["advanced-Padding Right"] || 40;
    const paddingBottom = this.state?.["advanced-Padding Bottom"] || 40;
    const paddingLeft = this.state?.["advanced-Padding Left"] || 40;
    const boxShadow = this.state?.["advanced-Box Shadow"] || "None";
    const zIndex = this.state?.["advanced-Z-Index"] || 0;

    // Set background based on type
    if (bgType === "Gradient") {
      this.backgroundColor = `linear-gradient(135deg, ${bgColor}, ${secondaryColor})`;
    } else {
      this.backgroundColor = bgColor;
    }

    // Store additional layout properties
    this.minHeight = minHeight;
    (this as any).contentWidth = contentWidth;
    (this as any).customWidth = width;
    (this as any).borderType = borderType;
    (this as any).borderWidth = borderWidth;
    (this as any).borderColor = borderColor;
    (this as any).paddingTop = paddingTop;
    (this as any).paddingRight = paddingRight;
    (this as any).paddingBottom = paddingBottom;
    (this as any).paddingLeft = paddingLeft;
    (this as any).boxShadow = boxShadow;
    (this as any).zIndex = zIndex;
  }

  getGridAreas(): string[][] {
    return [["zone-0"]];
  }
}
