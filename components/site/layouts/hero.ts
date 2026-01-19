import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { LayoutComponentBase } from "../layoutComponent";

export class HeroSection extends LayoutComponentBase {
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
          label: "Layout Type",
          default: "centered",
          options: ["centered", "split", "image-left", "image-right"],
          type: "select",
        },
        {
          label: "Vertical Alignment",
          default: "center",
          options: ["start", "center", "end"],
          type: "select",
        },
        {
          label: "Content Width",
          default: "lg",
          options: ["sm", "md", "lg", "xl", "full"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "style",
      options: [
        {
          label: "Background Type",
          default: "color",
          options: ["color", "gradient"],
          type: "select",
        },
        {
          label: "Background Color",
          default: "#ffffff",
          type: "color",
        },
        {
          label: "Gradient Start",
          default: "#f8fafc",
          type: "color",
        },
        {
          label: "Gradient End",
          default: "#e2e8f0",
          type: "color",
        },
        {
          label: "Border Bottom",
          default: "Yes",
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
          label: "Min Height",
          default: 500,
          min: 300,
          max: 1000,
          type: "number",
        },
        {
          label: "Padding Top",
          default: 80,
          min: 0,
          max: 200,
          type: "number",
        },
        {
          label: "Padding Bottom",
          default: 80,
          min: 0,
          max: 200,
          type: "number",
        },
        {
          label: "Gap",
          default: 48,
          min: 0,
          max: 100,
          type: "number",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.id = "hero-section";
    this.update();
  }

  update() {
    const layoutType = this.state?.["layout-Layout Type"] || "centered";
    const verticalAlign = this.state?.["layout-Vertical Alignment"] || "center";
    const contentWidth = this.state?.["layout-Content Width"] || "lg";

    const bgType = this.state?.["style-Background Type"] || "color";
    const bgColor = this.state?.["style-Background Color"] || "#ffffff";
    const gradientStart = this.state?.["style-Gradient Start"] || "#f8fafc";
    const gradientEnd = this.state?.["style-Gradient End"] || "#e2e8f0";
    const borderBottom = this.state?.["style-Border Bottom"] || "Yes";
    const borderColor = this.state?.["style-Border Color"] || "#e2e8f0";

    const minHeight = this.state?.["spacing-Min Height"] || 500;
    const paddingTop = this.state?.["spacing-Padding Top"] || 80;
    const paddingBottom = this.state?.["spacing-Padding Bottom"] || 80;
    this.gap = this.state?.["spacing-Gap"] || 48;

    if (bgType === "gradient") {
      this.backgroundColor = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;
    } else {
      this.backgroundColor = bgColor;
    }

    this.minHeight = minHeight;
    this.borderRadius = 0;

    // Determine columns based on layout
    if (layoutType === "centered") {
      this.columns = 1;
      this.rows = 1;
    } else {
      this.columns = 2;
      this.rows = 1;
    }

    // Store additional properties
    (this as any).layoutType = layoutType;
    (this as any).verticalAlign = verticalAlign;
    (this as any).contentWidth = contentWidth;
    (this as any).borderBottom = borderBottom;
    (this as any).borderColor = borderColor;
    (this as any).paddingTop = paddingTop;
    (this as any).paddingBottom = paddingBottom;
  }

  getGridAreas(): string[][] {
    const layoutType = (this as any).layoutType || "centered";

    if (layoutType === "centered") {
      return [["zone-0"]];
    } else {
      return [["zone-0", "zone-1"]];
    }
  }
}
