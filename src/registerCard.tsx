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

//TODO: better flow, for the error messages

const isValidPassword = (password: string) => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  return password.length >= minLength && hasUpper && hasDigit;
};

export function RegisterCard() {
  const [error, setError] = useState<string | null>(null);
  const [formFilled, setFormFilled] = useState(false);

  const navigate = useNavigate();

  const validateForm = (form: HTMLFormElement) => {
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    const filled =
      email.length > 0 && password.length > 0 && confirmPassword.length > 0;
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
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch(`http://localhost:3000/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 409) {
        console.log(await response.json());
        setError("Email is already registered");
        return;
      }

      if (!response.ok) {
        setError("Registration failed");
        return;
      }

      const data = await response.json();
      setError(null);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

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
                onChange={handleInputChange}
                aria-invalid={!!error}
                aria-describedby="password-error"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
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
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                onChange={handleInputChange}
                aria-invalid={!!error}
                aria-describedby="password-error"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="register-form"
          className="w-full"
          disabled={!formFilled || !!error}
        >
          Register
        </Button>
      </CardFooter>
    </Card>
  );
}
