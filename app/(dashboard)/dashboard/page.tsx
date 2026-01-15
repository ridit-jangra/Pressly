"use client";

import { Content } from "@/components/dashboard/content";
import { ExampleContent } from "@/components/dashboard/example-content";
import { AppSidebar } from "@/components/dashboard/sidebar";
import { AddPage } from "@/components/pages/add-page";
import { AllPages } from "@/components/pages/all-pages";
import { Toaster } from "@/components/shadcn/sonner";
import { AuthService } from "@/lib/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { JSX, useEffect, useState, Suspense } from "react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentContent, setCurrentContent] = useState<string>(
    searchParams.get("page") || "dashboard/site"
  );

  const contentMap: Record<string, JSX.Element> = {
    "dashboard/site": <ExampleContent />,
    "pages/all-pages": <AllPages />,
    "pages/add-page": <AddPage />,
    "navigation/manage": <ExampleContent />,
    "navigation/edit": <ExampleContent />,
    "colors/manage": <ExampleContent />,
  };

  useEffect(() => {
    const check = async () => {
      const user = await AuthService.getCurrentUser();
      if (!user) return;

      if (!user.isCompletedSetup) router.replace("setup-profile");
    };

    check();
  }, [router]);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam && pageParam !== currentContent) {
      setCurrentContent(pageParam);
    }
  }, [searchParams, currentContent]);

  return (
    <div className="flex w-full min-h-screen bg-background text-foreground">
      <AppSidebar />
      <Content currentContent={currentContent} contentMap={contentMap} />
      <Toaster dir="ltr" position="top-center" duration={700} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
