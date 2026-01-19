import { Component } from "../component";
import { IComponentChildOption, IComponentOption, TOption } from "@/lib/types";

export class Heading extends Component {
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
          default: "Build amazing experiences",
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
          default: "#0f172a",
          type: "color",
        },
        {
          label: "Text Align",
          default: "Left",
          options: ["Left", "Center", "Right"],
          type: "select",
        },
        {
          label: "Gradient Effect",
          default: "No",
          options: ["No", "Yes"],
          type: "select",
        },
        {
          label: "Gradient Start",
          default: "#3b82f6",
          type: "color",
        },
        {
          label: "Gradient End",
          default: "#8b5cf6",
          type: "color",
        },
      ] as TOption,
    },
    {
      parentId: "typography",
      options: [
        {
          label: "Font Family",
          default: "Inter, system-ui, sans-serif",
          options: [
            "Inter, system-ui, sans-serif",
            "Georgia, serif",
            "Courier New, monospace",
            "Arial, sans-serif",
            "Roboto, sans-serif",
            "Poppins, sans-serif",
            "Montserrat, sans-serif",
            "Playfair Display, serif",
          ],
          type: "select",
        },
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
          min: 0.8,
          max: 2,
          type: "number",
        },
        {
          label: "Letter Spacing",
          default: -0.5,
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
          label: "Max Width",
          default: "None",
          options: ["None", "sm", "md", "lg", "xl", "2xl"],
          type: "select",
        },
        {
          label: "Margin Bottom",
          default: 16,
          min: 0,
          max: 100,
          type: "number",
        },
        {
          label: "Animation",
          default: "None",
          options: ["None", "Fade In", "Slide Up", "Scale In"],
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
    const headingText =
      this.state["content-Heading Text"] || "Build amazing experiences";
    const htmlTag = this.state["content-HTML Tag"] || "h2";
    const linkUrl = this.state["content-Link URL"] || "";

    const textColor = this.state["style-Text Color"] || "#0f172a";
    const textAlign = this.state["style-Text Align"] || "Left";
    const gradientEffect = this.state["style-Gradient Effect"] || "No";
    const gradientStart = this.state["style-Gradient Start"] || "#3b82f6";
    const gradientEnd = this.state["style-Gradient End"] || "#8b5cf6";

    const fontFamily =
      this.state["typography-Font Family"] || "Inter, system-ui, sans-serif";
    const fontSize = this.state["typography-Font Size"] || 36;
    const fontWeight = this.state["typography-Font Weight"] || "700";
    const lineHeight = this.state["typography-Line Height"] || 1.2;
    const letterSpacing = this.state["typography-Letter Spacing"] || -0.5;
    const textTransform = this.state["typography-Text Transform"] || "None";

    const maxWidth = this.state["advanced-Max Width"] || "None";
    const marginBottom = this.state["advanced-Margin Bottom"] || 16;
    const animation = this.state["advanced-Animation"] || "None";

    const transformMap: Record<string, string> = {
      None: "none",
      Uppercase: "uppercase",
      Lowercase: "lowercase",
      Capitalize: "capitalize",
    };

    const maxWidthMap: Record<string, string> = {
      None: "none",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    };

    const animationMap: Record<string, string> = {
      None: "",
      "Fade In": "fadeIn 0.6s ease-in",
      "Slide Up": "slideUp 0.6s ease-out",
      "Scale In": "scaleIn 0.5s ease-out",
    };

    let background = textColor;
    if (gradientEffect === "Yes") {
      background = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;
    }

    const styles: React.CSSProperties = {
      fontSize: `${fontSize}px`,
      fontWeight,
      fontFamily,
      lineHeight,
      letterSpacing: `${letterSpacing}px`,
      textAlign: textAlign.toLowerCase() as any,
      textTransform: transformMap[textTransform] as any,
      marginBottom: `${marginBottom}px`,
      margin: `0 0 ${marginBottom}px 0`,
      padding: 0,
      maxWidth: maxWidthMap[maxWidth],
      ...(maxWidth !== "None" &&
        textAlign === "Center" && { marginLeft: "auto", marginRight: "auto" }),
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

    const animationStyles =
      animation !== "None"
        ? `
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
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
      </style>
    `
        : "";

    const editableContent = `<span ondblclick="event.stopPropagation(); const newText = prompt('Edit heading:', this.textContent); if(newText !== null) this.textContent = newText;">${headingText}</span>`;

    const content = linkUrl
      ? `<a href="${linkUrl}" style="color: inherit; text-decoration: none;">${editableContent}</a>`
      : editableContent;

    this.code = `${animationStyles}<${htmlTag} style="${this.formatStyles(styles)}">${content}</${htmlTag}>`;
  }

  protected handleStateChange(parentId: string, label: string, value: any) {
    this.update();
  }
}
