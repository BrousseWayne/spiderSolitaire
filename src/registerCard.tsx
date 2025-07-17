import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    console.error("Passwords do not match");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

const isValidPassword = (password: string) => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  return password.length >= minLength && hasUpper && hasDigit;
};

export function RegisterCard() {
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    if (!isValidPassword(pwd)) {
      setError(
        "Password must be 8+ characters, include uppercase, lowercase, and a number."
      );
    } else {
      setError(null);
    }
  };

  const navigate = useNavigate();
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Enter your email and password to register
        </CardDescription>
        <CardAction>
          <Button
            variant="link"
            onClick={() => navigate("/login")}
            className="cursor-pointer"
          >
            Already have an account?
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                onChange={handlePasswordChange}
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
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="register-form" className="w-full">
          Register
        </Button>
      </CardFooter>
    </Card>
  );
}
