"use client";

import { AuthService } from "@/lib/authService";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const router = useRouter();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (hasCheckedAuth.current) return;

    let isMounted = true;
    let handlePopState: (() => void) | null = null;

    const checkAuth = async () => {
      try {
        const authenticated = AuthService.isAuthenticated();

        if (!isMounted) {
          console.log("Component unmounted, skipping redirect");
          return;
        }

        if (authenticated) {
          console.log("Redirecting to /overview");
          router.push("/dashboard");
        } else {
          console.log("Redirecting to /login");
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);

        if (isMounted) {
          router.replace("/login");
        }
      }
    };

    const timeoutId = setTimeout(() => {
      hasCheckedAuth.current = true;
      checkAuth();
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (handlePopState) {
        window.removeEventListener("popstate", handlePopState);
      }
    };
  }, [router]);
  return (
    <div className="flex w-full min-h-screen bg-background text-foreground text-3xl items-center justify-center font-mono">
      Loading Pressly...
    </div>
  );
}
