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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        { label: "Phone Number", type: "tel", name: "phone", placeholder: "+92 323 4836951", value: formData.phone, onChange: handleChange, required: true },
        { label: "Address", type: "text", name: "address", placeholder: "Sector U, Phase 5, DHA, Lahore", value: formData.address, onChange: handleChange },
        { label: "Password", type: "password", name: "password", placeholder: "1234abcd", value: formData.password, onChange: handleChange, required: true },
        { label: "Confirm Password", type: "password", name: "confirmPassword", placeholder: "1234abcd", value: formData.confirmPassword, onChange: handleChange, required: true },
      ]}
      showTerms={true}
      buttonText="Sign Up"
      onSubmit={handleSubmit}
    />
  );
}
