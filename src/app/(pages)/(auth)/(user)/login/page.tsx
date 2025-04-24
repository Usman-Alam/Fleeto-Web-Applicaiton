"use client";

import { useState } from "react";
import Link from "next/link"; // Add this import
import FormTemplatePage from "@components/FormTemplatePage";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("Login response:", res);

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.replace("/"); // or "dashboard"
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again.");
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
      buttonText="Log in"
      onSubmit={handleSubmit}
      error={error}
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
