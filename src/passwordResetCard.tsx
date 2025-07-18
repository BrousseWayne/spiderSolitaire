import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidPassword } from "./lib/utils";

export function PasswordResetCard() {
  const [error, setError] = useState<string | null>(null);
  const [formFilled, setFormFilled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const validateForm = (form: HTMLFormElement) => {
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const filled = password.length > 0 && confirmPassword.length > 0;
    setFormFilled(filled);

    if (!filled) return false;

    if (!isValidPassword(password)) {
      setError(
        "Password must be 8+ characters, include uppercase, lowercase, and a number."
      );
      return false;
    } else {
      setError(null);
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError(null);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = e.currentTarget.form as HTMLFormElement;
    validateForm(form);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    if (!validateForm(form)) return;

    const formData = new FormData(form);
    const password = formData.get("password");

    try {
      const response = await fetch(`http://localhost:3000/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        setError("Failed to reset password. Token may be invalid or expired.");
        return;
      }

      setError(null);
      setSubmitted(true);
    } catch (err) {
      setError("Network error.");
      console.error(err);
    }
  };

  if (submitted)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been updated. You can now log in with your new
              password.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>Enter a new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="reset-password-form" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={handleInputChange}
                  aria-invalid={!!error}
                  aria-describedby="password-error"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  onChange={handleInputChange}
                  aria-invalid={!!error}
                  aria-describedby="password-error"
                />
                <p
                  id="password-error"
                  role="alert"
                  className={`text-sm mt-1 ${
                    error ? "text-red-600" : "invisible"
                  }`}
                  style={{ minHeight: "1.25rem" }}
                >
                  {error || " "}
                </p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="reset-password-form"
            className="w-full"
            disabled={!formFilled || !!error}
          >
            Reset Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
