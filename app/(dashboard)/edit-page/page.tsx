"use client";

import { EditorLayout } from "@/components/editor/layout";
import { Storage } from "@/lib/storage";
import { IPage } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function EditPageContent() {
  const [page, setPage] = useState<IPage | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    const getPage = async () => {
      const id = searchParams.get("id");
      if (!id) {
        setLoading(false);
        return;
      }

      const pages = (await Storage.getItem("pages", "pages")) as IPage[] | null;

      if (pages && Array.isArray(pages)) {
        const selectedPage = pages.find((v) => v.id === id);
        if (selectedPage) {
          setPage(selectedPage);
        } else {
        }
      }

      setLoading(false);
    };

    getPage();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex w-full min-h-screen bg-background text-foreground text-3xl items-center justify-center font-mono">
        Loading Editor...
      </div>
    );
  }

  return <>{page ? <EditorLayout page={page} /> : <div>Page not found</div>}</>;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full min-h-screen bg-background text-foreground text-3xl items-center justify-center font-mono">
          Loading Editor...
        </div>
      }
    >
      <EditPageContent />
    </Suspense>
  );
}
