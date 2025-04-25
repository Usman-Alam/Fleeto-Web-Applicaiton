"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormTemplatePage from "@components/FormTemplatePage";
import { useAuth } from "@contexts/AuthContext";

export default function ShopLoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: "", 
        password: "",
        remember: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/shop/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

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
            if (value.trim() === "") {
                e.target.setCustomValidity("Password is required.");
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

        setIsSubmitting(true);
        setError(null);

        try {
            // Use the shop-specific login endpoint
            const response = await fetch("/api/auth/shop/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Error: ${response.status}`);
            }

            // // Use the auth context login function
            // await login({
            //     email: formData.email,
            //     password: formData.password
            // });
            localStorage.setItem('role', 'vendor')
            localStorage.setItem('shopname', data.data.shopname);
            localStorage.setItem('email', data.data.email);

            // Redirect to shop dashboard   
            router.push("/shop/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <FormTemplatePage
            title="Shop Login"
            fields={[
                {
                    label: "Email Address",
                    type: "email",
                    name: "email",
                    placeholder: "youremail@example.com",
                    value: formData.email,
                    onChange: handleChange,
                    required: true
                },
                {
                    label: "Password",
                    type: "password",
                    name: "password",
                    placeholder: "Your password",
                    value: formData.password,
                    onChange: handleChange,
                    required: true
                },
            ]}
            additionalOptions={
                <div className="flex items-center justify-between w-full mt-2 mb-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            checked={formData.remember}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>
                    <div className="text-sm">
                        <Link href="/shop/forgot-password" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
                            Forgot your password?
                        </Link>
                    </div>
                </div>
            }
            buttonText={isSubmitting ? "Logging In..." : "Log In"}
            onSubmit={handleSubmit}
            disabled={isSubmitting}
            error={error}
            bottomText={
                <p className="text-center mt-4">
                    Don&apos;t have a shop account?{" "}
                    <Link href="/shop/signup" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
                        Sign up here
                    </Link>
                </p>
            }
        />
    );
}