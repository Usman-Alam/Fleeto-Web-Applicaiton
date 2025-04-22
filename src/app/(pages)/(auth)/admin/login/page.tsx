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
      // In a real implementation, you'd validate against a database or API
      if (username === "admin" && password === "admin123") {
        // Successful login
        await login({ 
          id: "admin-user",
          username: username,
          email: "admin@fleeto.com",
          role: "admin"
        });
        
        router.push("/admin/dashboard");
      } else {
        setError("Invalid admin credentials");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
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