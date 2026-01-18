"use client";

import { useRouter } from "next/navigation";
import { Button } from "../shadcn/button";
import { use, useEffect, useState } from "react";
import { INavigation, IPage, ISite } from "@/lib/types";
import { AuthService } from "@/lib/authService";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";
import { Progress } from "../shadcn/progress";
import {
  ArrowLeftRightIcon,
  BookIcon,
  CheckCheckIcon,
  PaletteIcon,
  XIcon,
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

export function Site() {
  const [siteData, setSiteData] = useState<ISite>();
  const [pages, setPages] = useState<IPage[]>();
  const [navigation, setNavigation] = useState<INavigation>();
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

  useEffect(() => {
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
      await delay(300);

      const pagesFiles: { name: string; content: string }[] = [];

      setExportCurrentLog("Generating code...");
      setExportProgress(10);
      await delay(500);

      pages.map((v) => {
        const page: { name: string; content: string } = {
          name: `${v.url.replace("/", "")}.html`,
          content: generatePageHtml(v.title, navigation, v.body.components),
        };

        pagesFiles.push(page);
      });

      setExportProgress(30);
      await delay(400);

      setExportCurrentLog("Generating zip name...");
      setExportProgress(35);
      await delay(300);

      const zipName = generateZipFileName(siteData.name);
      setExportProgress(45);
      await delay(300);

      setExportCurrentLog("Generating home page name...");
      setExportProgress(55);
      await delay(300);

      const homePageName = generateHomePageFileName();
      setExportProgress(63);
      await delay(300);

      setExportCurrentLog("Generating home page code...");
      await delay(400);

      const homePageHtml = generatePageHtml(
        homePage.title,
        navigation,
        homePage.body.components,
      );
      setExportProgress(80);
      await delay(400);

      setExportCurrentLog("Adding home page to index...");
      const homePageFile: { name: string; content: string } = {
        name: homePageName,
        content: homePageHtml,
      };

      pagesFiles.push(homePageFile);
      setExportProgress(90);
      await delay(400);

      setExportCurrentLog("Generating zip file...");
      await delay(300);
      const zipFile = await generateZipFile(zipName, pagesFiles);
      setExportProgress(100);
      await delay(500);

      setZipFile(zipFile);

      setExportCurrentLog("Export complete!");
      await delay(500);

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

  return (
    siteData && (
      <div className="w-full h-full flex flex-col gap-6">
        <div className="flex flex-col">
          <p className="text-3xl font-medium font-mono">Site</p>
          <p className="text-lg">{siteData.name}</p>
        </div>

        <div className="grid grid-cols-2 h-full w-full gap-3">
          <div className="flex flex-col gap-3 border-2 p-4 h-[50%] rounded-lg justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between w-full">
                <p className="text-lg font-bold font-mono">Export Site</p>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="flex items-center justify-between bg-muted w-full p-2 rounded-xl cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() =>
                    handleNavigate("/dashboard?page=pages/all-pages")
                  }
                >
                  <span className="flex gap-2 items-center font-mono">
                    <BookIcon />
                    Pages
                  </span>
                  <span className="font-mono">{pages?.length}</span>
                </div>
                <div
                  className="flex items-center justify-between bg-muted w-full p-2 rounded-xl cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() =>
                    handleNavigate("/dashboard?page=navigation/manage")
                  }
                >
                  <span className="flex gap-2 items-center font-mono">
                    <ArrowLeftRightIcon />
                    Navigation
                  </span>
                  <span>
                    {navigation?.items.length! > 0 ? (
                      <CheckCheckIcon />
                    ) : (
                      <XIcon />
                    )}{" "}
                  </span>
                </div>
                <div
                  className="flex items-center justify-between bg-muted w-full p-2 rounded-xl cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() =>
                    handleNavigate("/dashboard?page=navigation/manage")
                  }
                >
                  <span className="flex gap-2 items-center font-mono">
                    <PaletteIcon />
                    Colors
                  </span>
                  <span>
                    {navigation?.items.length! > 0 ? (
                      <CheckCheckIcon />
                    ) : (
                      <XIcon />
                    )}{" "}
                  </span>
                </div>
              </div>
            </div>
            <Dialog
              open={isExportDialogOpen}
              onOpenChange={setIsExportDialogOpen}
            >
              <DialogTrigger>
                <Button className={"w-full"}>Export</Button>
              </DialogTrigger>
              <DialogContent
                dismissible={false}
                showCloseButton={false}
                className={`${stepsActive && "min-w-180 min-h-120"}`}
              >
                <DialogHeader>
                  <DialogTitle className={"text-lg"}>Export site</DialogTitle>
                  <DialogDescription className={"text-md"}>
                    Export your site as a zip file containing all pages and
                    assets. This may take a few moments.
                  </DialogDescription>
                </DialogHeader>
                {stepsActive && (
                  <>
                    <div className="w-full h-full items-center justify-center">
                      {exportSiteStep === 1 && (
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-lg">Review pages</p>
                          <ScrollArea className={"h-full w-full"}>
                            <div className="flex flex-col gap-2 w-full">
                              {pages &&
                                pages.map((v, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between w-full bg-muted py-1 px-3 rounded-lg text-[15px]"
                                  >
                                    {v.title}
                                    <p className="font-mono">{v.url}</p>
                                  </div>
                                ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                      {exportSiteStep === 2 && (
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-lg">Review navigation</p>
                          <ScrollArea className={"h-full w-full"}>
                            {navigation && (
                              <div className="flex flex-col gap-2 w-full">
                                <p className="w-full text-center text-lg font-mono">
                                  {navigation.name}
                                </p>
                                {navigation.items.map((v, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between w-full bg-muted py-1 px-3 rounded-lg text-[15px]"
                                  >
                                    {v.title}
                                    <p className="font-mono">{v.url}</p>
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
                          <ScrollArea className={"h-full w-full"}>
                            todo
                          </ScrollArea>
                        </div>
                      )}
                      {exportSiteStep === 4 && (
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-lg">Export</p>
                          <ScrollArea className={"h-full w-full"}>
                            {exportStart ? (
                              <div>
                                <p className="font-mono bg-muted text-foreground rounded-md px-3 py-1 text-lg mb-5">
                                  {exportCurrentLog}
                                </p>
                                <Progress
                                  value={exportProgress}
                                  className="w-full"
                                />
                              </div>
                            ) : (
                              <p className="font-mono text-lg  w-full text-center">
                                Click export to start.
                              </p>
                            )}
                          </ScrollArea>
                        </div>
                      )}
                      {exportSiteStep === 5 && (
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-lg">Export complete!</p>
                          <p className="text-md">
                            Export is completed without errors, click download
                            zip.
                          </p>
                          <ScrollArea className={"h-full w-full"}>
                            <Button
                              className={"w-full"}
                              onClick={handleDownload}
                            >
                              Download zip
                            </Button>
                          </ScrollArea>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2.5 h-full **:text-[16px]">
                      <Button
                        variant="outline"
                        onClick={() => setExportSiteStep((prev) => prev - 1)}
                        disabled={exportSiteStep === 1 || exportStart}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (exportSiteStep === 4) {
                            handleExport();
                            return;
                          }
                          setExportSiteStep((prev) => prev + 1);
                        }}
                        disabled={exportStart}
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
                    <Button onClick={() => setStepsActive(true)}>Export</Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    )
  );
}
