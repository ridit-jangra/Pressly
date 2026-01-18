import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { LayoutComponentBase } from "../layoutComponent";

export class Columns extends LayoutComponentBase {
  editOptions: IComponentOption[] = [
    {
      id: "layout",
      label: "Layout",
    },
    {
      id: "style",
      label: "Style",
    },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "layout",
      options: [
        {
          label: "Number of Columns",
          default: 2,
          min: 1,
          max: 6,
          type: "number",
        },
        {
          label: "Column Layout",
          default: "Equal",
          options: ["Equal", "25-75", "33-66", "50-50", "66-33", "75-25"],
          type: "select",
        },
        {
          label: "Gap",
          default: 20,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Vertical Alignment",
          default: "Top",
          options: ["Top", "Center", "Bottom", "Stretch"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "style",
      options: [
        {
          label: "Background Color",
          default: "#ffffff",
          type: "color",
        },
        {
          label: "Padding",
          default: 20,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Border Radius",
          default: 8,
          min: 0,
          max: 50,
          type: "number",
        },
        {
          label: "Min Height",
          default: 200,
          min: 0,
          max: 1000,
          type: "number",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.id = "wordpress-columns";
    this.rows = 1;
    this.update();
  }

  update() {
    const numColumns = this.state?.["layout-Number of Columns"] || 2;
    const columnLayout = this.state?.["layout-Column Layout"] || "Equal";
    this.gap = this.state?.["layout-Gap"] || 20;
    const verticalAlign = this.state?.["layout-Vertical Alignment"] || "Top";

    this.backgroundColor = this.state?.["style-Background Color"] || "#ffffff";
    this.padding = this.state?.["style-Padding"] || 20;
    this.borderRadius = this.state?.["style-Border Radius"] || 8;
    this.minHeight = this.state?.["style-Min Height"] || 200;

    this.columns = numColumns;

    // Store layout pattern for grid template columns
    (this as any).columnLayout = columnLayout;
    (this as any).verticalAlign = verticalAlign;
  }

  getGridAreas(): string[][] {
    const numColumns = this.columns;
    const areas: string[] = [];

    for (let i = 0; i < numColumns; i++) {
      areas.push(`zone-${i}`);
    }

    return [areas];
  }

  getColumnTemplate(): string {
    const layout = (this as any).columnLayout || "Equal";
    const numColumns = this.columns;

    if (layout === "Equal") {
      return `repeat(${numColumns}, 1fr)`;
    }

    const layoutMap: Record<string, string> = {
      "25-75": "1fr 3fr",
      "33-66": "1fr 2fr",
      "50-50": "1fr 1fr",
      "66-33": "2fr 1fr",
      "75-25": "3fr 1fr",
    };

    return layoutMap[layout] || `repeat(${numColumns}, 1fr)`;
  }

  getAlignItems(): string {
    const align = (this as any).verticalAlign || "Top";
    const alignMap: Record<string, string> = {
      Top: "flex-start",
      Center: "center",
      Bottom: "flex-end",
      Stretch: "stretch",
    };
    return alignMap[align] || "flex-start";
  }
}
