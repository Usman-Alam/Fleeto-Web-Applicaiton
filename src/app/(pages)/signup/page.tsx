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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+`~[\]{};:'"\\|,<.>/?]).{8,}$/;

      if (!passwordRegex.test(value)) {
        e.target.setCustomValidity(
          "Password must have minimum 8 characters, a number, an uppercase letter, and a special character."
        );
      } else {
        e.target.setCustomValidity("");
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        e.target.setCustomValidity("Passwords do not match.");
      } else {
        e.target.setCustomValidity("");
      }
    }

    e.target.reportValidity();

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert(JSON.stringify(data));
    } catch (err) {
      console.error("Error:", err);
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
      buttonText="Sign Up"
      onSubmit={handleSubmit}
    />
  );
} 
