import { Component } from "../component";
import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";

export class WordPressText extends Component {
  editOptions: IComponentOption[] = [
    {
      id: "content",
      label: "Content",
    },
    {
      id: "style",
      label: "Style",
    },
    {
      id: "typography",
      label: "Typography",
    },
    {
      id: "advanced",
      label: "Advanced",
    },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "content",
      options: [
        {
          label: "Text Content",
          default:
            "Add your text content here. You can write paragraphs, descriptions, or any other text content.",
          type: "text",
        },
        {
          label: "HTML Tag",
          default: "p",
          options: ["p", "div", "span", "article", "section"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "style",
      options: [
        {
          label: "Text Color",
          default: "#374151",
          type: "color",
        },
        {
          label: "Text Align",
          default: "Left",
          options: ["Left", "Center", "Right", "Justify"],
          type: "select",
        },
        {
          label: "Background Color",
          default: "transparent",
          type: "color",
        },
        {
          label: "Width Type",
          default: "Auto",
          options: ["Auto", "Full Width", "Custom"],
          type: "select",
        },
        {
          label: "Custom Width",
          default: 600,
          min: 100,
          max: 1200,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "typography",
      options: [
        {
          label: "Font Family",
          default: "system-ui",
          options: [
            "system-ui",
            "Georgia",
            "Times New Roman",
            "Arial",
            "Helvetica",
            "Courier New",
            "Verdana",
          ],
          type: "select",
        },
        {
          label: "Font Size",
          default: 16,
          min: 12,
          max: 48,
          type: "number",
        },
        {
          label: "Font Weight",
          default: "400",
          options: ["300", "400", "500", "600", "700"],
          type: "select",
        },
        {
          label: "Line Height",
          default: 1.6,
          min: 1,
          max: 3,
          type: "number",
        },
        {
          label: "Letter Spacing",
          default: 0,
          min: -2,
          max: 5,
          type: "number",
        },
        {
          label: "Text Transform",
          default: "None",
          options: ["None", "Uppercase", "Lowercase", "Capitalize"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "advanced",
      options: [
        {
          label: "Padding Top",
          default: 0,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Padding Right",
          default: 0,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Padding Bottom",
          default: 0,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Padding Left",
          default: 0,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Margin Bottom",
          default: 16,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Border Radius",
          default: 0,
          min: 0,
          max: 50,
          type: "number",
        },
        {
          label: "Text Shadow",
          default: "No",
          options: ["No", "Subtle", "Medium"],
          type: "select",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.update();
  }

  public update() {
    const textContent =
      this.state["content-Text Content"] ||
      "Add your text content here. You can write paragraphs, descriptions, or any other text content.";
    const htmlTag = this.state["content-HTML Tag"] || "p";

    const textColor = this.state["style-Text Color"] || "#374151";
    const textAlign = this.state["style-Text Align"] || "Left";
    const backgroundColor =
      this.state["style-Background Color"] || "transparent";
    const widthType = this.state["style-Width Type"] || "Auto";
    const customWidth = this.state["style-Custom Width"] || 600;

    const fontFamily = this.state["typography-Font Family"] || "system-ui";
    const fontSize = this.state["typography-Font Size"] || 16;
    const fontWeight = this.state["typography-Font Weight"] || "400";
    const lineHeight = this.state["typography-Line Height"] || 1.6;
    const letterSpacing = this.state["typography-Letter Spacing"] || 0;
    const textTransform = this.state["typography-Text Transform"] || "None";

    const paddingTop = this.state["advanced-Padding Top"] || 0;
    const paddingRight = this.state["advanced-Padding Right"] || 0;
    const paddingBottom = this.state["advanced-Padding Bottom"] || 0;
    const paddingLeft = this.state["advanced-Padding Left"] || 0;
    const marginBottom = this.state["advanced-Margin Bottom"] || 16;
    const borderRadius = this.state["advanced-Border Radius"] || 0;
    const textShadow = this.state["advanced-Text Shadow"] || "No";

    const transformMap: Record<string, string> = {
      None: "none",
      Uppercase: "uppercase",
      Lowercase: "lowercase",
      Capitalize: "capitalize",
    };

    const shadowMap: Record<string, string> = {
      No: "none",
      Subtle: "1px 1px 2px rgba(0,0,0,0.1)",
      Medium: "2px 2px 4px rgba(0,0,0,0.15)",
    };

    let width = "auto";
    if (widthType === "Full Width") {
      width = "100%";
    } else if (widthType === "Custom") {
      width = `${customWidth}px`;
    }

    const styles: React.CSSProperties = {
      color: textColor,
      textAlign: textAlign.toLowerCase() as any,
      backgroundColor:
        backgroundColor === "transparent" ? "transparent" : backgroundColor,
      width,
      fontFamily,
      fontSize: `${fontSize}px`,
      fontWeight,
      lineHeight,
      letterSpacing: `${letterSpacing}px`,
      textTransform: transformMap[textTransform] as any,
      padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
      marginBottom: `${marginBottom}px`,
      borderRadius: `${borderRadius}px`,
      textShadow: shadowMap[textShadow],
      margin: `0 0 ${marginBottom}px 0`,
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
    };

    this.code = `<${htmlTag} style="${this.formatStyles(styles)}">${this.escapeHtml(textContent)}</${htmlTag}>`;
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }
}
