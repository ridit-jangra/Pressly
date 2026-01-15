import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { Component } from "../../component";

export class Text extends Component {
  editOptions: IComponentOption[] = [
    { id: "content", label: "Content" },
    { id: "typography", label: "Typography" },
    { id: "styling", label: "Styling" },
    { id: "spacing", label: "Spacing" },
    { id: "effects", label: "Effects" },
    { id: "decoration", label: "Decoration" },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "content",
      options: [
        {
          label: "Text Content",
          default: "Your text here",
          type: "text",
        },
        {
          label: "Element Type",
          default: "Paragraph",
          options: ["Heading 1", "Heading 2", "Heading 3", "Paragraph", "Span"],
          type: "select",
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
            "Inter",
            "Roboto",
            "Georgia",
            "sans-serif",
            "serif",
            "monospace",
          ],
          type: "select",
        },
        {
          label: "Font Weight",
          default: "Regular",
          options: ["Light", "Regular", "Medium", "SemiBold", "Bold", "Black"],
          type: "select",
        },
        {
          label: "Font Size",
          default: 16,
          min: 8,
          max: 120,
          type: "number",
        },
        {
          label: "Line Height",
          default: 1.5,
          min: 1,
          max: 3,
          type: "number",
        },
        {
          label: "Letter Spacing",
          default: 0,
          min: -2,
          max: 10,
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
      parentId: "styling",
      options: [
        {
          label: "Text Color",
          default: "#1F2937",
          type: "color",
        },
        {
          label: "Text Align",
          type: "select",
          default: "Left",
          options: ["Left", "Center", "Right", "Justify"],
        },
        {
          label: "Background Color",
          default: "transparent",
          type: "color",
        },
        {
          label: "Max Width",
          default: 100,
          min: 10,
          max: 100,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "spacing",
      options: [
        {
          label: "Margin Top",
          default: 0,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Margin Bottom",
          default: 0,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Padding",
          default: 0,
          min: 0,
          max: 100,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "effects",
      options: [
        {
          label: "Text Shadow",
          type: "select",
          default: "None",
          options: ["None", "Subtle", "Medium", "Strong"],
        },
        {
          label: "Opacity",
          default: 100,
          min: 0,
          max: 100,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "decoration",
      options: [
        {
          label: "Text Decoration",
          type: "select",
          default: "None",
          options: ["None", "Underline", "Overline", "Line Through"],
        },
        {
          label: "Decoration Style",
          type: "select",
          default: "Solid",
          options: ["Solid", "Dashed", "Dotted", "Double", "Wavy"],
        },
        {
          label: "Decoration Color",
          default: "#1F2937",
          type: "color",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
  }

  public update() {
    const textTransform = this.getTextTransform(
      this.state["typography-Text Transform"] || "None"
    );
    const textAlign = this.getTextAlign(
      this.state["styling-Text Align"] || "Left"
    );
    const textDecoration = this.getTextDecoration(
      this.state["decoration-Text Decoration"] || "None"
    );
    const decorationStyle = (
      this.state["decoration-Decoration Style"] || "Solid"
    ).toLowerCase();

    const styles: React.CSSProperties = {
      fontFamily: this.state["typography-Font Family"] || "system-ui",
      fontWeight: this.getFontWeight(
        this.state["typography-Font Weight"] || "Regular"
      ),
      fontSize: `${this.state["typography-Font Size"] || 16}px`,
      lineHeight: this.state["typography-Line Height"] || 1.5,
      letterSpacing: `${this.state["typography-Letter Spacing"] || 0}px`,
      textTransform,
      color: this.state["styling-Text Color"] || "#1F2937",
      textAlign,
      backgroundColor: this.state["styling-Background Color"] || "transparent",
      maxWidth: `${this.state["styling-Max Width"] || 100}%`,
      marginTop: `${this.state["spacing-Margin Top"] || 0}px`,
      marginBottom: `${this.state["spacing-Margin Bottom"] || 0}px`,
      padding: `${this.state["spacing-Padding"] || 0}px`,
      textShadow: this.getTextShadow(
        this.state["effects-Text Shadow"] || "None"
      ),
      opacity: (this.state["effects-Opacity"] || 100) / 100,
      textDecoration,
      textDecorationStyle: decorationStyle as any,
      textDecorationColor:
        this.state["decoration-Decoration Color"] || "#1F2937",
    };

    const elementType = this.getElementType(
      this.state["content-Element Type"] || "Paragraph"
    );

    this.updateAll(
      elementType,
      this.state["content-Text Content"] || "Your text here",
      [],
      styles
    );
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }

  private getElementType(type: string): string {
    const typeMap: Record<string, string> = {
      "Heading 1": "h1",
      "Heading 2": "h2",
      "Heading 3": "h3",
      Paragraph: "p",
      Span: "span",
    };
    return typeMap[type] || "p";
  }

  private getFontWeight(style: string): number {
    const map: Record<string, number> = {
      Light: 300,
      Regular: 400,
      Medium: 500,
      SemiBold: 600,
      Bold: 700,
      Black: 900,
    };
    return map[style] || 400;
  }

  private getTextTransform(
    transform: string
  ): React.CSSProperties["textTransform"] {
    const map: Record<
      string,
      "none" | "uppercase" | "lowercase" | "capitalize"
    > = {
      None: "none",
      Uppercase: "uppercase",
      Lowercase: "lowercase",
      Capitalize: "capitalize",
    };
    return map[transform] || "none";
  }

  private getTextAlign(align: string): React.CSSProperties["textAlign"] {
    return align.toLowerCase() as React.CSSProperties["textAlign"];
  }

  private getTextDecoration(decoration: string): string {
    const map: Record<string, string> = {
      None: "none",
      Underline: "underline",
      Overline: "overline",
      "Line Through": "line-through",
    };
    return map[decoration] || "none";
  }

  private getTextShadow(shadow: string): string {
    const shadowMap: Record<string, string> = {
      None: "none",
      Subtle: "1px 1px 2px rgba(0, 0, 0, 0.1)",
      Medium: "2px 2px 4px rgba(0, 0, 0, 0.2)",
      Strong: "3px 3px 6px rgba(0, 0, 0, 0.3)",
    };
    return shadowMap[shadow] || "none";
  }
}
