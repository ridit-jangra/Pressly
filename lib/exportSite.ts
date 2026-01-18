import { IExportSiteOptions } from "./types";

export function handleExportSite({ navigation, pages }: IExportSiteOptions) {
  console.log("pages: ", pages);
  const commonHeader = `<DOCKTYPE html>
<html lang="en">`;

  const commonMeta = `
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />`;

  const navigationHtml = `<nav><ul style="display: flex; gap: 4px;">${navigation.items.map((v, i) => `<li class="navigation-li" key="${i}">${v.title}</li>`)}</ul></nav>`;

  const pagesFiles: string[] = [];

  const pagesContent: Record<string, string> = {};

  pages.map((page) => {
    pagesFiles.push(`${page.url}.html`);
  });

  pages.map((page) => {
    pagesContent[page.title] = `${commonHeader}
    <head>
    ${commonMeta}
    <title>${page.title}</title>
    </head>
    <body>
    ${navigationHtml}
    <main>
    ${page.body.components.map((component: any) => `<div>${component?.componentData && component.componentData.code}</div>`)}
    </main>
    </body>
    </html>`;
  });

  console.log("Exported Pages:", pagesContent);
  console.log("Files:", pagesFiles);
}
