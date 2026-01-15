import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { Component } from "../../component";

export class Image extends Component {
  editOptions: IComponentOption[] = [
    { id: "dimensions", label: "Dimensions" },
    { id: "source", label: "Source" },
    { id: "styling", label: "Styling" },
    { id: "effects", label: "Effects" },
    { id: "border", label: "Border" },
    { id: "transform", label: "Transform" },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "dimensions",
      options: [
        {
          label: "Width",
          default: 300,
          min: 50,
          max: 2000,
          type: "number",
        },
        {
          label: "Height",
          default: 200,
          min: 50,
          max: 2000,
          type: "number",
        },
        {
          label: "Max Width",
          default: 100,
          min: 10,
          max: 100,
          type: "number",
        },
        {
          label: "Object Fit",
          default: "Cover",
          options: ["Cover", "Contain", "Fill", "None", "Scale Down"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "source",
      options: [
        {
          label: "Image URL",
          default: "https://via.placeholder.com/300x200",
          type: "text",
        },
        {
          label: "Alt Text",
          default: "Image description",
          type: "text",
        },
        {
          label: "Loading",
          default: "Lazy",
          options: ["Lazy", "Eager"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "styling",
      options: [
        {
          label: "Corner Radius",
          min: 0,
          max: 100,
          default: 8,
          type: "number",
        },
        {
          label: "Display",
          default: "Block",
          options: ["Block", "Inline Block", "Flex"],
          type: "select",
        },
        {
          label: "Object Position",
          default: "Center",
          options: ["Center", "Top", "Bottom", "Left", "Right"],
          type: "select",
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
          options: ["None", "Small", "Medium", "Large", "XLarge"],
        },
        {
          label: "Opacity",
          default: 100,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Filter",
          type: "select",
          default: "None",
          options: [
            "None",
            "Grayscale",
            "Sepia",
            "Blur",
            "Brightness",
            "Contrast",
            "Saturate",
          ],
        },
        {
          label: "Hover Effect",
          type: "select",
          default: "None",
          options: ["None", "Zoom", "Brighten", "Grayscale"],
        },
      ] as TOption,
    },
    {
      parentId: "border",
      options: [
        {
          label: "Border Width",
          min: 0,
          max: 20,
          default: 0,
          type: "number",
        },
        {
          label: "Border Color",
          default: "#E5E7EB",
          type: "color",
        },
        {
          label: "Border Style",
          type: "select",
          default: "Solid",
          options: ["Solid", "Dashed", "Dotted", "Double"],
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
          min: 10,
          max: 200,
          type: "number",
        },
        {
          label: "Flip",
          type: "select",
          default: "None",
          options: ["None", "Horizontal", "Vertical", "Both"],
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
  }

  public update() {
    const objectFit = this.getObjectFit(
      this.state["dimensions-Object Fit"] || "Cover"
    );
    const display = this.getDisplay(this.state["styling-Display"] || "Block");
    const borderStyle = (
      this.state["border-Border Style"] || "Solid"
    ).toLowerCase();

    const styles: React.CSSProperties = {
      width: `${this.state["dimensions-Width"] || 300}px`,
      height: `${this.state["dimensions-Height"] || 200}px`,
      maxWidth: `${this.state["dimensions-Max Width"] || 100}%`,
      objectFit,
      objectPosition: this.getObjectPosition(
        this.state["styling-Object Position"] || "Center"
      ),
      borderRadius: `${this.state["styling-Corner Radius"] || 8}px`,
      display,
      border: `${this.state["border-Border Width"] || 0}px ${borderStyle} ${
        this.state["border-Border Color"] || "#E5E7EB"
      }`,
      boxShadow: this.getShadow(this.state["effects-Shadow Size"] || "None"),
      opacity: (this.state["effects-Opacity"] || 100) / 100,
      filter: this.getFilter(this.state["effects-Filter"] || "None"),
      transform: this.getTransform(),
      transition: "all 0.3s ease",
    };

    this.updateAll(
      "img",
      this.state["source-Image URL"] || "https://via.placeholder.com/300x200",
      [],
      styles
    );
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }

  private getObjectFit(fit: string): React.CSSProperties["objectFit"] {
    const fitMap: Record<string, React.CSSProperties["objectFit"]> = {
      Cover: "cover",
      Contain: "contain",
      Fill: "fill",
      None: "none",
      "Scale Down": "scale-down",
    };
    return fitMap[fit] || "cover";
  }

  private getDisplay(display: string): string {
    const displayMap: Record<string, string> = {
      Block: "block",
      "Inline Block": "inline-block",
      Flex: "flex",
    };
    return displayMap[display] || "block";
  }

  private getObjectPosition(position: string): string {
    return position.toLowerCase();
  }

  private getShadow(size: string): string {
    const shadowMap: Record<string, string> = {
      None: "none",
      Small: "0 1px 3px rgba(0, 0, 0, 0.12)",
      Medium: "0 4px 6px rgba(0, 0, 0, 0.1)",
      Large: "0 10px 15px rgba(0, 0, 0, 0.1)",
      XLarge: "0 20px 25px rgba(0, 0, 0, 0.15)",
    };
    return shadowMap[size] || "none";
  }

  private getFilter(effect: string): string {
    const filterMap: Record<string, string> = {
      None: "none",
      Grayscale: "grayscale(100%)",
      Sepia: "sepia(100%)",
      Blur: "blur(4px)",
      Brightness: "brightness(1.2)",
      Contrast: "contrast(1.2)",
      Saturate: "saturate(1.5)",
    };
    return filterMap[effect] || "none";
  }

  private getTransform(): string {
    const rotate = this.state["transform-Rotate"] || 0;
    const scale = (this.state["transform-Scale"] || 100) / 100;
    const flip = this.state["transform-Flip"] || "None";

    let scaleX = scale;
    let scaleY = scale;

    if (flip === "Horizontal") scaleX *= -1;
    if (flip === "Vertical") scaleY *= -1;
    if (flip === "Both") {
      scaleX *= -1;
      scaleY *= -1;
    }

    return `rotate(${rotate}deg) scale(${scaleX}, ${scaleY})`;
  }
}
