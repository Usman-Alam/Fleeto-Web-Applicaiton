"use client";

import { useState } from "react";
import FormTemplatePage from "@components/FormTemplatePage";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // First name validation
    if (name === "firstname") {
      const nameRegex = /^[A-Za-z\s]+$/;
      
      if (value.trim() === "") {
        e.target.setCustomValidity("First name is required.");
      } else if (!nameRegex.test(value)) {
        e.target.setCustomValidity("First name should contain only letters.");
      } else if (value.length < 2) {
        e.target.setCustomValidity("First name should be at least 2 characters.");
      } else {
        e.target.setCustomValidity("");
      }
    }

    // Last name validation
    if (name === "lastname") {
      const nameRegex = /^[A-Za-z\s]+$/;
      
      if (value.trim() === "") {
        e.target.setCustomValidity("Last name is required.");
      } else if (!nameRegex.test(value)) {
        e.target.setCustomValidity("Last name should contain only letters.");
      } else {
        e.target.setCustomValidity("");
      }
    }

    // Email validation
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (value.trim() === "") {
        e.target.setCustomValidity("Email is required.");
      } else if (!emailRegex.test(value)) {
        e.target.setCustomValidity("Please enter a valid email address.");
      } else {
        e.target.setCustomValidity("");
      }
    }

    // Password validation
    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+`~[\]{};:'"\\|,<.>/?]).{8,}$/;

      if (value.trim() === "") {
        e.target.setCustomValidity("Password is required.");
      } else if (!passwordRegex.test(value)) {
        e.target.setCustomValidity(
          "Password must have minimum 8 characters, a number, an uppercase letter, and a special character."
        );
      } else {
        e.target.setCustomValidity("");
      }

      // Update confirm password validation if it has a value
      if (formData.confirmPassword) {
        const confirmPasswordInput = document.querySelector(
          'input[name="confirmPassword"]'
        ) as HTMLInputElement;
        
        if (confirmPasswordInput) {
          if (value !== formData.confirmPassword) {
            confirmPasswordInput.setCustomValidity("Passwords do not match.");
          } else {
            confirmPasswordInput.setCustomValidity("");
          }
        }
      }
    }

    // Confirm password validation
    if (name === "confirmPassword") {
      if (value.trim() === "") {
        e.target.setCustomValidity("Please confirm your password.");
      } else if (value !== formData.password) {
        e.target.setCustomValidity("Passwords do not match.");
      } else {
        e.target.setCustomValidity("");
      }
    }

    // Phone number validation
    if (name === "phone") {
      const phoneRegex = /^03[0-4][0-9]{8}$/;
      
      if (value.trim() === "") {
        e.target.setCustomValidity("Phone number is required.");
      } else if (!phoneRegex.test(value)) {
        e.target.setCustomValidity(
          "Phone number must be 11 digits, start with 03, and the third digit should be 0-4."
        );
      } else {
        e.target.setCustomValidity("");
      }
    }

    // Address validation (optional field, but can add minimum length if needed)
    if (name === "address" && value.trim() !== "" && value.length < 5) {
      e.target.setCustomValidity("Address should be at least 5 characters long.");
    } else if (name === "address") {
      e.target.setCustomValidity("");
    }

    // Terms checkbox validation
    if (name === "terms") {
      if (!checked) {
        e.target.setCustomValidity("You must accept the terms and conditions to proceed.");
      } else {
        e.target.setCustomValidity("");
      }
    }

    e.target.reportValidity();
    
    // Clear any previous error messages when user makes changes
    if (error) setError(null);

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // Ensure terms are accepted
    if (!formData.terms) {
      setError("You must accept the terms and conditions to proceed.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Get the error message from the API response
        throw new Error(data.error || `Error: ${response.status}`);
      }

      // Success - redirect to login page
      window.location.href = "/login?registered=success";
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormTemplatePage
      title="Signup Form"
      fields={[
        { label: "First Name", type: "text", name: "firstname", placeholder: "Muhammad", value: formData.firstname, onChange: handleChange, required: true },
        { label: "Last Name", type: "text", name: "lastname", placeholder: ".", value: formData.lastname, onChange: handleChange, required: true },
        { label: "Email Address", type: "email", name: "email", placeholder: "muhammad@gmail.com", value: formData.email, onChange: handleChange, required: true },
        { label: "Phone Number", type: "tel", name: "phone", placeholder: "03123456789", value: formData.phone, onChange: handleChange, required: true },
        { label: "Address", type: "text", name: "address", placeholder: "Sector U, Phase 5, DHA, Lahore", value: formData.address, onChange: handleChange },
        { label: "Password", type: "password", name: "password", placeholder: "Hello123!", value: formData.password, onChange: handleChange, required: true },
        { label: "Confirm Password", type: "password", name: "confirmPassword", placeholder: "Hello123!", value: formData.confirmPassword, onChange: handleChange, required: true },
      ]}
      showTerms={true}
      termsValue={formData.terms}
      onTermsChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
      buttonText={isSubmitting ? "Signing Up..." : "Sign Up"}
      onSubmit={handleSubmit}
      disabled={isSubmitting}
      error={error}
    />
  );
}
