"use client";

import { useState } from "react";
import FormTemplatePage from "@components/FormTemplatePage";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <FormTemplatePage
      title="Login Form"
      fields={[
        { label: "Email Address", type: "email", name: "email", placeholder: "muhammad@gmail.com", value: formData.email, onChange: handleChange, required: true },
        { label: "Password", type: "password", name: "password", placeholder: "Hello123!", value: formData.password, onChange: handleChange, required: true },
      ]}
      buttonText="Log in"
      onSubmit={handleSubmit}
    />
  );
}
