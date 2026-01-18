import { Component } from "../component";
import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";

export class WordPressHeading extends Component {
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
      id: "typography",
      label: "Typography",
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
          label: "Heading Text",
          default: "Your Heading Here",
          type: "text",
        },
        {
          label: "HTML Tag",
          default: "h2",
          options: ["h1", "h2", "h3", "h4", "h5", "h6"],
          type: "select",
        },
        {
          label: "Link URL",
          default: "",
          type: "text",
        },
      ] as TOption,
    },
    {
      parentId: "style",
      options: [
        {
          label: "Text Color",
          default: "#1f2937",
          type: "color",
        },
        {
          label: "Text Align",
          default: "Left",
          options: ["Left", "Center", "Right", "Justify"],
          type: "select",
        },
        {
          label: "Gradient Effect",
          default: "No",
          options: ["No", "Yes"],
          type: "select",
        },
        {
          label: "Gradient Color",
          default: "#3b82f6",
          type: "color",
        },
      ] as TOption,
    },
    {
      parentId: "typography",
      options: [
        {
          label: "Font Size",
          default: 36,
          min: 12,
          max: 120,
          type: "number",
        },
        {
          label: "Font Weight",
          default: "700",
          options: ["300", "400", "500", "600", "700", "800", "900"],
          type: "select",
        },
        {
          label: "Line Height",
          default: 1.2,
          min: 0.5,
          max: 3,
          type: "number",
        },
        {
          label: "Letter Spacing",
          default: 0,
          min: -5,
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
      parentId: "advanced",
      options: [
        {
          label: "Text Shadow",
          default: "No",
          options: ["No", "Subtle", "Medium", "Strong"],
          type: "select",
        },
        {
          label: "Shadow Color",
          default: "#000000",
          type: "color",
        },
        {
          label: "Animation",
          default: "None",
          options: ["None", "Fade In", "Slide Up", "Zoom In"],
          type: "select",
        },
        {
          label: "Margin Bottom",
          default: 16,
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
    const headingText =
      this.state["content-Heading Text"] || "Your Heading Here";
    const htmlTag = this.state["content-HTML Tag"] || "h2";
    const linkUrl = this.state["content-Link URL"] || "";
    const textColor = this.state["style-Text Color"] || "#1f2937";
    const textAlign = this.state["style-Text Align"] || "Left";
    const gradientEffect = this.state["style-Gradient Effect"] || "No";
    const gradientColor = this.state["style-Gradient Color"] || "#3b82f6";
    const fontSize = this.state["typography-Font Size"] || 36;
    const fontWeight = this.state["typography-Font Weight"] || "700";
    const lineHeight = this.state["typography-Line Height"] || 1.2;
    const letterSpacing = this.state["typography-Letter Spacing"] || 0;
    const textTransform = this.state["typography-Text Transform"] || "None";
    const textShadow = this.state["advanced-Text Shadow"] || "No";
    const shadowColor = this.state["advanced-Shadow Color"] || "#000000";
    const animation = this.state["advanced-Animation"] || "None";
    const marginBottom = this.state["advanced-Margin Bottom"] || 16;

    const transformMap: Record<string, string> = {
      None: "none",
      Uppercase: "uppercase",
      Lowercase: "lowercase",
      Capitalize: "capitalize",
    };

    const shadowMap: Record<string, string> = {
      No: "none",
      Subtle: `2px 2px 4px ${this.hexToRgba(shadowColor, 0.2)}`,
      Medium: `3px 3px 8px ${this.hexToRgba(shadowColor, 0.3)}`,
      Strong: `4px 4px 12px ${this.hexToRgba(shadowColor, 0.4)}`,
    };

    const animationMap: Record<string, string> = {
      None: "",
      "Fade In": "fadeIn 0.6s ease-in",
      "Slide Up": "slideUp 0.6s ease-out",
      "Zoom In": "zoomIn 0.5s ease-out",
    };

    let background = textColor;
    if (gradientEffect === "Yes") {
      background = `linear-gradient(135deg, ${textColor}, ${gradientColor})`;
    }

    const styles: React.CSSProperties = {
      fontSize: `${fontSize}px`,
      fontWeight,
      lineHeight,
      letterSpacing: `${letterSpacing}px`,
      textAlign: textAlign.toLowerCase() as any,
      textTransform: transformMap[textTransform] as any,
      textShadow: shadowMap[textShadow],
      marginBottom: `${marginBottom}px`,
      margin: `0 0 ${marginBottom}px 0`,
      padding: 0,
      fontFamily: "system-ui, -apple-system, sans-serif",
      ...(gradientEffect === "Yes"
        ? {
            background,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }
        : {
            color: textColor,
          }),
      ...(animation !== "None" && {
        animation: animationMap[animation],
      }),
    };

    const animationStyles = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes zoomIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
      </style>
    `;

    const content = linkUrl
      ? `<a href="${linkUrl}" style="color: inherit; text-decoration: none;">${headingText}</a>`
      : headingText;

    this.code = `${animation !== "None" ? animationStyles : ""}<${htmlTag} style="${this.formatStyles(styles)}">${content}</${htmlTag}>`;
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }
}
