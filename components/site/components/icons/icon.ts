import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { Component } from "../../component";

export class Icon extends Component {
  editOptions: IComponentOption[] = [
    { id: "content", label: "Content" },
    { id: "dimensions", label: "Dimensions" },
    { id: "styling", label: "Styling" },
    { id: "effects", label: "Effects" },
    { id: "transform", label: "Transform" },
    { id: "states", label: "States" },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "content",
      options: [
        {
          label: "Icon Type",
          default: "SVG",
          options: ["SVG", "Icon Font", "Emoji"],
          type: "select",
        },
        {
          label: "Icon Name/URL",
          default: "⭐",
          type: "text",
        },
      ] as TOption,
    },
    {
      parentId: "dimensions",
      options: [
        {
          label: "Size",
          default: 24,
          min: 12,
          max: 200,
          type: "number",
        },
        {
          label: "Container Size",
          default: 40,
          min: 20,
          max: 200,
          type: "number",
        },
        {
          label: "Aspect Ratio",
          type: "select",
          default: "Square",
          options: ["Square", "Circle"],
        },
      ] as TOption,
    },
    {
      parentId: "styling",
      options: [
        {
          label: "Icon Color",
          default: "#6366F1",
          type: "color",
        },
        {
          label: "Background Color",
          default: "transparent",
          type: "color",
        },
        {
          label: "Background Style",
          default: "None",
          options: ["None", "Solid", "Gradient"],
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
          max: 50,
          default: 8,
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
          default: "None",
          options: ["None", "Small", "Medium", "Large"],
        },
        {
          label: "Opacity",
          default: 100,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Glow Effect",
          type: "select",
          default: "None",
          options: ["None", "Subtle", "Medium", "Strong"],
        },
      ] as TOption,
    },
    {
      parentId: "transform",
      options: [
        {
          label: "Rotate",
          default: 0,
          min: -180,
          max: 180,
          type: "number",
        },
        {
          label: "Scale",
          default: 100,
          min: 50,
          max: 200,
          type: "number",
        },
        {
          label: "Flip",
          type: "select",
          default: "None",
          options: ["None", "Horizontal", "Vertical"],
        },
      ] as TOption,
    },
    {
      parentId: "states",
      options: [
        {
          label: "Hover Effect",
          type: "select",
          default: "None",
          options: ["None", "Scale", "Rotate", "Color Change", "Bounce"],
        },
        {
          label: "Cursor Style",
          type: "select",
          default: "Default",
          options: ["Default", "Pointer", "Not-Allowed"],
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
    const bgStyle = this.state["styling-Background Style"] || "None";
    const bgColor = this.state["styling-Background Color"] || "transparent";
    const gradientColor = this.state["styling-Gradient Color"] || "#818CF8";

    const background =
      bgStyle === "Gradient"
        ? `linear-gradient(135deg, ${bgColor}, ${gradientColor})`
        : bgStyle === "Solid"
        ? bgColor
        : "transparent";

    const aspectRatio = this.state["dimensions-Aspect Ratio"] || "Square";
    const borderRadius =
      aspectRatio === "Circle"
        ? "50%"
        : `${this.state["styling-Corner Radius"] || 8}px`;

    const transitionSpeed = this.getTransitionSpeed(
      this.state["states-Transition Speed"] || "Medium"
    );

    const styles: React.CSSProperties = {
      fontSize: `${this.state["dimensions-Size"] || 24}px`,
      color: this.state["styling-Icon Color"] || "#6366F1",
      width: `${this.state["dimensions-Container Size"] || 40}px`,
      height: `${this.state["dimensions-Container Size"] || 40}px`,
      background,
      borderRadius,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: this.getShadow(
        this.state["effects-Shadow Size"] || "None",
        this.state["styling-Icon Color"] || "#6366F1"
      ),
      opacity: (this.state["effects-Opacity"] || 100) / 100,
      filter: this.getGlowEffect(
        this.state["effects-Glow Effect"] || "None",
        this.state["styling-Icon Color"] || "#6366F1"
      ),
      transform: this.getTransform(),
      cursor: (this.state["states-Cursor Style"] || "Default").toLowerCase(),
      transition: `all ${transitionSpeed} ease`,
      userSelect: "none",
      WebkitUserSelect: "none",
    };

    this.updateAll(
      "span",
      this.state["content-Icon Name/URL"] || "⭐",
      [],
      styles
    );
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }

  private getShadow(size: string, color: string): string {
    const shadowMap: Record<string, string> = {
      None: "none",
      Small: `0 1px 3px ${this.hexToRgba(color, 0.2)}`,
      Medium: `0 4px 6px ${this.hexToRgba(color, 0.3)}`,
      Large: `0 10px 15px ${this.hexToRgba(color, 0.4)}`,
    };
    return shadowMap[size] || "none";
  }

  private getGlowEffect(glow: string, color: string): string {
    const glowMap: Record<string, string> = {
      None: "none",
      Subtle: `drop-shadow(0 0 4px ${this.hexToRgba(color, 0.4)})`,
      Medium: `drop-shadow(0 0 8px ${this.hexToRgba(color, 0.6)})`,
      Strong: `drop-shadow(0 0 12px ${this.hexToRgba(color, 0.8)})`,
    };
    return glowMap[glow] || "none";
  }

  private getTransform(): string {
    const rotate = this.state["transform-Rotate"] || 0;
    const scale = (this.state["transform-Scale"] || 100) / 100;
    const flip = this.state["transform-Flip"] || "None";

    let scaleX = scale;
    let scaleY = scale;

    if (flip === "Horizontal") scaleX *= -1;
    if (flip === "Vertical") scaleY *= -1;

    return `rotate(${rotate}deg) scale(${scaleX}, ${scaleY})`;
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
    if (hex === "transparent") return `rgba(0, 0, 0, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
