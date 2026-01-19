import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { LayoutComponentBase } from "../layoutComponent";

export class FeatureGrid extends LayoutComponentBase {
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
          label: "Columns",
          default: 3,
          min: 2,
          max: 4,
          type: "number",
        },
        {
          label: "Gap",
          default: 32,
          min: 8,
          max: 64,
          type: "number",
        },
        {
          label: "Feature Style",
          default: "icon-top",
          options: ["icon-top", "icon-left", "minimal"],
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
          label: "Item Background",
          default: "#f8fafc",
          type: "color",
        },
        {
          label: "Item Padding",
          default: 24,
          min: 0,
          max: 64,
          type: "number",
        },
        {
          label: "Border Radius",
          default: 8,
          min: 0,
          max: 24,
          type: "number",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.id = "feature-grid";
    this.update();
  }

  update() {
    const columns = this.state?.["layout-Columns"] || 3;
    this.gap = this.state?.["layout-Gap"] || 32;
    const featureStyle = this.state?.["layout-Feature Style"] || "icon-top";

    this.backgroundColor = this.state?.["style-Background"] || "transparent";
    const itemBg = this.state?.["style-Item Background"] || "#f8fafc";
    const itemPadding = this.state?.["style-Item Padding"] || 24;
    this.borderRadius = this.state?.["style-Border Radius"] || 8;

    this.columns = columns;
    this.rows = 1;
    this.minHeight = 0;

    (this as any).featureStyle = featureStyle;
    (this as any).itemBg = itemBg;
    (this as any).itemPadding = itemPadding;
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
