import JSZip from "jszip";
import { IColors, INavigation } from "./types";

const commonHeader = `<!DOCTYPE html>
<html lang="en">`;

const commonMeta = `
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`;

const modernCommonStyles = (colors: IColors) => `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  :root {
    --color-primary: ${colors.primary};
    --color-primary-foreground: ${colors.primaryForeground};
    --color-secondary: ${colors.secondary};
    --color-secondary-foreground: ${colors.secondaryForeground};
    --color-background: ${colors.background};
    --color-foreground: ${colors.foreground};
    --color-accent: ${colors.accent};
    --color-accent-foreground: ${colors.accentForeground};
    --color-muted: ${colors.muted};
    --color-muted-foreground: ${colors.mutedForeground};
  }
  
  body {
    background-color: ${colors.background};
    color: ${colors.foreground};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Navigation Styles */
  .nav-container {
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    border-bottom: 1px solid ${colors.muted};
    background: ${colors.background};
    backdrop-filter: blur(8px);
  }
  
  .nav-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
  }
  
  .nav-menu {
    display: flex;
    align-items: center;
    gap: 8px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    height: 36px;
    padding: 0 16px;
    color: ${colors.foreground};
    text-decoration: none;
    transition: all 0.2s ease;
  }
  
  .nav-link:hover {
    background: ${colors.accent};
    color: ${colors.accentForeground};
  }
  
  .nav-link.active {
    background: ${colors.primary};
    color: ${colors.primaryForeground};
  }
  
  /* Main Content */
  main {
    width: 100%;
  }
  
  .layout-container {
    margin-bottom: 0;
  }
  
  .layout-grid {
    display: grid;
    width: 100%;
  }
  
  .layout-zone {
    min-height: 50px;
  }
  
  /* Card Grid Zones */
  .card-zone {
    background: var(--zone-bg, #ffffff);
    border: var(--zone-border, 1px solid #e2e8f0);
    border-radius: var(--zone-radius, 8px);
    padding: var(--zone-padding, 24px);
    box-shadow: var(--zone-shadow, 0 1px 2px rgba(0,0,0,0.05));
    transition: all 0.2s ease;
  }
  
  .card-zone.hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
  
  .card-zone.hover-shadow:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
  
  .card-zone.hover-border:hover {
    border-color: ${colors.primary};
  }
  
  /* Feature Grid Zones */
  .feature-zone {
    background: var(--feature-bg, #f8fafc);
    padding: var(--feature-padding, 24px);
    border-radius: var(--feature-radius, 8px);
    transition: all 0.2s ease;
  }
  
  @media (max-width: 768px) {
    .layout-grid {
      grid-template-columns: 1fr !important;
    }
    
    .nav-menu {
      gap: 4px;
    }
    
    main {
      padding: 0 16px;
    }
  }
</style>`;

const modernNavigationHtml = (navigation: INavigation, currentPage: string) =>
  `<nav class="nav-container">
    <div class="nav-wrapper">
      <ul class="nav-menu">
        ${navigation.items
          .map(
            (v) =>
              `<li><a href="${v.url.replace("/", "")}.html" class="nav-link ${currentPage === v.url ? "active" : ""}">${v.title}</a></li>`,
          )
          .join("")}
      </ul>
    </div>
  </nav>`;

