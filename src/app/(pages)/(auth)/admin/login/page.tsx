"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormTemplatePage from "@components/FormTemplatePage";
import { useAuth } from "@contexts/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/adminLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Successful login
      await login(data.data);
      router.push("/admin/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed. Please try again.");
      console.error("Admin login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormTemplatePage
      title="Admin Login"
      fields={[
        {
          label: "Username",
          type: "text",
          name: "username",
          placeholder: "admin",
          value: username,
          onChange: (e) => setUsername(e.target.value),
          required: true,
        },
        {
          label: "Password",
          type: "password",
          name: "password",
          placeholder: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
        },
      ]}
      buttonText={isSubmitting ? "Logging in..." : "Login as Admin"}
      onSubmit={handleSubmit}
      error={error}
      disabled={isSubmitting}
    />
  );
}