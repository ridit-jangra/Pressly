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
      id: "effects",
      label: "Effects",
    },
    {
      id: "spacing",
      label: "Spacing",
    },
    {
      id: "border",
      label: "Border",
    },
    {
      id: "states",
      label: "States",
    },
  ];

  childOptions: IComponentChildOption[] = [
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
            "sans-serif",
            "serif",
            "monospace",
          ],
          type: "select",
        },
        {
          label: "Font Weight",
          default: "SemiBold",
          options: ["Light", "Regular", "Medium", "SemiBold", "Bold", "Black"],
          type: "select",
        },
        {
          label: "Font Size",
          default: 15,
          min: 8,
          max: 100,
          type: "number",
        },
        {
          label: "Text Content",
          default: "Get Started",
          type: "text",
        },
        {
          label: "Letter Spacing",
          default: 0.3,
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
          default: "#FFFFFF",
          type: "color",
        },
        {
          label: "Background Color",
          default: "#6366F1",
          type: "color",
        },
        {
          label: "Background Style",
          default: "Solid",
          options: ["Solid", "Gradient"],
          type: "select",
        },
        {
          label: "Gradient Color",
          default: "#818CF8",
          type: "color",
        },
        {
          label: "Corner Radius",
          min: 0,
          max: 100,
          default: 10,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "effects",
      options: [
        {
          label: "Shadow Size",
          type: "select",
          default: "Medium",
          options: ["None", "Small", "Medium", "Large", "XLarge"],
        },
        {
          label: "Shadow Color",
          default: "#6366F1",
          type: "color",
        },
        {
          label: "Opacity",
          default: 100,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Blur Effect",
          default: "None",
          options: ["None", "Subtle", "Medium", "Strong"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "dimensions",
      options: [
        {
          label: "Width",
          default: 160,
          min: 50,
          max: 600,
          type: "number",
        },
        {
          label: "Height",
          default: 48,
          min: 32,
          max: 200,
          type: "number",
        },
        {
          label: "Min Width",
          default: 120,
          min: 0,
          max: 600,
          type: "number",
        },
        {
          label: "Max Width",
          default: 400,
          min: 0,
          max: 1000,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "spacing",
      options: [
        {
          label: "Padding Horizontal",
          default: 24,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Padding Vertical",
          default: 12,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Text Align",
          type: "select",
          default: "Center",
          options: ["Left", "Center", "Right"],
        },
        {
          label: "Gap",
          default: 8,
          min: 0,
          max: 50,
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
          max: 10,
          default: 0,
          type: "number",
        },
        {
          label: "Border Color",
          default: "#818CF8",
          type: "color",
        },
        {
          label: "Border Style",
          type: "select",
          default: "Solid",
          options: ["Solid", "Dashed", "Dotted", "Double"],
        },
        {
          label: "Outline Width",
          min: 0,
          max: 10,
          default: 0,
          type: "number",
        },
        {
          label: "Outline Color",
          default: "#A5B4FC",
          type: "color",
        },
      ] as TOption,
    },
    {
      parentId: "states",
      options: [
        {
          label: "Hover Effect",
          type: "select",
          default: "Lift",
          options: ["None", "Darken", "Lighten", "Lift", "Scale", "Glow"],
        },
        {
          label: "Disabled State",
          type: "select",
          default: "No",
          options: ["Yes", "No"],
        },
        {
          label: "Cursor Style",
          type: "select",
          default: "Pointer",
          options: ["Pointer", "Default", "Not-Allowed"],
        },
        {
          label: "Transition Speed",
          type: "select",
          default: "Medium",
          options: ["Fast", "Medium", "Slow"],
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
  }

  public update() {
    const bgStyle = this.state["styling-Background Style"] || "Solid";
    const bgColor = this.state["styling-Background Color"] || "#6366F1";
    const gradientColor = this.state["styling-Gradient Color"] || "#818CF8";

    const background =
      bgStyle === "Gradient"
        ? `linear-gradient(135deg, ${bgColor}, ${gradientColor})`
        : bgColor;

    const textTransform = this.state["typography-Text Transform"] || "None";
    const transformMap: Record<string, string> = {
      None: "none",
      Uppercase: "uppercase",
      Lowercase: "lowercase",
      Capitalize: "capitalize",
    };

    const borderStyle = (
      this.state["border-Border Style"] || "Solid"
    ).toLowerCase();
    const transitionSpeed = this.getTransitionSpeed(
      this.state["states-Transition Speed"] || "Medium"
    );

    const styles: React.CSSProperties = {
      // Typography
      fontFamily: this.state["typography-Font Family"] || "system-ui",
      fontWeight: this.getFontWeight(
        this.state["typography-Font Weight"] || "SemiBold"
      ),
      fontSize: `${this.state["typography-Font Size"] || 15}px`,
      letterSpacing: `${this.state["typography-Letter Spacing"] || 0.3}px`,
      textTransform: transformMap[textTransform] as any,
      color: this.state["styling-Text Color"] || "#FFFFFF",

      // Background & Colors
      background,
      borderRadius: `${this.state["styling-Corner Radius"] || 10}px`,

      // Dimensions
      width: `${this.state["dimensions-Width"] || 160}px`,
      height: `${this.state["dimensions-Height"] || 48}px`,
      minWidth: `${this.state["dimensions-Min Width"] || 120}px`,
      maxWidth: `${this.state["dimensions-Max Width"] || 400}px`,

      // Spacing
      paddingLeft: `${this.state["spacing-Padding Horizontal"] || 24}px`,
      paddingRight: `${this.state["spacing-Padding Horizontal"] || 24}px`,
      paddingTop: `${this.state["spacing-Padding Vertical"] || 12}px`,
      paddingBottom: `${this.state["spacing-Padding Vertical"] || 12}px`,
      textAlign: (
        this.state["spacing-Text Align"] || "Center"
      ).toLowerCase() as any,
      gap: `${this.state["spacing-Gap"] || 8}px`,

      // Border
      border: `${this.state["border-Border Width"] || 0}px ${borderStyle} ${
        this.state["border-Border Color"] || "#818CF8"
      }`,
      outline:
        this.state["border-Outline Width"] > 0
          ? `${this.state["border-Outline Width"]}px solid ${
              this.state["border-Outline Color"] || "#A5B4FC"
            }`
          : "none",
      outlineOffset: "2px",

      // Effects
      boxShadow: this.getShadow(
        this.state["effects-Shadow Size"] || "Medium",
        this.state["effects-Shadow Color"] || "#6366F1"
      ),
      opacity: (this.state["effects-Opacity"] || 100) / 100,
      backdropFilter: this.getBlurEffect(
        this.state["effects-Blur Effect"] || "None"
      ),

      // States
      cursor: (this.state["states-Cursor Style"] || "Pointer").toLowerCase(),
      transition: `all ${transitionSpeed} cubic-bezier(0.4, 0, 0.2, 1)`,

      // Layout
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      WebkitUserSelect: "none",
      position: "relative",
      overflow: "hidden",

      // Disabled state
      ...(this.state["states-Disabled State"] === "Yes" && {
        opacity: 0.5,
        cursor: "not-allowed",
        pointerEvents: "none",
      }),
    };

    this.updateAll(
      "button",
      this.state["typography-Text Content"] || "Get Started",
      [],
      styles
    );
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    // Re-run update to recalculate all styles when any value changes
    this.update();
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
    return map[style] || 600;
  }

  private getShadow(size: string, color: string): string {
    const shadowMap: Record<string, string> = {
      None: "none",
      Small: `0 1px 2px ${this.hexToRgba(color, 0.15)}`,
      Medium: `0 4px 6px -1px ${this.hexToRgba(
        color,
        0.2
      )}, 0 2px 4px -1px ${this.hexToRgba(color, 0.1)}`,
      Large: `0 10px 15px -3px ${this.hexToRgba(
        color,
        0.25
      )}, 0 4px 6px -2px ${this.hexToRgba(color, 0.1)}`,
      XLarge: `0 20px 25px -5px ${this.hexToRgba(
        color,
        0.3
      )}, 0 10px 10px -5px ${this.hexToRgba(color, 0.15)}`,
    };
    return shadowMap[size] || shadowMap.Medium;
  }

  private getBlurEffect(blur: string): string {
    const blurMap: Record<string, string> = {
      None: "none",
      Subtle: "blur(2px)",
      Medium: "blur(4px)",
      Strong: "blur(8px)",
    };
    return blurMap[blur] || "none";
  }

  private getTransitionSpeed(speed: string): string {
    const speedMap: Record<string, string> = {
      Fast: "0.15s",
      Medium: "0.25s",
      Slow: "0.4s",
    };
    return speedMap[speed] || "0.25s";
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
