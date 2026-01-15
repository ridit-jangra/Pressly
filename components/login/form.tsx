"use client";

import { GalleryVerticalEnd, UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AuthService } from "@/lib/authService";
import { cn } from "@/lib/utils";
import { Button } from "../shadcn/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../shadcn/field";
import { Input } from "../shadcn/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (hasCheckedAuth.current) return;

    let handlePopState: (() => void) | null = null;

    const checkAuth = async () => {
      try {
        const authenticated = AuthService.isAuthenticated();

        if (authenticated) {
          router.push("/dashboard");
        }
      } catch (error) {}
    };

    const timeoutId = setTimeout(() => {
      hasCheckedAuth.current = true;
      checkAuth();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (handlePopState) {
        window.removeEventListener("popstate", handlePopState);
      }
    };
  }, [router]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      await AuthService.login(email.trim(), password);
      toast.success("Logged in successfully!");
      router.replace("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Pressly</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Pressly</h1>
            <FieldDescription>
              Don&apos;t have an account?{" "}
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.replace("signup")}
              >
                Sign up
              </span>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={cn({
                "ring-2 ring-destructive/50 focus:ring-destructive/50":
                  errors.email,
              })}
              required
              disabled={isLoading}
            />
            {errors.email && (
              <FieldDescription className="text-destructive text-sm mt-1">
                {errors.email}
              </FieldDescription>
            )}

            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              className={cn({
                "ring-2 ring-destructive/50 focus:ring-destructive/50":
                  errors.password,
              })}
              required
              disabled={isLoading}
            />
            {errors.password && (
              <FieldDescription className="text-destructive text-sm mt-1">
                {errors.password}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Field>

          <FieldSeparator>Or</FieldSeparator>
          <Field>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.replace("signup")}
              disabled={isLoading}
              className="w-full"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline hover:no-underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:no-underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
