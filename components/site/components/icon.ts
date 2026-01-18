import { Component } from "../component";
import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";

export class WordPressIcon extends Component {
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
          label: "Icon Type",
          default: "Star",
          options: [
            "Star",
            "Heart",
            "Check",
            "X",
            "Arrow Right",
            "Arrow Left",
            "Arrow Up",
            "Arrow Down",
            "Plus",
            "Minus",
            "Search",
            "Menu",
            "User",
            "Settings",
            "Mail",
            "Phone",
            "Location",
            "Calendar",
            "Clock",
            "Download",
          ],
          type: "select",
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
          label: "Size",
          default: 48,
          min: 16,
          max: 200,
          type: "number",
        },
        {
          label: "Color",
          default: "#3b82f6",
          type: "color",
        },
        {
          label: "Background Shape",
          default: "None",
          options: ["None", "Circle", "Square", "Rounded Square"],
          type: "select",
        },
        {
          label: "Background Color",
          default: "#eff6ff",
          type: "color",
        },
        {
          label: "Background Size",
          default: 80,
          min: 50,
          max: 250,
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
          label: "Hover Effect",
          default: "Scale",
          options: ["None", "Scale", "Rotate", "Pulse", "Bounce"],
          type: "select",
        },
        {
          label: "Hover Color",
          default: "#2563eb",
          type: "color",
        },
        {
          label: "Box Shadow",
          default: "No",
          options: ["No", "Small", "Medium", "Large"],
          type: "select",
        },
        {
          label: "Border Width",
          default: 0,
          min: 0,
          max: 10,
          type: "number",
        },
        {
          label: "Border Color",
          default: "#3b82f6",
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
    const iconType = this.state["content-Icon Type"] || "Star";
    const linkUrl = this.state["content-Link URL"] || "";
    const linkTarget = this.state["content-Link Target"] || "_self";

    const size = this.state["style-Size"] || 48;
    const color = this.state["style-Color"] || "#3b82f6";
    const backgroundShape = this.state["style-Background Shape"] || "None";
    const backgroundColor = this.state["style-Background Color"] || "#eff6ff";
    const backgroundSize = this.state["style-Background Size"] || 80;
    const alignment = this.state["style-Alignment"] || "Center";

    const hoverEffect = this.state["advanced-Hover Effect"] || "Scale";
    const hoverColor = this.state["advanced-Hover Color"] || "#2563eb";
    const boxShadow = this.state["advanced-Box Shadow"] || "No";
    const borderWidth = this.state["advanced-Border Width"] || 0;
    const borderColor = this.state["advanced-Border Color"] || "#3b82f6";

    // Icon SVG paths (simplified versions)
    const iconMap: Record<string, string> = {
      Star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      Heart:
        "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
      Check: "M20 6L9 17l-5-5",
      X: "M18 6L6 18M6 6l12 12",
      "Arrow Right": "M5 12h14M12 5l7 7-7 7",
      "Arrow Left": "M19 12H5M12 19l-7-7 7-7",
      "Arrow Up": "M12 19V5M5 12l7-7 7 7",
      "Arrow Down": "M12 5v14M19 12l-7 7-7-7",
      Plus: "M12 5v14M5 12h14",
      Minus: "M5 12h14",
      Search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
      Menu: "M3 12h18M3 6h18M3 18h18",
      User: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
      Settings:
        "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z",
      Mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
      Phone:
        "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      Location:
        "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      Calendar:
        "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18",
      Clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
      Download:
        "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    };

    const iconPath = iconMap[iconType] || iconMap.Star;

    const shadowMap: Record<string, string> = {
      No: "none",
      Small: "0 2px 4px rgba(0,0,0,0.1)",
      Medium: "0 4px 8px rgba(0,0,0,0.15)",
      Large: "0 8px 16px rgba(0,0,0,0.2)",
    };

    const alignMap: Record<string, string> = {
      Left: "flex-start",
      Center: "center",
      Right: "flex-end",
    };

    const hoverEffectMap: Record<string, string> = {
      None: "",
      Scale: "transform: scale(1.1);",
      Rotate: "transform: rotate(15deg);",
      Pulse: "animation: pulse 1s infinite;",
      Bounce: "transform: translateY(-5px);",
    };

    let borderRadiusValue = "0";
    if (backgroundShape === "Circle") {
      borderRadiusValue = "50%";
    } else if (backgroundShape === "Rounded Square") {
      borderRadiusValue = "12px";
    }

    const containerStyles: React.CSSProperties = {
      display: "flex",
      justifyContent: alignMap[alignment],
      width: "100%",
    };

    const wrapperStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      ...(backgroundShape !== "None" && {
        width: `${backgroundSize}px`,
        height: `${backgroundSize}px`,
        backgroundColor,
        borderRadius: borderRadiusValue,
      }),
      ...(borderWidth > 0 && {
        border: `${borderWidth}px solid ${borderColor}`,
      }),
      boxShadow: shadowMap[boxShadow],
      transition: "all 0.3s ease",
      cursor: linkUrl ? "pointer" : "default",
    };

    const hoverAttr =
      hoverEffect !== "None"
        ? `onmouseover="this.style.cssText+='${hoverEffectMap[hoverEffect]}'; this.querySelector('svg').style.fill='${hoverColor}';" onmouseout="this.style.cssText=this.style.cssText.replace('${hoverEffectMap[hoverEffect]}', ''); this.querySelector('svg').style.fill='${color}';"`
        : "";

    const iconSvg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: all 0.3s ease;"><path d="${iconPath}"></path></svg>`;

    const iconElement = `<div style="${this.formatStyles(wrapperStyles)}" ${hoverAttr}>${iconSvg}</div>`;

    const content = linkUrl
      ? `<a href="${linkUrl}" target="${linkTarget}" ${linkTarget === "_blank" ? 'rel="noopener noreferrer"' : ""} style="text-decoration: none; display: inline-flex;">${iconElement}</a>`
      : iconElement;

    const pulseAnimation =
      hoverEffect === "Pulse"
        ? `<style>@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }</style>`
        : "";

    this.code = `${pulseAnimation}<div style="${this.formatStyles(containerStyles)}">${content}</div>`;
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }
}
