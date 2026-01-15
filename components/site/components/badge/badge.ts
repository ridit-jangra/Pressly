import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { Component } from "../../component";

export class badge extends Component {
  editOptions: IComponentOption[] = [
    { id: "typography", label: "Typography" },
    { id: "styling", label: "Styling" },
    { id: "spacing", label: "Spacing" },
    { id: "variants", label: "Variants" },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "typography",
      options: [
        {
          label: "Font Size",
          default: 12,
          min: 8,
          max: 18,
          type: "number",
        },
        {
          label: "Font Weight",
          default: "SemiBold",
          options: ["Regular", "Medium", "SemiBold", "Bold"],
          type: "select",
        },
        {
          label: "Text Content",
          default: "New",
          type: "text",
        },
        {
          label: "Text Transform",
          default: "Uppercase",
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
          default: "#FFFFFF",
          type: "color",
        },
        {
          label: "Background Color",
          default: "#10B981",
          type: "color",
        },
        {
          label: "Corner Radius",
          min: 0,
          max: 50,
          default: 12,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "spacing",
      options: [
        {
          label: "Padding Horizontal",
          default: 10,
          min: 4,
          max: 30,
          type: "number",
        },
        {
          label: "Padding Vertical",
          default: 4,
          min: 2,
          max: 20,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "variants",
      options: [
        {
          label: "Style Variant",
          default: "Solid",
          options: ["Solid", "Outline", "Subtle"],
          type: "select",
        },
        {
          label: "Color Theme",
          default: "Success",
          options: ["Success", "Warning", "Error", "Info", "Default"],
          type: "select",
        },
        {
          label: "Size",
          default: "Medium",
          options: ["Small", "Medium", "Large"],
          type: "select",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
  }

  public update() {
    const colorTheme = this.getColorTheme(
      this.state["variants-Color Theme"] || "Success"
    );
    const variant = this.state["variants-Style Variant"] || "Solid";
    const textTransform = this.getTextTransform(
      this.state["typography-Text Transform"] || "Uppercase"
    );

    let styles: React.CSSProperties = {
      fontFamily: "system-ui",
      fontSize: `${this.state["typography-Font Size"] || 12}px`,
      fontWeight: this.getFontWeight(
        this.state["typography-Font Weight"] || "SemiBold"
      ),
      textTransform,
      borderRadius: `${this.state["styling-Corner Radius"] || 12}px`,
      paddingLeft: `${this.state["spacing-Padding Horizontal"] || 10}px`,
      paddingRight: `${this.state["spacing-Padding Horizontal"] || 10}px`,
      paddingTop: `${this.state["spacing-Padding Vertical"] || 4}px`,
      paddingBottom: `${this.state["spacing-Padding Vertical"] || 4}px`,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
      userSelect: "none",
    };

    if (variant === "Solid") {
      styles = {
        ...styles,
        backgroundColor: colorTheme.bg,
        color: colorTheme.text,
      };
    } else if (variant === "Outline") {
      styles = {
        ...styles,
        backgroundColor: "transparent",
        color: colorTheme.bg,
        border: `2px solid ${colorTheme.bg}`,
      };
    } else if (variant === "Subtle") {
      styles = {
        ...styles,
        backgroundColor: colorTheme.subtle,
        color: colorTheme.bg,
      };
    }

    this.updateAll(
      "span",
      this.state["typography-Text Content"] || "New",
      [],
      styles
    );
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }

  private getFontWeight(style: string): number {
    const map: Record<string, number> = {
      Regular: 400,
      Medium: 500,
      SemiBold: 600,
      Bold: 700,
    };
    return map[style] || 600;
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
    return map[transform] || "uppercase";
  }

  private getColorTheme(theme: string) {
    const themes: Record<string, { bg: string; text: string; subtle: string }> =
      {
        Success: { bg: "#10B981", text: "#FFFFFF", subtle: "#D1FAE5" },
        Warning: { bg: "#F59E0B", text: "#FFFFFF", subtle: "#FEF3C7" },
        Error: { bg: "#EF4444", text: "#FFFFFF", subtle: "#FEE2E2" },
        Info: { bg: "#3B82F6", text: "#FFFFFF", subtle: "#DBEAFE" },
        Default: { bg: "#6B7280", text: "#FFFFFF", subtle: "#F3F4F6" },
      };
    return themes[theme] || themes.Default;
  }
}
