"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const convex = useConvex();
  const { user, isLoading: authLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const ok = await login(email, password);
      if (!ok) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message?.includes("user already exists")) {
        toast.error("Account not found. Please sign up first.");
      } else if (err.message?.includes("Could not find function")) {
        toast.error("Database not set up. Please run: npx convex deploy");
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Try to create a demo user if not exists
      await convex.mutation(api.auth.createUser, {
        email: "admin@adaptus.com",
        password: "admin123",
        name: "Admin User",
        role: "Admin",
      });
    } catch (err) {
      // User might already exist, ignore
    }

    // Now try to login
    setEmail("admin@adaptus.com");
    setPassword("admin123");

    try {
      const ok = await login("admin@adaptus.com", "admin123");
      if (!ok) {
        toast.error("Demo user not found. Please sign up first.");
        setIsLoading(false);
        return;
      }

      toast.success("Logged in as demo user!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Demo login error:", err);
      toast.error("Please sign up first at /signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              {isLoading
                ? "Setting up..."
                : "Demo Login (Click if login fails)"}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
