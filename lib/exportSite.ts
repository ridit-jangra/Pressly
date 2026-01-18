import JSZip from "jszip";
import { INavigation } from "./types";

const commonHeader = `<!DOCTYPE html>
<html lang="en">`;

const commonMeta = `
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />`;

const navigationHtml = (navigation: INavigation) =>
  `<nav><ul style="display: flex; gap: 4px;">${navigation.items.map((v, i) => `<li class="navigation-li" key="${i}"><a href="${v.url}.html">${v.title}</a></li>`).join("")}</ul></nav>`;

export function generateNavigationHtml(navigation: INavigation): string {
  return navigationHtml(navigation);
}

export function generatePageHtml(
  pageTitle: string,
  navigation: INavigation,
  pageBodyComponents: any[],
): string {
  return `${commonHeader}
    <head>
    ${commonMeta}
    <title>${pageTitle}</title>
    </head>
    <body>
    ${navigationHtml(navigation)}
    <main>
    ${pageBodyComponents.map((component: any) => `<div>${component?.componentData && component.componentData.code}</div>`).join("")}
    </main>
    </body>
    </html>`;
}

export function generatePageFileName(pageUrl: string): string {
  return `${pageUrl}.html`;
}

export function generateZipFileName(siteName: string): string {
  return `${siteName.replace(/\s+/g, "_").toLowerCase()}.zip`;
}

export function generateHomePageFileName(): string {
  return `index.html`;
}

export function generateHomePageHtml(
  pageTitle: string,
  navigation: INavigation,
): string {
  return `${commonHeader}
    <head>
    ${commonMeta}
    <title>${pageTitle}</title>
    </head>
    <body>
    ${navigationHtml(navigation)}
    <main>
    <h1>Welcome to the Home Page</h1>
    </main>
    </body>
    </html>`;
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
