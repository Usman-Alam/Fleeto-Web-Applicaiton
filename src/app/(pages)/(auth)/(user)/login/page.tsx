"use client";

import { useState } from "react";
import Link from "next/link";
import FormTemplatePage from "@components/FormTemplatePage";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

        // Store user data in localStorage
      localStorage.setItem("email", data.email);
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.firstname);
      localStorage.setItem("isPro", String(Boolean(data.isPro)));
      localStorage.setItem("coins", String(Number(data.coins) || 0));
      localStorage.setItem("hasSubscription", String(Boolean(data.hasSubscription)));

      // Force a page reload to update the Navbar state
      window.location.href = "/";
    } catch (err) {
      console.error("Error during login:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormTemplatePage
      title="Login Form"
      fields={[
        {
          label: "Email Address",
          type: "email",
          name: "email",
          placeholder: "muhammad@gmail.com",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
        },
        {
          label: "Password",
          type: "password",
          name: "password",
          placeholder: "Hello123!",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
        },
      ]}
      buttonText={isLoading ? "Logging in..." : "Log in"}
      onSubmit={handleSubmit}
      error={error}
      disabled={isLoading}
      note={
        <p className="text-center mt-4">
          Are you a shop owner?{" "}
          <Link href="/shop/login" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
            Shop Login?
          </Link>
        </p>
      }
    />
  );
}
