import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";
import { Component } from "../../component";

export class toggleSwitch extends Component {
  editOptions: IComponentOption[] = [
    { id: "dimensions", label: "Dimensions" },
    { id: "styling", label: "Styling" },
    { id: "states", label: "States" },
    { id: "animation", label: "Animation" },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "dimensions",
      options: [
        {
          label: "Width",
          default: 48,
          min: 32,
          max: 80,
          type: "number",
        },
        {
          label: "Height",
          default: 24,
          min: 16,
          max: 40,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "styling",
      options: [
        {
          label: "Active Color",
          default: "#6366F1",
          type: "color",
        },
        {
          label: "Inactive Color",
          default: "#D1D5DB",
          type: "color",
        },
        {
          label: "Thumb Color",
          default: "#FFFFFF",
          type: "color",
        },
        {
          label: "Corner Radius",
          min: 0,
          max: 50,
          default: 24,
          type: "number",
        },
      ] as TOption,
    },
    {
      parentId: "states",
      options: [
        {
          label: "Default State",
          type: "select",
          default: "Off",
          options: ["On", "Off"],
        },
        {
          label: "Disabled",
          type: "select",
          default: "No",
          options: ["Yes", "No"],
        },
      ] as TOption,
    },
    {
      parentId: "animation",
      options: [
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
    const isOn = this.state["states-Default State"] === "On";
    const transitionSpeed = this.getTransitionSpeed(
      this.state["animation-Transition Speed"] || "Medium"
    );

    const styles: React.CSSProperties = {
      width: `${this.state["dimensions-Width"] || 48}px`,
      height: `${this.state["dimensions-Height"] || 24}px`,
      backgroundColor: isOn
        ? this.state["styling-Active Color"] || "#6366F1"
        : this.state["styling-Inactive Color"] || "#D1D5DB",
      borderRadius: `${this.state["styling-Corner Radius"] || 24}px`,
      position: "relative",
      cursor: "pointer",
      transition: `background-color ${transitionSpeed}`,

      ...(this.state["states-Disabled"] === "Yes" && {
        opacity: 0.5,
        cursor: "not-allowed",
      }),
    };

    this.updateAll("div", "", [], styles);
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }

  private getTransitionSpeed(speed: string): string {
    const speedMap: Record<string, string> = {
      Fast: "0.15s",
      Medium: "0.25s",
      Slow: "0.4s",
    };
    return speedMap[speed] || "0.25s";
  }
}
