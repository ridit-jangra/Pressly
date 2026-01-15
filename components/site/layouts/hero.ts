import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { LayoutComponentBase } from "../layoutComponent";

export class HeroLayout extends LayoutComponentBase {
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
          label: "Padding",
          default: 32,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Background Color",
          default: "#f3f4f6",
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
          default: 300,
          min: 100,
          max: 800,
          type: "number",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.id = "hero-section";
    this.rows = 1;
    this.columns = 1;
  }

  update() {
    this.padding = this.state?.["layout-settings-Padding"] || 32;
    this.backgroundColor =
      this.state?.["layout-settings-Background Color"] || "#f3f4f6";
    this.borderRadius = this.state?.["layout-settings-Border Radius"] || 8;
    this.minHeight = this.state?.["layout-settings-Min Height"] || 300;
  }

  getGridAreas(): string[][] {
    return [["zone-0"]];
  }

  public state: any = {};

  public applyState(state: any) {
    this.state = { ...state };
    this.update();
  }
}
