import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { Component } from "../../component";

export class Video extends Component {
  editOptions: IComponentOption[] = [
    { id: "dimensions", label: "Dimensions" },
    { id: "source", label: "Source" },
    { id: "styling", label: "Styling" },
    { id: "controls", label: "Controls" },
    { id: "effects", label: "Effects" },
    { id: "behavior", label: "Behavior" },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "dimensions",
      options: [
        {
          label: "Width",
          default: 640,
          min: 200,
          max: 1920,
          type: "number",
        },
        {
          label: "Height",
          default: 360,
          min: 150,
          max: 1080,
          type: "number",
        },
        {
          label: "Max Width",
          default: 100,
          min: 50,
          max: 100,
          type: "number",
        },
        {
          label: "Aspect Ratio",
          default: "16:9",
          options: ["16:9", "4:3", "21:9", "1:1", "9:16"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "source",
      options: [
        {
          label: "Video URL",
          default: "https://example.com/video.mp4",
          type: "text",
        },
        {
          label: "Poster Image URL",
          default: "",
          type: "text",
        },
      ] as TOption,
    },
    {
      parentId: "styling",
      options: [
        {
          label: "Corner Radius",
          min: 0,
          max: 50,
          default: 8,
          type: "number",
        },
        {
          label: "Object Fit",
          default: "Cover",
          options: ["Cover", "Contain", "Fill", "None"],
          type: "select",
        },
        {
          label: "Border Width",
          min: 0,
          max: 10,
          default: 0,
          type: "number",
        },
        {
          label: "Border Color",
          default: "#E5E7EB",
          type: "color",
        },
      ] as TOption,
    },
    {
      parentId: "controls",
      options: [
        {
          label: "Show Controls",
          type: "select",
          default: "Yes",
          options: ["Yes", "No"],
        },
        {
          label: "Control Style",
          type: "select",
          default: "Default",
          options: ["Default", "Custom"],
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
          label: "Filter Effect",
          type: "select",
          default: "None",
          options: ["None", "Grayscale", "Sepia", "Blur", "Brightness"],
        },
      ] as TOption,
    },
    {
      parentId: "behavior",
      options: [
        {
          label: "Autoplay",
          type: "select",
          default: "No",
          options: ["Yes", "No"],
        },
        {
          label: "Loop",
          type: "select",
          default: "No",
          options: ["Yes", "No"],
        },
        {
          label: "Muted",
          type: "select",
          default: "No",
          options: ["Yes", "No"],
        },
        {
          label: "Preload",
          type: "select",
          default: "Metadata",
          options: ["None", "Metadata", "Auto"],
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
  }

  public update() {
    const objectFit = this.getObjectFit(
      this.state["styling-Object Fit"] || "Cover"
    );

    const styles: React.CSSProperties = {
      width: `${this.state["dimensions-Width"] || 640}px`,
      height: `${this.state["dimensions-Height"] || 360}px`,
      maxWidth: `${this.state["dimensions-Max Width"] || 100}%`,
      borderRadius: `${this.state["styling-Corner Radius"] || 8}px`,
      objectFit,
      border: `${this.state["styling-Border Width"] || 0}px solid ${
        this.state["styling-Border Color"] || "#E5E7EB"
      }`,
      boxShadow: this.getShadow(this.state["effects-Shadow Size"] || "Medium"),
      opacity: (this.state["effects-Opacity"] || 100) / 100,
      filter: this.getFilter(this.state["effects-Filter Effect"] || "None"),
      display: "block",
    };

    this.updateAll(
      "video",
      this.state["source-Video URL"] || "https://example.com/video.mp4",
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
    };
    return fitMap[fit] || "cover";
  }

  private getShadow(size: string): string {
    const shadowMap: Record<string, string> = {
      None: "none",
      Small: "0 1px 3px rgba(0, 0, 0, 0.12)",
      Medium: "0 4px 6px rgba(0, 0, 0, 0.1)",
      Large: "0 10px 15px rgba(0, 0, 0, 0.1)",
    };
    return shadowMap[size] || shadowMap.Medium;
  }

  private getFilter(effect: string): string {
    const filterMap: Record<string, string> = {
      None: "none",
      Grayscale: "grayscale(100%)",
      Sepia: "sepia(100%)",
      Blur: "blur(4px)",
      Brightness: "brightness(1.2)",
    };
    return filterMap[effect] || "none";
  }
}
