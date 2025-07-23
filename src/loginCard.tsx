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
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function SpinnerUI({ email }) {
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:3000/email-verified", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
          }),
        });
        const data = await res.json();

        if (data.verified) {
          clearInterval(interval);
          navigate("/spidy");
        } else {
          setPollingAttempts((prev) => prev + 1);
        }

        if (pollingAttempts >= 20) {
          clearInterval(interval);
          navigate("/login");
        }
      } catch (err) {
        clearInterval(interval);
        navigate("/login");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
      <h1 className="text-xl font-semibold">Waiting for email verification</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Please check your inbox and click the verification link we sent to your
        email. This page will automatically update once your email is verified.
      </p>
    </div>
  );
}

export function LoginCard() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [emailToVerify, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    console.log(email, password);

    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: "include",
      });

      if (response.status === 401) {
        console.log(await response.json());
        setError("Invalid Credentials");
        return;
      }

      if (response.status === 600) {
        console.log(await response.json());
        setIsVerified(false);
        setError("Waiting email verification");
        setEmail(email);
        return;
      }

      if (!response.ok) {
        setError("Registration failed");
        return;
      }

      setIsVerified(true);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (isVerified === true) {
      navigate("/profile");
    }
  }, [isVerified, navigate]);

  if (isVerified === false) {
    return <SpinnerUI email={emailToVerify} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => navigate("/register")}>
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleSubmit}>
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    variant="link"
                    onClick={() => navigate("/forgot-password")}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Button>
                </div>
                <Input id="password" name="password" type="password" required />
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
        <CardFooter className="flex-col gap-2">
          <Button type="submit" form="login-form" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
