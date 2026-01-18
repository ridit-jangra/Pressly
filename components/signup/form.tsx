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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "../shadcn/input-otp";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "../shadcn/label";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });
  const [otp, setOtp] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [otpError, setOtpError] = useState("");
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          router.push("/dashboard");
          return;
        }

        const pendingEmail = AuthService.getIPendingRegistrationEmail();
        if (pendingEmail) {
          setUserEmail(pendingEmail);
          setStep("otp");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    setTimeout(checkAuth, 1000);
  }, [router]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await AuthService.initiateRegistration(
        formData.name.trim(),
        formData.email.trim().toLowerCase(),
        formData.password,
      );

      toast.success("Verification code sent! Check your email or console.");
      setUserEmail(formData.email.trim().toLowerCase());
      setOtp("");
      setStep("otp");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    setOtpError("");

    try {
      await AuthService.verifyOTPAndCreateAccount(userEmail, otp);
      toast.success("Account created successfully! Welcome to Pressly!");
      router.push("/dashboard");
    } catch (error: any) {
      setOtpError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await AuthService.resendRegistrationOTP(userEmail);
      toast.success("New verification code sent!");
      setOtp("");
      setOtpError("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep("form");
    setOtp("");
    setOtpError("");
  };

  if (step === "otp") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <form onSubmit={handleVerifyOtp}>
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
              <h1 className="text-xl font-bold">Enter verification code</h1>
              <FieldDescription>
                We sent a 6-digit code to <strong>{userEmail}</strong>
              </FieldDescription>
            </div>

            <Field>
              <FieldLabel htmlFor="otp" className="sr-only">
                Verification code
              </FieldLabel>
              <InputOTP
                maxLength={6}
                id="otp"
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setOtpError("");
                }}
                required
                containerClassName="gap-4"
                disabled={isLoading}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {otpError && (
                <FieldDescription className="text-destructive text-sm mt-2 text-center">
                  {otpError}
                </FieldDescription>
              )}
              <FieldDescription className="text-center">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-primary underline hover:no-underline font-medium disabled:opacity-50"
                >
                  Resend
                </button>
              </FieldDescription>
            </Field>

            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify & Create Account"}
              </Button>
            </Field>

            <FieldSeparator>Or</FieldSeparator>
            <Field>
              <Button
                variant="outline"
                type="button"
                onClick={handleBackToForm}
                className="w-full"
                disabled={isLoading}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Edit Details
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSignup} className="space-y-4">
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
            <h1 className="text-xl font-bold">Create your Pressly account</h1>
            <FieldDescription>
              Already have an account?{" "}
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("login")}
              >
                Sign in
              </span>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className={cn({
                "ring-2 ring-destructive/50 focus:ring-destructive/50":
                  errors.name,
              })}
              required
              disabled={isLoading}
            />
            {errors.name && (
              <FieldDescription className="text-destructive text-sm mt-1">
                {errors.name}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
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
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
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
              {isLoading ? "Sending code..." : "Continue"}
            </Button>
          </Field>

          <FieldSeparator>Or</FieldSeparator>
          <Field>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("login")}
              disabled={isLoading}
              className="w-full"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Sign In Instead
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
