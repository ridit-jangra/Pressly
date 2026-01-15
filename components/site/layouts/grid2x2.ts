import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { LayoutComponentBase } from "../layoutComponent";

export class Grid2x2Layout extends LayoutComponentBase {
  editOptions: IComponentOption[] = [
    {
      id: "layout-settings",
      label: "Layout Settings",
    },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "layout-settings",
      options: [
        {
          label: "Gap",
          default: 16,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Padding",
          default: 16,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Background Color",
          default: "#ffffff",
          type: "color",
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
          default: 150,
          min: 100,
          max: 500,
          type: "number",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.id = "grid-2x2";
    this.rows = 2;
    this.columns = 2;
  }

  update() {
    this.gap = this.state?.["layout-settings-Gap"] || 16;
    this.padding = this.state?.["layout-settings-Padding"] || 16;
    this.backgroundColor =
      this.state?.["layout-settings-Background Color"] || "#ffffff";
    this.borderRadius = this.state?.["layout-settings-Border Radius"] || 8;
    this.minHeight = this.state?.["layout-settings-Min Height"] || 150;
  }

  getGridAreas(): string[][] {
    return [
      ["zone-0", "zone-1"],
      ["zone-2", "zone-3"],
    ];
  }

  public state: any = {};

  public applyState(state: any) {
    this.state = { ...state };
    this.update();
  }
}
