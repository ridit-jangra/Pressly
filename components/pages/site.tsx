"use client";

import { useRouter } from "next/navigation";
import { Button } from "../shadcn/button";
import { useEffect, useState } from "react";
import { IColors, ICustomColor, INavigation, IPage, ISite } from "@/lib/types";
import { AuthService } from "@/lib/authService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";
import { Progress } from "../shadcn/progress";
import {
  ArrowLeftRight,
  Book,
  CheckCheck,
  Palette,
  X,
  Globe,
  Calendar,
  FileText,
  Layout,
} from "lucide-react";
import { Storage } from "@/lib/storage";
import { toast } from "sonner";
import { ScrollArea } from "../shadcn/scroll-area";
import {
  generateHomePageFileName,
  generatePageHtml,
  generateZipFile,
  generateZipFileName,
} from "@/lib/exportSite";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../shadcn/card";

export function Site() {
  const [siteData, setSiteData] = useState<ISite>();
  const [pages, setPages] = useState<IPage[]>();
  const [navigation, setNavigation] = useState<INavigation>();
  const [colors, setColors] = useState<IColors | null>(null);
  const [customColors, setCustomColors] = useState<ICustomColor[]>([]);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false);
  const [exportSiteStep, setExportSiteStep] = useState<number>(1);
  const [stepsActive, setStepsActive] = useState<boolean>(false);
  const [exportStart, setExportStart] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportCurrentLog, setExportCurrentLog] = useState<string | null>(null);
  const [zipFile, setZipFile] = useState<Blob | null>(null);
  const router = useRouter();

  const fetchNavigation = async () => {
    const v = (await Storage.getItem(
      "navigation",
      "navigation",
    )) as INavigation;

    if (v) {
      setNavigation(v);
    } else {
      setNavigation({ items: [], name: "Init Menu" });
    }
  };

  useEffect(() => {
    const getSite = async () => {
      const v = await AuthService.getSiteData();
      if (!v) return;

      setSiteData(v);
    };

    getSite();
  }, []);

  const fetchPages = async () => {
    const v = (await Storage.getItem("pages", "pages")) as IPage[] | null;
    if (v && Array.isArray(v)) {
      setPages(v);
    } else {
      setPages([]);
    }
  };

  const fetchColors = async () => {
    const v = (await Storage.getItem("colors", "colors")) as IColors | null;
    const customColorsData = (await Storage.getItem(
      "custom-colors",
      "custom-colors",
    )) as ICustomColor[] | null;

    if (v) {
      setColors(v);
    } else {
      const defaultColors: IColors = {
        background: "#ffffff",
        foreground: "#000000",
        accent: "#3b82f6",
        accentForeground: "#ffffff",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        primary: "#0f172a",
        primaryForeground: "#ffffff",
        secondary: "#f1f5f9",
        secondaryForeground: "#0f172a",
      };
      setColors(defaultColors);
    }

    if (customColorsData && Array.isArray(customColorsData)) {
      setCustomColors(customColorsData);
    }
  };

  useEffect(() => {
    fetchColors();
    fetchPages();
    fetchNavigation();
  }, []);

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  const handleExport = async () => {
    if (!navigation) {
      toast("Add navigation to export.");
      return;
    }

    if (!colors) {
      toast("Add colors to export.");
      return;
    }

    if (!pages) {
      toast("Add page to export.");
      return;
    }

    if (!siteData) {
      toast("Complete setup to export.");
      return;
    }

    const homePage = pages.find((v) => v.title.toLowerCase() === "home");

    if (!homePage) {
      toast("Create a home page to export.");
      return;
    }

    setExportStart(true);

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    try {
      setExportCurrentLog("Starting...");
      setExportProgress(4);
      await delay(700);

      const pagesFiles: { name: string; content: string }[] = [];

      setExportCurrentLog("Generating code...");
      setExportProgress(10);
      await delay(700);

      pages.map((v) => {
        const page: { name: string; content: string } = {
          name: `${v.url.replace("/", "")}.html`,
          content: generatePageHtml(
            v.title,
            navigation,
            v.body.components,
            `${v.url.replace("/", "")}.html`,
            colors,
          ),
        };

        pagesFiles.push(page);
      });

      setExportProgress(30);
      await delay(700);

      setExportCurrentLog("Generating zip name...");
      setExportProgress(35);
      await delay(700);

      const zipName = generateZipFileName(siteData.name);
      setExportProgress(45);
      await delay(700);

      setExportCurrentLog("Generating home page name...");
      setExportProgress(55);
      await delay(700);

      const homePageName = generateHomePageFileName();
      setExportProgress(63);
      await delay(700);

      setExportCurrentLog("Generating home page code...");
      await delay(700);

      const homePageHtml = generatePageHtml(
        homePage.title,
        navigation,
        homePage.body.components,
        homePageName,
        colors,
      );
      setExportProgress(80);
      await delay(700);

      setExportCurrentLog("Adding home page to index...");
      const homePageFile: { name: string; content: string } = {
        name: homePageName,
        content: homePageHtml,
      };

      pagesFiles.push(homePageFile);
      setExportProgress(90);
      await delay(700);

      setExportCurrentLog("Generating zip file...");
      await delay(700);
      const zipFile = await generateZipFile(zipName, pagesFiles);
      setExportProgress(100);
      await delay(700);

      setZipFile(zipFile);

      setExportCurrentLog("Export complete!");
      await delay(700);

      setExportSiteStep(5);
      setExportStart(false);
    } catch (err) {
      setExportProgress(0);
      setExportCurrentLog(`Error occurred: ${err}`);
    }
  };

  const handleDownload = () => {
    if (!zipFile || !siteData) return;

    const url = URL.createObjectURL(zipFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = generateZipFileName(siteData.name);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExportDialogOpen(false);
    setExportSiteStep(1);
    setStepsActive(false);
    setExportProgress(0);
    setExportCurrentLog(null);
    setZipFile(null);

    toast.success("Site downloaded successfully!");
  };

  const getTotalComponents = () => {
    if (!pages) return 0;
    return pages.reduce((total, page) => {
      return total + (page.body.components?.length || 0);
    }, 0);
  };

  const getRecentlyUpdatedPage = () => {
    if (!pages || pages.length === 0) return null;
    return pages.reduce((latest, page) => {
      return new Date(page.updatedAt) > new Date(latest.updatedAt)
        ? page
        : latest;
    });
  };

  return (
    siteData && (
      <div className="w-full h-full flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold font-mono">{siteData.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="text-sm">{siteData.url}</span>
            </div>
            {getRecentlyUpdatedPage() && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Last updated:{" "}
                  {new Date(
                    getRecentlyUpdatedPage()!.updatedAt,
                  ).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => handleNavigate("/dashboard?page=pages/all-pages")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Book className="w-4 h-4" />
                Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pages?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {getTotalComponents()} total components
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => handleNavigate("/dashboard?page=navigation/manage")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4" />
                Navigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {navigation?.items.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {navigation?.name || "No menu"}
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => handleNavigate("/dashboard?page=colors/manage")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Colors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customColors.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Custom colors + 10 standard
              </p>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Ready to Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {pages?.length && navigation?.items.length ? (
                  <>
                    <CheckCheck className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Ready
                    </span>
                  </>
                ) : (
                  <>
                    <X className="w-6 h-6 text-orange-600" />
                    <span className="text-sm font-medium text-orange-600">
                      Not Ready
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {!pages?.length
                  ? "Add pages"
                  : !navigation?.items.length
                    ? "Add navigation"
                    : "All set!"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Pages
              </CardTitle>
              <CardDescription>Your recently updated pages</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {pages && pages.length > 0 ? (
                  <div className="space-y-2">
                    {pages
                      .sort(
                        (a, b) =>
                          new Date(b.updatedAt).getTime() -
                          new Date(a.updatedAt).getTime(),
                      )
                      .slice(0, 5)
                      .map((page) => (
                        <div
                          key={page.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                          onClick={() =>
                            handleNavigate(`/edit-page?id=${page.id}`)
                          }
                        >
                          <div className="flex flex-col">
                            <span className="font-medium font-mono">
                              {page.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {page.url}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground">
                              {new Date(page.updatedAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {page.body.components?.length || 0} components
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No pages created yet
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Your Site</CardTitle>
              <CardDescription>
                Download your site as a zip file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div
                  className="flex items-center justify-between bg-muted w-full p-3 rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() =>
                    handleNavigate("/dashboard?page=pages/all-pages")
                  }
                >
                  <span className="flex gap-2 items-center font-medium">
                    <Book className="w-4 h-4" />
                    Pages
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {pages?.length || 0}
                    </span>
                    {pages?.length ? (
                      <CheckCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div
                  className="flex items-center justify-between bg-muted w-full p-3 rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() =>
                    handleNavigate("/dashboard?page=navigation/manage")
                  }
                >
                  <span className="flex gap-2 items-center font-medium">
                    <ArrowLeftRight className="w-4 h-4" />
                    Navigation
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {navigation?.items.length || 0} items
                    </span>
                    {navigation?.items.length ? (
                      <CheckCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div
                  className="flex items-center justify-between bg-muted w-full p-3 rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() =>
                    handleNavigate("/dashboard?page=colors/manage")
                  }
                >
                  <span className="flex gap-2 items-center font-medium">
                    <Palette className="w-4 h-4" />
                    Colors
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {10 + customColors.length} colors
                    </span>
                    {colors ? (
                      <CheckCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              <Dialog
                open={isExportDialogOpen}
                onOpenChange={setIsExportDialogOpen}
              >
                <DialogTrigger className={"w-full"}>
                  <Button className="w-full" size="lg">
                    Export Site
                  </Button>
                </DialogTrigger>
                <DialogContent
                  dismissible={false}
                  showCloseButton={false}
                  className={`${stepsActive && "min-w-180 min-h-120"}`}
                >
                  <DialogHeader>
                    <DialogTitle className="text-lg">Export site</DialogTitle>
                    <DialogDescription className="text-md">
                      Export your site as a zip file containing all pages and
                      assets. This may take a few moments.
                    </DialogDescription>
                  </DialogHeader>
                  {stepsActive && (
                    <>
                      <div className="w-full h-full items-center justify-center min-h-70 max-h-70">
                        {exportSiteStep === 1 && (
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-lg">Review pages</p>
                            <ScrollArea className="h-60 w-full">
                              <div className="flex flex-col gap-2 w-full">
                                {pages &&
                                  pages.map((v, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between w-full bg-muted py-2 px-3 rounded-lg text-sm"
                                    >
                                      <div className="flex flex-col">
                                        <span className="font-mono">
                                          {v.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {v.body.components?.length || 0}{" "}
                                          components
                                        </span>
                                      </div>
                                      <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                                        {v.url}
                                      </code>
                                    </div>
                                  ))}
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                        {exportSiteStep === 2 && (
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-lg">Review navigation</p>
                            <ScrollArea className="w-full h-60">
                              {navigation && (
                                <div className="flex flex-col gap-2 w-full">
                                  <div className="w-full text-center text-lg font-mono border rounded-full">
                                    {navigation.name}
                                  </div>
                                  {navigation.items.map((v, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between w-full bg-muted py-2 px-3 rounded-lg text-sm"
                                    >
                                      <span className="font-mono">
                                        {v.title}
                                      </span>
                                      <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                                        {v.url}
                                      </code>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </ScrollArea>
                          </div>
                        )}
                        {exportSiteStep === 3 && (
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-lg">Review colors</p>
                            <ScrollArea className="h-60 w-full">
                              <div className="flex flex-col gap-4 p-2">
                                {colors && (
                                  <div className="space-y-2">
                                    <p className="font-semibold text-sm text-muted-foreground mb-2">
                                      Standard Colors (10)
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {Object.entries(colors).map(
                                        ([key, value]) => (
                                          <div
                                            key={key}
                                            className="flex items-center gap-2 bg-muted p-2 rounded-lg"
                                          >
                                            <div
                                              className="w-8 h-8 rounded border-2 border-border shadow-sm shrink-0"
                                              style={{ backgroundColor: value }}
                                            />
                                            <div className="flex flex-col min-w-0">
                                              <span className="text-sm font-medium capitalize">
                                                {key
                                                  .replace(/([A-Z])/g, " $1")
                                                  .trim()}
                                              </span>
                                              <code className="text-xs font-mono text-muted-foreground truncate">
                                                {value}
                                              </code>
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                                {customColors && customColors.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="font-semibold text-sm text-muted-foreground mb-2">
                                      Custom Colors ({customColors.length})
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {customColors.map((customColor, i) => (
                                        <div
                                          key={i}
                                          className="flex items-center gap-2 bg-muted p-2 rounded-lg"
                                        >
                                          <div
                                            className="w-8 h-8 rounded border-2 border-border shadow-sm shrink-0"
                                            style={{
                                              backgroundColor:
                                                customColor.value,
                                            }}
                                          />
                                          <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium truncate">
                                              {customColor.name}
                                            </span>
                                            <code className="text-xs font-mono text-muted-foreground truncate">
                                              {customColor.value}
                                            </code>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                        {exportSiteStep === 4 && (
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-lg">Export Progress</p>
                            <ScrollArea className="h-60 w-full">
                              {exportStart ? (
                                <div className="space-y-4">
                                  <p className="font-mono bg-muted text-foreground rounded-md px-3 py-2 text-sm">
                                    {exportCurrentLog}
                                  </p>
                                  <Progress
                                    value={exportProgress}
                                    className="w-full"
                                  />
                                  <p className="text-xs text-center text-muted-foreground">
                                    {exportProgress}% complete
                                  </p>
                                </div>
                              ) : (
                                <p className="font-mono text-lg w-full text-center">
                                  Click export to start.
                                </p>
                              )}
                            </ScrollArea>
                          </div>
                        )}
                        {exportSiteStep === 5 && (
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-lg font-semibold">
                              Export complete!
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Export is completed without errors, click download
                              zip.
                            </p>
                            <ScrollArea className="h-60 w-full flex items-center justify-center">
                              <Button
                                className="w-full"
                                onClick={handleDownload}
                                size="lg"
                              >
                                Download zip
                              </Button>
                            </ScrollArea>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2.5">
                        <Button
                          variant="outline"
                          onClick={() => setExportSiteStep((prev) => prev - 1)}
                          disabled={exportSiteStep === 1 || exportStart}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          Step {exportSiteStep} of 5
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (exportSiteStep === 4) {
                              handleExport();
                              return;
                            }
                            setExportSiteStep((prev) => prev + 1);
                          }}
                          disabled={exportStart || exportSiteStep === 5}
                        >
                          {exportSiteStep === 4 ? "Export" : "Next"}
                        </Button>
                      </div>
                    </>
                  )}
                  {!stepsActive && (
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsExportDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => setStepsActive(true)}>
                        Start Export
                      </Button>
                    </DialogFooter>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  );
}
