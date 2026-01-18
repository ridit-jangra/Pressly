import { Component } from "../component";
import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";

export class WordPressVideo extends Component {
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
          label: "Video Source",
          default: "URL",
          options: ["URL", "YouTube", "Vimeo"],
          type: "select",
        },
        {
          label: "Video URL",
          default: "https://www.w3schools.com/html/mov_bbb.mp4",
          type: "text",
        },
        {
          label: "Autoplay",
          default: "No",
          options: ["Yes", "No"],
          type: "select",
        },
        {
          label: "Loop",
          default: "No",
          options: ["Yes", "No"],
          type: "select",
        },
        {
          label: "Muted",
          default: "No",
          options: ["Yes", "No"],
          type: "select",
        },
        {
          label: "Controls",
          default: "Yes",
          options: ["Yes", "No"],
          type: "select",
        },
      ] as TOption,
    },
    {
      parentId: "style",
      options: [
        {
          label: "Aspect Ratio",
          default: "16:9",
          options: ["16:9", "4:3", "1:1", "21:9"],
          type: "select",
        },
        {
          label: "Width Type",
          default: "Full Width",
          options: ["Full Width", "Custom"],
          type: "select",
        },
        {
          label: "Custom Width",
          default: 800,
          min: 200,
          max: 1920,
          type: "number",
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
          label: "Box Shadow",
          default: "Medium",
          options: ["None", "Small", "Medium", "Large"],
          type: "select",
        },
        {
          label: "Overlay Color",
          default: "#000000",
          type: "color",
        },
        {
          label: "Overlay Opacity",
          default: 0,
          min: 0,
          max: 100,
          type: "number",
        },
      ] as TOption,
    },
  ];

  constructor() {
    super();
    this.update();
  }

  public update() {
    const videoSource = this.state["content-Video Source"] || "URL";
    let videoUrl =
      this.state["content-Video URL"] ||
      "https://www.w3schools.com/html/mov_bbb.mp4";
    const autoplay = this.state["content-Autoplay"] || "No";
    const loop = this.state["content-Loop"] || "No";
    const muted = this.state["content-Muted"] || "No";
    const controls = this.state["content-Controls"] || "Yes";

    const aspectRatio = this.state["style-Aspect Ratio"] || "16:9";
    const widthType = this.state["style-Width Type"] || "Full Width";
    const customWidth = this.state["style-Custom Width"] || 800;
    const borderRadius = this.state["style-Border Radius"] || 8;
    const alignment = this.state["style-Alignment"] || "Center";

    const boxShadow = this.state["advanced-Box Shadow"] || "Medium";
    const overlayColor = this.state["advanced-Overlay Color"] || "#000000";
    const overlayOpacity = this.state["advanced-Overlay Opacity"] || 0;

    const aspectMap: Record<string, number> = {
      "16:9": 56.25,
      "4:3": 75,
      "1:1": 100,
      "21:9": 42.86,
    };

    const shadowMap: Record<string, string> = {
      None: "none",
      Small: "0 2px 4px rgba(0,0,0,0.1)",
      Medium: "0 4px 8px rgba(0,0,0,0.15)",
      Large: "0 8px 16px rgba(0,0,0,0.2)",
    };

    const alignMap: Record<string, string> = {
      Left: "flex-start",
      Center: "center",
      Right: "flex-end",
    };

    // Convert YouTube/Vimeo URLs to embed format
    if (videoSource === "YouTube" && videoUrl.includes("youtube.com")) {
      const videoId =
        videoUrl.split("v=")[1]?.split("&")[0] || videoUrl.split("/").pop();
      videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay === "Yes" ? 1 : 0}&loop=${loop === "Yes" ? 1 : 0}&mute=${muted === "Yes" ? 1 : 0}&controls=${controls === "Yes" ? 1 : 0}`;
    } else if (videoSource === "Vimeo" && videoUrl.includes("vimeo.com")) {
      const videoId = videoUrl.split("/").pop();
      videoUrl = `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay === "Yes" ? 1 : 0}&loop=${loop === "Yes" ? 1 : 0}&muted=${muted === "Yes" ? 1 : 0}`;
    }

    const containerStyles: React.CSSProperties = {
      width: widthType === "Full Width" ? "100%" : `${customWidth}px`,
      display: "flex",
      justifyContent: alignMap[alignment],
    };

    const wrapperStyles: React.CSSProperties = {
      position: "relative",
      width: "100%",
      paddingBottom: `${aspectMap[aspectRatio]}%`,
      borderRadius: `${borderRadius}px`,
      overflow: "hidden",
      boxShadow: shadowMap[boxShadow],
    };

    const videoStyles: React.CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      border: "none",
    };

    const overlayStyles: React.CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: this.hexToRgba(overlayColor, overlayOpacity / 100),
      pointerEvents: overlayOpacity > 0 ? "auto" : "none",
      zIndex: 1,
    };

    const videoElement =
      videoSource === "URL"
        ? `<video style="${this.formatStyles(videoStyles)}" ${autoplay === "Yes" ? "autoplay" : ""} ${loop === "Yes" ? "loop" : ""} ${muted === "Yes" ? "muted" : ""} ${controls === "Yes" ? "controls" : ""}><source src="${videoUrl}" type="video/mp4" />Your browser does not support the video tag.</video>`
        : `<iframe style="${this.formatStyles(videoStyles)}" src="${videoUrl}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;

    this.code = `<div style="${this.formatStyles(containerStyles)}"><div style="${this.formatStyles(wrapperStyles)}">${videoElement}${overlayOpacity > 0 ? `<div style="${this.formatStyles(overlayStyles)}"></div>` : ""}</div></div>`;
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }
}
