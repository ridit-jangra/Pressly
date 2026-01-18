import JSZip from "jszip";
import { IColors, INavigation } from "./types";

const commonHeader = `<!DOCTYPE html>
<html lang="en">`;

const commonMeta = `
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />`;

const commonStyles = (colors: IColors) => `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    background-color: ${colors.background};
    color: ${colors.foreground};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
  }
  
  nav {
    padding: 1rem 2rem;
  }
  
  nav ul {
    display: flex;
    gap: 2rem;
    list-style: none;
    align-items: center;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  nav ul li a {
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: block;
  }

  nav ul li a:hover {
    text-decoration: underline;
  }
  
  nav ul li a:hover {
    background: ${colors.accent};
    transform: translateY(-2px);
  }
  
  nav ul li a.active {
    background: ${colors.primary};
  }
  
  main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  .layout-container {
    margin-bottom: 2rem;
  }
  
  .layout-grid {
    display: grid;
    width: 100%;
  }
  
  .layout-zone {
    min-height: 50px;
  }
  
  @media (max-width: 768px) {
    nav ul {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    nav {
      padding: 1rem;
    }
    
    .layout-grid {
      grid-template-columns: 1fr !important;
    }
  }
</style>`;

const navigationHtml = (navigation: INavigation, currentPage: string) =>
  `<nav>
    <ul>
      ${navigation.items
        .map(
          (v) =>
            `<li><a href="${v.url.replace("/", "")}.html" ${currentPage === v.url ? 'class="active"' : ""}>${v.title}</a></li>`,
        )
        .join("")}
    </ul>
  </nav>`;

export function generateNavigationHtml(
  navigation: INavigation,
  currentPage: string = "",
): string {
  return navigationHtml(navigation, currentPage);
}

function getLayoutStyles(layout: any): string {
  let styles = `
    gap: ${layout.layoutData?.gap || 16}px;
    padding: ${layout.layoutData?.padding || 20}px;
    background-color: ${layout.layoutData?.backgroundColor || "transparent"};
    border-radius: ${layout.layoutData?.borderRadius || 0}px;
    min-height: ${layout.layoutData?.minHeight || 100}px;
  `;

  //  Columns layout
  if (layout.id === "wordpress-columns") {
    const columns = layout.state?.["Layout-Columns"] || 2;
    const columnDistribution =
      layout.state?.["Layout-Column Distribution"] || "Equal";
    const alignItems = layout.state?.["Layout-Vertical Alignment"] || "Top";

    let columnTemplate = `repeat(${columns}, 1fr)`;
    if (columnDistribution === "25/75") columnTemplate = "1fr 3fr";
    else if (columnDistribution === "75/25") columnTemplate = "3fr 1fr";
    else if (columnDistribution === "33/66") columnTemplate = "1fr 2fr";
    else if (columnDistribution === "66/33") columnTemplate = "2fr 1fr";

    const alignMap: Record<string, string> = {
      Top: "flex-start",
      Center: "center",
      Bottom: "flex-end",
    };

    styles += `
      display: grid;
      grid-template-columns: ${columnTemplate};
      align-items: ${alignMap[alignItems] || "flex-start"};
    `;
  }
  //  Container layout
  else if (layout.id === "wordpress-container") {
    const contentWidth =
      layout.state?.["Container-Content Width"] || "Full Width";
    const customWidth = layout.state?.["Container-Custom Width"] || 1140;
    const borderType = layout.state?.["Container-Border Type"] || "None";
    const borderWidth = layout.state?.["Container-Border Width"] || 0;
    const borderColor = layout.state?.["Container-Border Color"] || "#e5e7eb";
    const paddingTop = layout.state?.["Container-Padding Top"] || 40;
    const paddingRight = layout.state?.["Container-Padding Right"] || 40;
    const paddingBottom = layout.state?.["Container-Padding Bottom"] || 40;
    const paddingLeft = layout.state?.["Container-Padding Left"] || 40;
    const boxShadow = layout.state?.["Container-Box Shadow"] || "None";

    const shadowMap: Record<string, string> = {
      None: "none",
      Small: "0 1px 3px rgba(0,0,0,0.12)",
      Medium: "0 4px 6px rgba(0,0,0,0.1)",
      Large: "0 10px 15px rgba(0,0,0,0.15)",
    };

    styles += `
      display: grid;
      grid-template-columns: 1fr;
      max-width: ${contentWidth === "Boxed" ? `${customWidth}px` : "100%"};
      width: 100%;
      margin: ${contentWidth === "Boxed" ? "0 auto" : "0"};
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

  // Get all zone keys and sort them
  const zoneKeys = Object.keys(components).sort((a, b) => {
    const aNum = parseInt(a.split("-")[1]);
    const bNum = parseInt(b.split("-")[1]);
    return aNum - bNum;
  });

  // Generate HTML for each zone
  zoneKeys.forEach((zoneKey) => {
    const zoneComponents = components[zoneKey] || [];
    const zoneContent = zoneComponents
      .map((comp: any) => generateComponentHtml(comp))
      .join("\n");

    zonesHtml += `
      <div class="layout-zone">
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
    ${commonStyles(colors)}
  </head>
  <body>
    ${navigationHtml(navigation, pageUrl)}
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
