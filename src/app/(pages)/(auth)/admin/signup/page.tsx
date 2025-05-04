"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormTemplatePage from "@components/FormTemplatePage";

export default function AdminSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you'd make an API call to create admin
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: "admin"
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create admin account");
      }
      
      router.push("/admin/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create admin account");
      console.error("Admin signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <FormTemplatePage
      title="Admin Signup"
      fields={[
        {
          label: "Username",
          type: "text",
          name: "username",
          placeholder: "admin",
          value: formData.username,
          onChange: handleChange,
          required: true,
        },
        {
          label: "Email Address",
          type: "email",
          name: "email",
          placeholder: "admin@example.com",
          value: formData.email,
          onChange: handleChange,
          required: true,
        },
        {
          label: "Password",
          type: "password",
          name: "password",
          placeholder: "Choose a strong password",
          value: formData.password,
          onChange: handleChange,
          required: true,
        },
      ]}
      buttonText={isSubmitting ? "Creating Account..." : "Create Admin Account"}
      onSubmit={handleSubmit}
      error={error}
      disabled={isSubmitting}
    />
  );
}