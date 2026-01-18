import { Component } from "../component";
import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";

export class Button extends Component {
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
      id: "design",
      label: "Design",
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
          label: "Button Text",
          default: "Click Here",
          type: "text",
        },
        {
          label: "Link URL",
          default: "#",
          type: "text",
        },
        {
          label: "Link Target",
          default: "_self",
          options: ["_self", "_blank", "_parent", "_top"],
          type: "select",
        },
        {
          label: "Button Size",
          default: "Medium",
          options: ["Small", "Medium", "Large", "Extra Large"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "style",
      options: [
        {
          label: "Button Style",
          default: "Fill",
          options: ["Fill", "Outline", "Ghost", "Link"],
          type: "select",
        },
        {
          label: "Button Color",
          default: "#2563eb",
          type: "color",
        },
        {
          label: "Text Color",
          default: "#ffffff",
          type: "color",
        },
        {
          label: "Hover Color",
          default: "#1e40af",
          type: "color",
        },
      ] as TOption,
    },
    {
      parentId: "design",
      options: [
        {
          label: "Border Radius",
          default: 6,
          min: 0,
          max: 50,
          type: "number",
        },
        {
          label: "Border Width",
          default: 2,
          min: 0,
          max: 10,
          type: "number",
        },
        {
          label: "Font Size",
          default: 16,
          min: 10,
          max: 32,
          type: "number",
        },
        {
          label: "Font Weight",
          default: "600",
          options: ["400", "500", "600", "700", "800"],
          type: "select",
        },
        {
          label: "Icon Position",
          default: "None",
          options: ["None", "Left", "Right"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "advanced",
      options: [
        {
          label: "Width Type",
          default: "Auto",
          options: ["Auto", "Full Width", "Custom"],
          type: "select",
        },
        {
          label: "Custom Width",
          default: 200,
          min: 50,
          max: 800,
          type: "number",
        },
        {
          label: "Alignment",
          default: "Left",
          options: ["Left", "Center", "Right"],
          type: "select",
        },
        {
          label: "Add Shadow",
          default: "Yes",
          options: ["Yes", "No"],
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
    const buttonText = this.state["content-Button Text"] || "Click Here";
    const linkUrl = this.state["content-Link URL"] || "#";
    const linkTarget = this.state["content-Link Target"] || "_self";
    const buttonSize = this.state["content-Button Size"] || "Medium";
    const buttonStyle = this.state["style-Button Style"] || "Fill";
    const buttonColor = this.state["style-Button Color"] || "#2563eb";
    const textColor = this.state["style-Text Color"] || "#ffffff";
    const hoverColor = this.state["style-Hover Color"] || "#1e40af";
    const borderRadius = this.state["design-Border Radius"] || 6;
    const borderWidth = this.state["design-Border Width"] || 2;
    const fontSize = this.state["design-Font Size"] || 16;
    const fontWeight = this.state["design-Font Weight"] || "600";
    const widthType = this.state["advanced-Width Type"] || "Auto";
    const customWidth = this.state["advanced-Custom Width"] || 200;
    const alignment = this.state["advanced-Alignment"] || "Left";
    const addShadow = this.state["advanced-Add Shadow"] || "Yes";

    // Size mappings
    const sizeMap: Record<string, { padding: string; fontSize: number }> = {
      Small: { padding: "8px 16px", fontSize: 14 },
      Medium: { padding: "12px 24px", fontSize: 16 },
      Large: { padding: "16px 32px", fontSize: 18 },
      "Extra Large": { padding: "20px 40px", fontSize: 20 },
    };

    const size = sizeMap[buttonSize] || sizeMap.Medium;

    // Style mappings
    let background = buttonColor;
    let color = textColor;
    let border = "none";

    switch (buttonStyle) {
      case "Outline":
        background = "transparent";
        color = buttonColor;
        border = `${borderWidth}px solid ${buttonColor}`;
        break;
      case "Ghost":
        background = this.hexToRgba(buttonColor, 0.1);
        color = buttonColor;
        border = "none";
        break;
      case "Link":
        background = "transparent";
        color = buttonColor;
        border = "none";
        break;
    }

    // Width handling
    let width = "auto";
    let display = "inline-flex";
    let containerAlign = "flex-start";

    if (widthType === "Full Width") {
      width = "100%";
      display = "flex";
    } else if (widthType === "Custom") {
      width = `${customWidth}px`;
      display = "flex";
    }

    if (alignment === "Center") {
      containerAlign = "center";
    } else if (alignment === "Right") {
      containerAlign = "flex-end";
    }

    const styles: React.CSSProperties = {
      display,
      alignItems: "center",
      justifyContent: "center",
      width,
      padding: size.padding,
      fontSize: `${fontSize}px`,
      fontWeight,
      color,
      background,
      border,
      borderRadius: `${borderRadius}px`,
      cursor: "pointer",
      textDecoration: "none",
      transition: "all 0.3s ease",
      boxShadow:
        addShadow === "Yes"
          ? `0 2px 8px ${this.hexToRgba(buttonColor, 0.2)}`
          : "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      fontFamily: "system-ui, -apple-system, sans-serif",
    };

    const containerStyles: React.CSSProperties = {
      display: "flex",
      justifyContent: containerAlign,
      width: "100%",
    };

    // Create hover effect inline (for display purposes)
    const hoverStyles = `
      onmouseover="this.style.background='${
        buttonStyle === "Fill" ? hoverColor : this.hexToRgba(hoverColor, 0.1)
      }'; ${buttonStyle === "Outline" ? `this.style.borderColor='${hoverColor}'; this.style.color='${hoverColor}';` : ""} this.style.transform='translateY(-2px)'; this.style.boxShadow='${
        addShadow === "Yes"
          ? `0 4px 12px ${this.hexToRgba(buttonColor, 0.3)}`
          : "none"
      }';"
      onmouseout="this.style.background='${background}'; ${
        buttonStyle === "Outline"
          ? `this.style.borderColor='${buttonColor}'; this.style.color='${buttonColor}';`
          : ""
      } this.style.transform='translateY(0)'; this.style.boxShadow='${
        addShadow === "Yes"
          ? `0 2px 8px ${this.hexToRgba(buttonColor, 0.2)}`
          : "none"
      }';"
    `;

    const attributes: Record<string, string> = {
      href: linkUrl,
      target: linkTarget,
      ...(linkTarget === "_blank" && { rel: "noopener noreferrer" }),
    };

    // Generate wrapper div with button inside
    const buttonHtml = `<a${this.formatAttributes(attributes)} style="${this.formatStyles(styles)}" ${hoverStyles}>${buttonText}</a>`;

    this.code = `<div style="${this.formatStyles(containerStyles)}">${buttonHtml}</div>`;
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }
}
