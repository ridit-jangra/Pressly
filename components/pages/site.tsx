"use client";

import { useRouter } from "next/navigation";
import { Button } from "../shadcn/button";
import { useEffect, useState } from "react";
import { ISite } from "@/lib/types";
import { AuthService } from "@/lib/authService";

export function Site() {
  const [siteData, setSiteData] = useState<ISite>();
  const router = useRouter();

  useEffect(() => {
    const getSite = async () => {
      const v = await AuthService.getSiteData();
      if (!v) return;

      setSiteData(v);
    };

    getSite();
  }, []);

  return (
    siteData && (
      <div className="w-full h-full flex flex-col gap-6">
        <div className="flex flex-col">
          <p className="text-3xl font-medium">Site</p>
          <p className="text-lg">{siteData.name}</p>
        </div>

        <div className="grid grid-cols-2 h-full w-full gap-3">
          <div className="flex flex-col gap-3 border-2 p-4 h-[50%] rounded-lg justify-between">
            <div className="flex items-center justify-between w-full">
              <p className="text-lg font-bold font-mono">Export Site</p>
            </div>
            <div>
              <Button className={"w-full"}>Export</Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
