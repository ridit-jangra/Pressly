import { Component } from "../component";
import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";

export class primaryButton extends Component {
  editOptions: IComponentOption[] = [
    {
      id: "dimensions",
      label: "Dimensions",
    },
    {
      id: "typography",
      label: "Typography",
    },
    {
      id: "styling",
      label: "Styling",
    },
    {
      id: "padding",
      label: "Padding",
    },
    {
      id: "align",
      label: "Align",
    },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "typography",
      options: [
        {
          label: "Font Family",
          default: "sans-serif",
          options: ["sans-serif", "sans", "monospace", "serif"],
          type: "select",
        },
        {
          label: "Font Style",
          default: "Regular",
          options: ["Regular", "Medium", "SemiBold", "Bold", "Black"],
          type: "select",
        },
        {
          label: "Font Size",
          default: 16,
          min: 5,
          max: 1000,
          type: "number",
        },

        {
          label: "Text Content",
          default: "Primary Button",
          type: "text",
        },
      ] as TOption,
    },
    {
      parentId: "styling",
      options: [
        {
          label: "Text Color",
          default: "#FFFFFF",
          type: "color",
        },
        {
          label: "Background Color",
          default: "#000000",
          type: "color",
        },
        {
          label: "Corner Radius",
          min: 0,
          max: 500,
          default: 8,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "dimensions",
      options: [
        {
          label: "Width",
          default: 124,
          min: 1,
          max: 1000,
          type: "number",
        },
        {
          label: "Height",
          default: 62,
          min: 1,
          max: 1000,
          type: "number",
        },
      ] as any,
    },
    {
      parentId: "padding",
      options: [
        {
          label: "Padding Left",
          default: 4,
          min: 1,
          max: 1000,
          type: "number",
        },
        {
          label: "Padding Right",
          default: 4,
          min: 1,
          max: 1000,
          type: "number",
        },
        {
          label: "Padding Top",
          default: 4,
          min: 1,
          max: 1000,
          type: "number",
        },
        {
          label: "Padding Bottom",
          default: 4,
          min: 1,
          max: 1000,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "align",
      options: [
        {
          label: "Text Align",
          type: "select",
          default: "Center",
          options: ["Left", "Center", "Right"],
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
  }

  public update() {
    const styles: React.CSSProperties = {
      fontFamily: this.state["typography-Font Family"] || "sans-serif",
      fontWeight: this.getFontWeight(
        this.state["typography-Font Style"] || "Regular"
      ),
      fontSize: `${this.state["typography-Font Size"] || 16}px`,
      color: this.state["styling-Text Color"] || "#FFFFFF",
      backgroundColor: this.state["styling-Background Color"] || "#000000",
      borderRadius: `${this.state["styling-Corner Radius"] || 8}px`,
      width: `${this.state["dimensions-Width"] || 124}px`,
      height: `${this.state["dimensions-Height"] || 62}px`,
      paddingLeft: `${this.state["padding-Padding Left"] || 4}px`,
      paddingRight: `${this.state["padding-Padding Right"] || 4}px`,
      paddingTop: `${this.state["padding-Padding Top"] || 4}px`,
      paddingBottom: `${this.state["padding-Padding Bottom"] || 4}px`,
    };

    this.updateAll(
      "button",
      this.state["typography-Text Content"] || "Primary Button",
      [],
      styles
    );
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    switch (label) {
      case "Font Family":
        this.setStyle("fontFamily", value);
        break;
      case "Font Style":
        this.setStyle("fontWeight", this.getFontWeight(value));
        break;
      case "Font Size":
        this.setStyle("fontSize", `${value}px`);
        break;
      case "Text Content":
        this.text = value;
        break;
      case "Text Color":
        this.setStyle("color", value);
        break;
      case "Background Color":
        this.setStyle("backgroundColor", value);
        break;
      case "Corner Radius":
        this.setStyle("borderRadius", `${value}px`);
        break;
      case "Width":
        this.setStyle("width", `${value}px`);
        break;
      case "Height":
        this.setStyle("height", `${value}px`);
        break;
      case "Padding Left":
        this.setStyle("paddingLeft", `${value}px`);
        break;
      case "Padding Right":
        this.setStyle("paddingRight", `${value}px`);
        break;
      case "Padding Top":
        this.setStyle("paddingTop", `${value}px`);
        break;
      case "Padding Bottom":
        this.setStyle("paddingBottom", `${value}px`);
        break;
      case "Text Align":
        this.setStyle("textAlign", value.toLowerCase());
        break;
    }
  }

  private getFontWeight(style: string): number {
    const map: Record<string, number> = {
      Regular: 400,
      Medium: 500,
      SemiBold: 600,
      Bold: 700,
      Black: 900,
    };
    return map[style] || 400;
  }
}
