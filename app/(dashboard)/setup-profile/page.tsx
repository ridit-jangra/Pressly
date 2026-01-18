"use client";

import { Button } from "@/components/shadcn/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { AuthService } from "@/lib/authService";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ siteName?: string; siteUrl?: string }>(
    {},
  );

  const validateForm = () => {
    const newErrors: { siteName?: string; siteUrl?: string } = {};

    if (!siteName.trim()) {
      newErrors.siteName = "Site Name is required";
    }

    if (!siteUrl.trim()) {
      newErrors.siteUrl = "Site Url is required";
    } else if (!/^\S+\.\S+$/.test(siteUrl)) {
      newErrors.siteUrl = "Please enter a valid url";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await AuthService.addSiteData({ name: siteName.trim(), url: siteUrl });
      await AuthService.setCompletedSetup(true);
      toast.success("Profile completed successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid name or url");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background">
      <div className="w-[40%] h-[80%] bg-muted rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-4 px-12">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md"></div>
                <span className="sr-only">Pressly</span>
              </a>
              <h1 className="text-xl font-medium">Welcome to Pressly</h1>
              <p className="text-md">Let's setup your first website.</p>
            </div>
          </FieldGroup>
          <Field>
            <FieldLabel htmlFor="siteName">Site Name</FieldLabel>
            <Input
              id="siteName"
              type="text"
              placeholder="Example"
              value={siteName}
              onChange={(e) => {
                setSiteName(e.target.value);
                if (errors.siteName) setErrors({ ...errors, siteName: "" });
              }}
              className={cn({
                "ring-2 ring-destructive/50 focus:ring-destructive/50":
                  errors.siteName,
              })}
              required
              disabled={isLoading}
            />
            {errors.siteName && (
              <FieldDescription className="text-destructive text-sm mt-1">
                {errors.siteName}
              </FieldDescription>
            )}

            <FieldLabel htmlFor="siteUrl">Site Url</FieldLabel>
            <Input
              id="siteUrl"
              type="url"
              placeholder="example.com"
              value={siteUrl}
              onChange={(e) => {
                setSiteUrl(e.target.value);
                if (errors.siteUrl) setErrors({ ...errors, siteUrl: "" });
              }}
              className={cn({
                "ring-2 ring-destructive/50 focus:ring-destructive/50":
                  errors.siteUrl,
              })}
              required
              disabled={isLoading}
            />
            {errors.siteUrl && (
              <FieldDescription className="text-destructive text-sm mt-1">
                {errors.siteUrl}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Complete"}
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
}
