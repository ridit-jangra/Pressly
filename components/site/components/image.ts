import { Component } from "../component";
import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";

export class Image extends Component {
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
      id: "advanced",
      label: "Advanced",
    },
  ];

  childOptions: IComponentChildOption[] = [
    {
      parentId: "content",
      options: [
        {
          label: "Image URL",
          default:
            "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
          type: "text",
        },
        {
          label: "Alt Text",
          default: "Descriptive image text",
          type: "text",
        },
        {
          label: "Link URL",
          default: "",
          type: "text",
        },
        {
          label: "Link Target",
          default: "_self",
          options: ["_self", "_blank"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "style",
      options: [
        {
          label: "Width Type",
          default: "Full Width",
          options: ["Full Width", "Custom", "Auto"],
          type: "select",
        },
        {
          label: "Custom Width",
          default: 600,
          min: 50,
          max: 2000,
          type: "number",
        },
        {
          label: "Height Type",
          default: "Auto",
          options: ["Auto", "Custom"],
          type: "select",
        },
        {
          label: "Custom Height",
          default: 400,
          min: 50,
          max: 1000,
          type: "number",
        },
        {
          label: "Object Fit",
          default: "Cover",
          options: ["Cover", "Contain", "Fill", "None"],
          type: "select",
        },
        {
          label: "Border Radius",
          default: 8,
          min: 0,
          max: 50,
          type: "number",
        },
        {
          label: "Alignment",
          default: "Center",
          options: ["Left", "Center", "Right"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "advanced",
      options: [
        {
          label: "Opacity",
          default: 100,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Hover Effect",
          default: "Zoom",
          options: ["None", "Zoom", "Brightness", "Grayscale", "Blur"],
          type: "select",
        },
        {
          label: "Box Shadow",
          default: "Medium",
          options: ["None", "Small", "Medium", "Large"],
          type: "select",
        },
        {
          label: "Border Width",
          default: 0,
          min: 0,
          max: 20,
          type: "number",
        },
        {
          label: "Border Color",
          default: "#e5e7eb",
          type: "color",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.update();
  }

  public update() {
    const imageUrl =
      this.state["content-Image URL"] ||
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800";
    const altText = this.state["content-Alt Text"] || "Descriptive image text";
    const linkUrl = this.state["content-Link URL"] || "";
    const linkTarget = this.state["content-Link Target"] || "_self";

    const widthType = this.state["style-Width Type"] || "Full Width";
    const customWidth = this.state["style-Custom Width"] || 600;
    const heightType = this.state["style-Height Type"] || "Auto";
    const customHeight = this.state["style-Custom Height"] || 400;
    const objectFit = this.state["style-Object Fit"] || "Cover";
    const borderRadius = this.state["style-Border Radius"] || 8;
    const alignment = this.state["style-Alignment"] || "Center";

    const opacity = this.state["advanced-Opacity"] || 100;
    const hoverEffect = this.state["advanced-Hover Effect"] || "Zoom";
    const boxShadow = this.state["advanced-Box Shadow"] || "Medium";
    const borderWidth = this.state["advanced-Border Width"] || 0;
    const borderColor = this.state["advanced-Border Color"] || "#e5e7eb";

    const shadowMap: Record<string, string> = {
      None: "none",
      Small: "0 1px 3px rgba(0,0,0,0.12)",
      Medium: "0 4px 6px rgba(0,0,0,0.1)",
      Large: "0 10px 15px rgba(0,0,0,0.15)",
    };

    const hoverEffectMap: Record<string, string> = {
      None: "",
      Zoom: "transform: scale(1.05);",
      Brightness: "filter: brightness(1.1);",
      Grayscale: "filter: grayscale(0%);",
      Blur: "filter: blur(0);",
    };

    let width = "100%";
    if (widthType === "Custom") {
      width = `${customWidth}px`;
    } else if (widthType === "Auto") {
      width = "auto";
    }

    const height = heightType === "Custom" ? `${customHeight}px` : "auto";

    const containerAlign: Record<string, string> = {
      Left: "flex-start",
      Center: "center",
      Right: "flex-end",
    };

    const imageStyles: React.CSSProperties = {
      width,
      height,
      objectFit: objectFit.toLowerCase() as any,
      borderRadius: `${borderRadius}px`,
      opacity: opacity / 100,
      boxShadow: shadowMap[boxShadow],
      border:
        borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
      transition: "all 0.3s ease",
      display: "block",
      ...(hoverEffect === "Grayscale" && {
        filter: "grayscale(100%)",
      }),
    };

    const containerStyles: React.CSSProperties = {
      display: "flex",
      justifyContent: containerAlign[alignment],
      width: "100%",
    };

    const hoverAttr =
      hoverEffect !== "None"
        ? `onmouseover="this.style.cssText+='${hoverEffectMap[hoverEffect]}'" onmouseout="this.style.cssText=this.style.cssText.replace('${hoverEffectMap[hoverEffect]}', '')"`
        : "";

    const imageElement = `<img src="${imageUrl}" alt="${altText}" style="${this.formatStyles(imageStyles)}" ${hoverAttr} />`;

    const content = linkUrl
      ? `<a href="${linkUrl}" target="${linkTarget}" ${linkTarget === "_blank" ? 'rel="noopener noreferrer"' : ""}>${imageElement}</a>`
      : imageElement;

    this.code = `<div style="${this.formatStyles(containerStyles)}">${content}</div>`;
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }
}
