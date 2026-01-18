"use client";

import { useRouter } from "next/navigation";
import { Button } from "../shadcn/button";
import { useEffect, useState } from "react";
import { INavigation, IPage, ISite } from "@/lib/types";
import { AuthService } from "@/lib/authService";
import {
  ArrowLeftRightIcon,
  BookIcon,
  CheckCheckIcon,
  PaletteIcon,
  XIcon,
} from "lucide-react";
import { Storage } from "@/lib/storage";
import { handleExportSite } from "@/lib/exportSite";
import { toast } from "sonner";

export function Site() {
  const [siteData, setSiteData] = useState<ISite>();
  const [pages, setPages] = useState<IPage[]>();
  const [navigation, setNavigation] = useState<INavigation>();
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

  const handleExport = () => {
    if (!navigation) {
      toast("Add navgiation to export.");
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

    handleExportSite({
      navigation: navigation,
      pages: pages,
      siteData: siteData,
    });
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

            <div>
              <Button className={"w-full"} onClick={handleExport}>
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