function getLayoutStyles(layout: any): string {
  let styles = `
    gap: ${layout.layoutData?.gap || 16}px;
    padding: ${layout.layoutData?.padding || 20}px;
    background-color: ${layout.layoutData?.backgroundColor || "transparent"};
    border-radius: ${layout.layoutData?.borderRadius || 0}px;
    min-height: ${layout.layoutData?.minHeight || 100}px;
  `;

  // Card Grid Layout
  if (layout.id === "card-grid") {
    const columns = layout.state?.["layout-Columns"] || 3;
    const gap = layout.state?.["spacing-Gap"] || 24;

    styles += `
      display: grid;
      grid-template-columns: repeat(${columns}, 1fr);
      gap: ${gap}px;
      padding: ${layout.state?.["spacing-Container Padding"] || 0}px;
    `;
  }
  // Hero Section Layout
  else if (layout.id === "hero-section") {
    const layoutType = layout.state?.["layout-Layout Type"] || "centered";
    const minHeight = layout.state?.["spacing-Min Height"] || 500;
    const paddingTop = layout.state?.["spacing-Padding Top"] || 80;
    const paddingBottom = layout.state?.["spacing-Padding Bottom"] || 80;
    const gap = layout.state?.["spacing-Gap"] || 48;

    const contentWidthMap: Record<string, string> = {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      full: "100%",
    };
    const contentWidth =
      contentWidthMap[layout.state?.["layout-Content Width"] || "lg"];

    const borderBottom =
      layout.state?.["style-Border Bottom"] === "Yes"
        ? `border-bottom: 1px solid ${layout.state?.["style-Border Color"] || "#e2e8f0"};`
        : "";

    styles += `
      display: grid;
      grid-template-columns: ${layoutType === "centered" ? "1fr" : "1fr 1fr"};
      gap: ${gap}px;
      min-height: ${minHeight}px;
      max-width: ${contentWidth};
      margin: 0 auto;
      padding: ${paddingTop}px 24px ${paddingBottom}px;
      ${borderBottom}
    `;
  }
  // Section Layout
  else if (layout.id === "section-layout") {
    const maxWidthMap: Record<string, string> = {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      full: "100%",
    };
    const maxWidth = maxWidthMap[layout.state?.["layout-Max Width"] || "lg"];
    const paddingTop = layout.state?.["spacing-Padding Top"] || 64;
    const paddingBottom = layout.state?.["spacing-Padding Bottom"] || 64;
    const paddingX = layout.state?.["spacing-Padding X"] || 24;

    const borderTop =
      layout.state?.["style-Border Top"] === "Yes"
        ? `border-top: 1px solid ${layout.state?.["style-Border Color"] || "#e2e8f0"};`
        : "";
    const borderBottom =
      layout.state?.["style-Border Bottom"] === "Yes"
        ? `border-bottom: 1px solid ${layout.state?.["style-Border Color"] || "#e2e8f0"};`
        : "";

    styles += `
      display: grid;
      grid-template-columns: 1fr;
      max-width: ${maxWidth};
      margin: 0 auto;
      padding: ${paddingTop}px ${paddingX}px ${paddingBottom}px;
      ${borderTop}
      ${borderBottom}
    `;
  }
  // Feature Grid Layout
  else if (layout.id === "feature-grid") {
    const columns = layout.state?.["layout-Columns"] || 3;
    const gap = layout.state?.["layout-Gap"] || 32;

    styles += `
      display: grid;
      grid-template-columns: repeat(${columns}, 1fr);
      gap: ${gap}px;
    `;
  }
  // Columns Layout
  else if (layout.id === "wordpress-columns" || layout.id === "columns") {
    const columns = layout.state?.["layout-Number of Columns"] || 2;
    const columnLayout = layout.state?.["layout-Column Layout"] || "Equal";
    const gap = layout.state?.["layout-Gap"] || 20;
    const verticalAlign = layout.state?.["layout-Vertical Alignment"] || "Top";

    const layoutMap: Record<string, string> = {
      Equal: `repeat(${columns}, 1fr)`,
      "25-75": "1fr 3fr",
      "33-66": "1fr 2fr",
      "50-50": "1fr 1fr",
      "66-33": "2fr 1fr",
      "75-25": "3fr 1fr",
    };

    const alignMap: Record<string, string> = {
      Top: "flex-start",
      Center: "center",
      Bottom: "flex-end",
      Stretch: "stretch",
    };

    styles += `
      display: grid;
      grid-template-columns: ${layoutMap[columnLayout] || layoutMap.Equal};
      gap: ${gap}px;
      align-items: ${alignMap[verticalAlign] || "flex-start"};
    `;
  }
  // Container Layout
  else if (layout.id === "wordpress-container" || layout.id === "container") {
    const contentWidth = layout.state?.["layout-Content Width"] || "Full Width";
    const width = layout.state?.["layout-Width"] || 1140;
    const minHeight = layout.state?.["layout-Minimum Height"] || 400;
    const borderType = layout.state?.["style-Border Type"] || "None";
    const borderWidth = layout.state?.["style-Border Width"] || 1;
    const borderColor = layout.state?.["style-Border Color"] || "#e5e7eb";
    const paddingTop = layout.state?.["advanced-Padding Top"] || 40;
    const paddingRight = layout.state?.["advanced-Padding Right"] || 40;
    const paddingBottom = layout.state?.["advanced-Padding Bottom"] || 40;
    const paddingLeft = layout.state?.["advanced-Padding Left"] || 40;
    const boxShadow = layout.state?.["advanced-Box Shadow"] || "None";

    const shadowMap: Record<string, string> = {
      None: "none",
      Small: "0 1px 3px rgba(0,0,0,0.12)",
      Medium: "0 4px 6px rgba(0,0,0,0.1)",
      Large: "0 10px 15px rgba(0,0,0,0.15)",
    };

    styles += `
      display: grid;
      grid-template-columns: 1fr;
      max-width: ${contentWidth === "Boxed" ? `${width}px` : "100%"};
      width: 100%;
      margin: ${contentWidth === "Boxed" ? "0 auto" : "0"};
      min-height: ${minHeight}px;
      border: ${borderType !== "None" ? `${borderWidth}px ${borderType.toLowerCase()} ${borderColor}` : "none"};
      padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px;
      box-shadow: ${shadowMap[boxShadow]};
    `;
  }
  // Default grid layout
  else {
    const columns = layout.state?.columns || 1;
    const rows = layout.state?.rows || 1;
    styles += `
      display: grid;
      grid-template-columns: repeat(${columns}, 1fr);
      grid-template-rows: repeat(${rows}, minmax(${layout.layoutData?.minHeight || 100}px, auto));
    `;
  }

  return styles;
}

