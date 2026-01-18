import { Component } from "../component";
import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";

export class Spacer extends Component {
  editOptions: IComponentOption[] = [
    {
      id: "layout",
      label: "Layout",
    },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "layout",
      options: [
        {
          label: "Height",
          default: 50,
          min: 0,
          max: 500,
          type: "number",
        },
        {
          label: "Show Divider",
          default: "No",
          options: ["Yes", "No"],
          type: "select",
        },
        {
          label: "Divider Style",
          default: "Solid",
          options: ["Solid", "Dashed", "Dotted"],
          type: "select",
        },
        {
          label: "Divider Color",
          default: "#e5e7eb",
          type: "color",
        },
        {
          label: "Divider Width",
          default: 1,
          min: 1,
          max: 10,
          type: "number",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.update();
  }

  public update() {
    const height = this.state["layout-Height"] || 50;
    const showDivider = this.state["layout-Show Divider"] || "No";
    const dividerStyle = this.state["layout-Divider Style"] || "Solid";
    const dividerColor = this.state["layout-Divider Color"] || "#e5e7eb";
    const dividerWidth = this.state["layout-Divider Width"] || 1;

    const styles: React.CSSProperties = {
      height: `${height}px`,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    if (showDivider === "Yes") {
      this.code = `<div style="${this.formatStyles(styles)}"><hr style="width: 100%; border: none; border-top: ${dividerWidth}px ${dividerStyle.toLowerCase()} ${dividerColor}; margin: 0;" /></div>`;
    } else {
      this.code = `<div style="${this.formatStyles(styles)}"></div>`;
    }
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }
}
