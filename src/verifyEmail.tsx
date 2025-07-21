import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VerifyEmail() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  useEffect(() => {
    const sendTokenToBackend = async () => {
      try {
        const response = await fetch(`http://localhost:3000/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          setError("Failed to verify email Token may be invalid or expired.");
          return;
        }

        setError(null);
      } catch (err) {
        setError("Network error.");
        console.error(err);
      }
    };

    sendTokenToBackend();
  }, [token]);

  if (error) {
    return (
      <div>
        TOKEN EXPIRED SEND AGAIN TOKEN EXPIRED SEND AGAIN TOKEN EXPIRED SEND
        AGAIN TOKEN EXPIRED SEND AGAIN
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Email Verification Successful</CardTitle>
          <CardDescription>
            Your account has been verified. You can now log in.
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
}
