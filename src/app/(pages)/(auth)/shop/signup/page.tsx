"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormTemplatePage from "@components/FormTemplatePage";

type ShopCategory = "Restaurant" | "Grocery" | "Medicine";

export default function ShopSignupPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Consolidated form data using a single state object
    const [formData, setFormData] = useState({
        // Owner information
        ownerFirstName: "",
        ownerLastName: "",
        email: "",
        password: "",
        confirmPassword: "",

        // Shop information
        name: "",
        description: "",
        category: "Restaurant" as ShopCategory,
        tags: "",

        // Contact & location
        phone: "",
        streetAddress: "",
        city: "",
        postalCode: "",

        // Delivery information
        deliveryTimeMin: "",
        deliveryTimeMax: "",
        deliveryFee: "",
        terms: false
    });

    // Handle form field changes with inline validation
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        const newValue = type === "checkbox" ? checked : value;

        // Update form data first with the new value
        setFormData({ ...formData, [name]: newValue });

        // Clear any error messages when user starts typing again
        if (message.type === "error") {
            setMessage({ type: "", text: "" });
        }

        // Owner First Name validation
        if (name === "ownerFirstName") {
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

        // Owner Last Name validation
        if (name === "ownerLastName") {
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

        // Phone validation - using the same pattern as customer signup
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

        // Shop name validation
        if (name === "name") {
            if (value.trim() === "") {
                e.target.setCustomValidity("Shop name is required.");
            } else if (value.length < 2) {
                e.target.setCustomValidity("Shop name should be at least 2 characters.");
            } else {
                e.target.setCustomValidity("");
            }
        }

        // Description validation
        if (name === "description") {
            if (value.trim() === "") {
                e.target.setCustomValidity("Description is required.");
            } else if (value.length < 20) {
                e.target.setCustomValidity("Description should be at least 20 characters.");
            } else {
                e.target.setCustomValidity("");
            }
        }

        // Street address validation
        if (name === "streetAddress") {
            if (value.trim() === "") {
                e.target.setCustomValidity("Street address is required.");
            } else if (value.length < 5) {
                e.target.setCustomValidity("Address should be at least 5 characters long.");
            } else {
                e.target.setCustomValidity("");
            }
        }

        // City validation
        if (name === "city") {
            if (value.trim() === "") {
                e.target.setCustomValidity("City is required.");
            } else {
                e.target.setCustomValidity("");
            }
        }

        // Delivery fee validation
        if (name === "deliveryFee") {
            const fee = parseFloat(value);

            if (value.trim() === "") {
                e.target.setCustomValidity("Delivery fee is required.");
            } else if (isNaN(fee) || fee < 0) {
                e.target.setCustomValidity("Please enter a valid delivery fee.");
            } else {
                e.target.setCustomValidity("");
            }
        }

        // Minimum delivery time validation
        if (name === "deliveryTimeMin") {
            const minTime = parseInt(value);
            const maxTime = parseInt(formData.deliveryTimeMax);

            if (value.trim() === "") {
                e.target.setCustomValidity("Minimum delivery time is required.");
            } else if (isNaN(minTime) || minTime <= 0) {
                e.target.setCustomValidity("Please enter a valid delivery time.");
            } else if (formData.deliveryTimeMax && !isNaN(maxTime) && minTime >= maxTime) {
                e.target.setCustomValidity("Min time must be less than max time.");
            } else {
                e.target.setCustomValidity("");
            }

            // Update max time field validation if needed
            if (formData.deliveryTimeMax) {
                const maxField = document.querySelector('input[name="deliveryTimeMax"]') as HTMLInputElement;

                if (maxField && !isNaN(minTime) && !isNaN(maxTime) && minTime >= maxTime) {
                    maxField.setCustomValidity("Max time must be greater than min time.");
                } else if (maxField) {
                    maxField.setCustomValidity("");
                }
            }
        }

        // Maximum delivery time validation
        if (name === "deliveryTimeMax") {
            const newMaxTime = parseInt(value);
            const newMinTime = parseInt(formData.deliveryTimeMin);

            if (value.trim() === "") {
                e.target.setCustomValidity("Maximum delivery time is required.");
            } else if (isNaN(newMaxTime) || newMaxTime <= 0) {
                e.target.setCustomValidity("Please enter a valid delivery time.");
            } else if (formData.deliveryTimeMin && !isNaN(newMinTime) && newMinTime >= newMaxTime) {
                e.target.setCustomValidity("Max time must be greater than min time.");
            } else {
                e.target.setCustomValidity("");
            }
        }

        // Terms checkbox validation
        if (name === "terms") {
            if (!checked) {
                e.target.setCustomValidity("You must accept the terms and conditions to proceed.");
            } else {
                e.target.setCustomValidity("");
            }
        }

        // Report validity to show validation messages
        e.target.reportValidity();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;

        // Clear any previous messages
        setMessage({ type: "", text: "" });

        // Check form validity
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Ensure terms are accepted
        if (!formData.terms) {
            setMessage({
                type: "error",
                text: "Please accept the terms and conditions to continue"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const shopSignup = {
                owner: {
                    firstName: formData.ownerFirstName,
                    lastName: formData.ownerLastName,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone
                },
                shop: {
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    tags: formData.tags.split(',').map(tag => tag.trim()),
                    contact: {
                        phone: formData.phone,
                        email: formData.email
                    },
                    address: {
                        street: formData.streetAddress,
                        city: formData.city,
                        postalCode: formData.postalCode
                    },
                    deliveryTimeEstimate: {
                        min: parseInt(formData.deliveryTimeMin),
                        max: parseInt(formData.deliveryTimeMax)
                    },
                    deliveryFee: parseFloat(formData.deliveryFee),
                    slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
                    image: "/no_shop.png" // Default image path
                }
            };

            const response = await fetch('/api/shop/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shopSignup)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to register shop');
            }

            // Show success message
            setMessage({
                type: "success",
                text: "Shop registered successfully! Redirecting..."
            });

            // Redirect after a short delay
            setTimeout(() => {
                router.push("/shop/registration-success");
            }, 1500);

        } catch (error) {
            console.error("Error registering shop:", error);
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Failed to register. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormTemplatePage
            title="Register Your Shop"
            subtitle="Join Fleeto and start selling your products to customers in your area"
            fields={[
                // Owner Information Section
                {
                    label: "First Name",
                    type: "text",
                    name: "ownerFirstName",
                    placeholder: "Your first name",
                    value: formData.ownerFirstName,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "Last Name",
                    type: "text",
                    name: "ownerLastName",
                    placeholder: "Your last name",
                    value: formData.ownerLastName,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "Email Address",
                    type: "email",
                    name: "email",
                    placeholder: "your.email@example.com",
                    value: formData.email,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "Password",
                    type: "password",
                    name: "password",
                    placeholder: "Choose a secure password",
                    value: formData.password,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "Confirm Password",
                    type: "password",
                    name: "confirmPassword",
                    placeholder: "Confirm your password",
                    value: formData.confirmPassword,
                    onChange: handleChange,
                    required: true,
                },

                // Shop Information Section
                {
                    label: "Shop Name",
                    type: "text",
                    name: "name",
                    placeholder: "e.g. Zakir Tikka",
                    value: formData.name,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "Category",
                    type: "select",
                    name: "category",
                    value: formData.category,
                    onChange: handleChange,
                    options: [
                        { value: "Restaurant", label: "Restaurant" },
                        { value: "Grocery", label: "Grocery" },
                        { value: "Medicine", label: "Medicine" }
                    ],
                    required: true,
                },
                {
                    label: "Description",
                    type: "textarea",
                    name: "description",
                    placeholder: "Brief description of the shop and what it offers",
                    value: formData.description,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "Tags",
                    type: "text",
                    name: "tags",
                    placeholder: formData.category === "Restaurant" ? "e.g., Desi Food, Fast Food" :
                        formData.category === "Grocery" ? "e.g., Fresh Produce, Household Items" :
                            "e.g., Prescriptions, OTC Medications",
                    value: formData.tags,
                    onChange: handleChange,
                    required: formData.category === "Restaurant",
                },

                // Contact & Location Section
                {
                    label: "Phone Number",
                    type: "tel",
                    name: "phone",
                    placeholder: "+92 300 1234567",
                    value: formData.phone,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "Street Address",
                    type: "text",
                    name: "streetAddress",
                    placeholder: "Shop location address",
                    value: formData.streetAddress,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "City",
                    type: "text",
                    name: "city",
                    placeholder: "Lahore",
                    value: formData.city,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "Postal Code",
                    type: "text",
                    name: "postalCode",
                    placeholder: "54000",
                    value: formData.postalCode,
                    onChange: handleChange,
                    required: false,
                },

                // Delivery Settings Section
                {
                    label: "Delivery Fee ($)",
                    type: "number",
                    name: "deliveryFee",
                    placeholder: "1.99",
                    value: formData.deliveryFee,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "Minimum Delivery Time",
                    type: "number",
                    name: "deliveryTimeMin",
                    placeholder: "20",
                    value: formData.deliveryTimeMin,
                    onChange: handleChange,
                    required: true,
                },
                {
                    label: "Maximum Delivery Time",
                    type: "number",
                    name: "deliveryTimeMax",
                    placeholder: "40",
                    value: formData.deliveryTimeMax,
                    onChange: handleChange,
                    required: true,
                },
            ]}
            buttonText={isSubmitting ? "Registering Shop..." : "Register Shop"}
            onSubmit={handleSubmit}
            error={message.type === "error" ? message.text : ""}
            disabled={isSubmitting}
            showTerms={true}
            termsValue={formData.terms}
            onTermsChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
            note={
                <div className="text-gray-500 text-sm mt-4">
                    <p>* Your shop registration will be reviewed and approved by our team.</p>
                    <p>* You&apos;ll receive a confirmation email once your account is approved.</p>
                    <p>* Shop images can be uploaded after approval from your shop dashboard.</p>
                </div>
            }
        />
    );
}