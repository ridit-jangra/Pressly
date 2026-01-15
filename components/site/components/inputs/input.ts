import { Component } from "../../component";
import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";

export class input extends Component {
  editOptions: IComponentOption[] = [
    { id: "dimensions", label: "Dimensions" },
    { id: "typography", label: "Typography" },
    { id: "styling", label: "Styling" },
    { id: "border", label: "Border" },
    { id: "spacing", label: "Spacing" },
    { id: "states", label: "States" },
    { id: "validation", label: "Validation" },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "typography",
      options: [
        {
          label: "Font Family",
          default: "system-ui",
          options: ["system-ui", "Inter", "Roboto", "sans-serif"],
          type: "select",
        },
        {
          label: "Font Size",
          default: 14,
          min: 10,
          max: 24,
          type: "number",
        },
        {
          label: "Placeholder Text",
          default: "Enter text...",
          type: "text",
        },
        {
          label: "Label Text",
          default: "Input Label",
          type: "text",
        },
      ] as TOption,
    },
    {
      parentId: "styling",
      options: [
        {
          label: "Text Color",
          default: "#1F2937",
          type: "color",
        },
        {
          label: "Background Color",
          default: "#FFFFFF",
          type: "color",
        },
        {
          label: "Placeholder Color",
          default: "#9CA3AF",
          type: "color",
        },
        {
          label: "Corner Radius",
          min: 0,
          max: 50,
          default: 8,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "border",
      options: [
        {
          label: "Border Width",
          min: 0,
          max: 5,
          default: 1,
          type: "number",
        },
        {
          label: "Border Color",
          default: "#D1D5DB",
          type: "color",
        },
        {
          label: "Focus Border Color",
          default: "#6366F1",
          type: "color",
        },
      ] as TOption,
    },
    {
      parentId: "dimensions",
      options: [
        {
          label: "Width",
          default: 300,
          min: 100,
          max: 800,
          type: "number",
        },
        {
          label: "Height",
          default: 42,
          min: 32,
          max: 80,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "spacing",
      options: [
        {
          label: "Padding Horizontal",
          default: 16,
          min: 0,
          max: 50,
          type: "number",
        },
        {
          label: "Padding Vertical",
          default: 10,
          min: 0,
          max: 50,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "states",
      options: [
        {
          label: "Disabled State",
          type: "select",
          default: "No",
          options: ["Yes", "No"],
        },
        {
          label: "Show Label",
          type: "select",
          default: "Yes",
          options: ["Yes", "No"],
        },
      ] as TOption,
    },
    {
      parentId: "validation",
      options: [
        {
          label: "Required Field",
          type: "select",
          default: "No",
          options: ["Yes", "No"],
        },
        {
          label: "Error State",
          type: "select",
          default: "No",
          options: ["Yes", "No"],
        },
        {
          label: "Error Message",
          default: "This field is required",
          type: "text",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
  }

  public update() {
    const styles: React.CSSProperties = {
      fontFamily: this.state["typography-Font Family"] || "system-ui",
      fontSize: `${this.state["typography-Font Size"] || 14}px`,
      color: this.state["styling-Text Color"] || "#1F2937",
      backgroundColor: this.state["styling-Background Color"] || "#FFFFFF",
      borderRadius: `${this.state["styling-Corner Radius"] || 8}px`,
      width: `${this.state["dimensions-Width"] || 300}px`,
      height: `${this.state["dimensions-Height"] || 42}px`,
      paddingLeft: `${this.state["spacing-Padding Horizontal"] || 16}px`,
      paddingRight: `${this.state["spacing-Padding Horizontal"] || 16}px`,
      paddingTop: `${this.state["spacing-Padding Vertical"] || 10}px`,
      paddingBottom: `${this.state["spacing-Padding Vertical"] || 10}px`,
      border: `${this.state["border-Border Width"] || 1}px solid ${
        this.state["border-Border Color"] || "#D1D5DB"
      }`,
      outline: "none",
      transition: "all 0.2s ease",

      ...(this.state["states-Disabled State"] === "Yes" && {
        opacity: 0.6,
        cursor: "not-allowed",
        backgroundColor: "#F3F4F6",
      }),
    };

    this.updateAll(
      "input",
      this.state["typography-Placeholder Text"] || "Enter text...",
      [],
      styles
    );
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }
}
