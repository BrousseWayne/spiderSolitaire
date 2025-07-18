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

export default function ForgotPasswordCard() {
  const [submitted, setSubmitted] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.currentTarget.value.trim();
    setFormFilled(email.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = form.email.value;

    try {
      await fetch(`http://localhost:3000/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error(error);
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="cursor-pointer"
            >
              Back to login
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="forgot-password-form" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            form="forgot-password-form"
            className="w-full"
            disabled={!formFilled}
          >
            Reset Password
          </Button>
          {submitted && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              If an account with that email exists, a reset link has been sent.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