function generateComponentHtml(component: any): string {
  if (!component?.componentData?.code) return "";
  return component.componentData.code;
}

function generateLayoutHtml(layout: any): string {
  const layoutStyles = getLayoutStyles(layout);
  const components = layout.components || {};

  let zonesHtml = "";
  const zoneKeys = Object.keys(components).sort((a, b) => {
    const aNum = parseInt(a.split("-")[1]);
    const bNum = parseInt(b.split("-")[1]);
    return aNum - bNum;
  });

  // Determine zone class based on layout type
  let zoneClass = "layout-zone";
  let zoneHoverClass = "";

  if (layout.id === "card-grid") {
    zoneClass = "card-zone";
    const hoverEffect = layout.state?.["style-Hover Effect"] || "lift";
    zoneHoverClass = hoverEffect !== "none" ? `hover-${hoverEffect}` : "";
  } else if (layout.id === "feature-grid") {
    zoneClass = "feature-zone";
  }

  zoneKeys.forEach((zoneKey) => {
    const zoneComponents = components[zoneKey] || [];
    const zoneContent = zoneComponents
      .map((comp: any) => generateComponentHtml(comp))
      .join("\n");

    zonesHtml += `
      <div class="${zoneClass} ${zoneHoverClass}">
        ${zoneContent}
      </div>
    `;
  });

  return `
    <div class="layout-container">
      <div class="layout-grid" style="${layoutStyles}">
        ${zonesHtml}
      </div>
    </div>
  `;
}

export function generatePageHtml(
  pageTitle: string,
  navigation: INavigation,
  pageBodyComponents: any[],
  pageUrl: string = "",
  colors: IColors,
): string {
  const layoutsHtml = pageBodyComponents
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map((layout) => generateLayoutHtml(layout))
    .join("\n");

  return `${commonHeader}
  <head>
    ${commonMeta}
    <title>${pageTitle}</title>
    ${modernCommonStyles(colors)}
  </head>
  <body>
    ${modernNavigationHtml(navigation, pageUrl)}
    <main>
      ${layoutsHtml}
    </main>
  </body>
</html>`;
}

export function generatePageFileName(pageUrl: string): string {
  return `${pageUrl.replace(/^\//, "")}.html`;
}

export function generateZipFileName(siteName: string): string {
  return `${siteName.replace(/\s+/g, "_").toLowerCase()}.zip`;
}

export function generateHomePageFileName(): string {
  return `index.html`;
}

export async function generateZipFile(
  name: string,
  files: { name: string; content: string }[],
): Promise<Blob> {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name, file.content);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}
