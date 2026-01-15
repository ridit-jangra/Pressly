"use client";

import { Content } from "@/components/dashboard/content";
import { ExampleContent } from "@/components/dashboard/example-content";
import { AppSidebar } from "@/components/dashboard/sidebar";
import { Toaster } from "@/components/shadcn/sonner";
import { AuthService } from "@/lib/authService";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";

export default function Page() {
  const [currentContent, setCurrentContent] = useState<JSX.Element>();
  const router = useRouter();

  const contentMap: Record<string, JSX.Element> = {
    "dashboard/site": <ExampleContent />,
    "pages/all-pages": <ExampleContent />,
    "pages/add-page": <ExampleContent />,
    "navigation/manage": <ExampleContent />,
    "navigation/edit": <ExampleContent />,
    "colors/manage": <ExampleContent />,
  };

  useEffect(() => {
    const content = contentMap["dashboard/site"];
    setCurrentContent(content);
  }, []);

  useEffect(() => {
    const check = async () => {
      const user = await AuthService.getCurrentUser();
      if (!user) return;

      if (!user.isCompletedSetup) router.replace("setup-profile");
    };

    check();
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-background text-foreground">
      <AppSidebar
        currentContent={currentContent}
        setCurrentContent={setCurrentContent}
        contentMap={contentMap}
      />
      <Content
        currentContent={currentContent}
        setCurrentContent={setCurrentContent}
      />
      <Toaster dir="ltr" position="top-center" duration={700} />
    </div>
  );
}
