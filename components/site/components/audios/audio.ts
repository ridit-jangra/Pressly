import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { Component } from "../../component";

export class Audio extends Component {
  editOptions: IComponentOption[] = [
    { id: "source", label: "Source" },
    { id: "dimensions", label: "Dimensions" },
    { id: "styling", label: "Styling" },
    { id: "controls", label: "Controls" },
    { id: "behavior", label: "Behavior" },
    { id: "effects", label: "Effects" },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "source",
      options: [
        {
          label: "Audio URL",
          default: "https://example.com/audio.mp3",
          type: "text",
        },
        {
          label: "Title",
          default: "Audio Track",
          type: "text",
        },
      ] as TOption,
    },
    {
      parentId: "dimensions",
      options: [
        {
          label: "Width",
          default: 100,
          min: 50,
          max: 100,
          type: "number",
        },
        {
          label: "Max Width",
          default: 500,
          min: 200,
          max: 1000,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "styling",
      options: [
        {
          label: "Background Color",
          default: "#F3F4F6",
          type: "color",
        },
        {
          label: "Accent Color",
          default: "#6366F1",
          type: "color",
        },
        {
          label: "Corner Radius",
          min: 0,
          max: 50,
          default: 8,
          type: "number",
        },
        {
          label: "Border Width",
          min: 0,
          max: 5,
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
          label: "Control Type",
          type: "select",
          default: "Default",
          options: ["Default", "Custom"],
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
        {
          label: "Volume",
          default: 100,
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
          label: "Shadow Size",
          type: "select",
          default: "Small",
          options: ["None", "Small", "Medium", "Large"],
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
  ];

  constructor() {
    super();
  }

  public update() {
    const styles: React.CSSProperties = {
      width: `${this.state["dimensions-Width"] || 100}%`,
      maxWidth: `${this.state["dimensions-Max Width"] || 500}px`,
      backgroundColor: this.state["styling-Background Color"] || "#F3F4F6",
      borderRadius: `${this.state["styling-Corner Radius"] || 8}px`,
      border: `${this.state["styling-Border Width"] || 0}px solid ${
        this.state["styling-Border Color"] || "#E5E7EB"
      }`,
      boxShadow: this.getShadow(this.state["effects-Shadow Size"] || "Small"),
      opacity: (this.state["effects-Opacity"] || 100) / 100,
      display: "block",
      outline: "none",
    };

    this.updateAll(
      "audio",
      this.state["source-Audio URL"] || "https://example.com/audio.mp3",
      [],
      styles
    );
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }

  private getShadow(size: string): string {
    const shadowMap: Record<string, string> = {
      None: "none",
      Small: "0 1px 3px rgba(0, 0, 0, 0.12)",
      Medium: "0 4px 6px rgba(0, 0, 0, 0.1)",
      Large: "0 10px 15px rgba(0, 0, 0, 0.1)",
    };
    return shadowMap[size] || shadowMap.Small;
  }
}
