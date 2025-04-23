"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormTemplatePage from "@components/FormTemplatePage";
import { useAuth } from "@contexts/AuthContext";

type ShopCategory = "Restaurant" | "Grocery" | "Medicine";

export default function AddShopPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Basic shop information fields
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<ShopCategory>("Restaurant");
    const [tags, setTags] = useState("");

    // Contact information
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    // Address information
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    // Delivery information
    const [deliveryTimeMin, setDeliveryTimeMin] = useState("");
    const [deliveryTimeMax, setDeliveryTimeMax] = useState("");
    const [deliveryFee, setDeliveryFee] = useState("");
    const [freeDeliveryAbove, setFreeDeliveryAbove] = useState("");

    // Check if user is authenticated as admin
    if (isAuthenticated && user?.role === "admin") {
        // Continue with the form
    } else {
        // Redirect to admin login if not authenticated as admin
        router.push("/admin/login");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Enhanced validation
        if (!name.trim() || !description.trim() || !phone.trim() ||
            !email.trim() || !streetAddress.trim() || !city.trim() ||
            !deliveryTimeMin.trim() || !deliveryTimeMax.trim() || !deliveryFee.trim()) {
            setError("Please fill in all required fields");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        // Validate phone number format (Pakistani format)
        const phoneRegex = /^\+92\s?\d{3}\s?\d{7}$/;
        if (!phoneRegex.test(phone)) {
            setError("Please enter a valid Pakistani phone number (+92 XXX XXXXXXX)");
            return;
        }

        // Validate delivery times
        const minTime = parseInt(deliveryTimeMin);
        const maxTime = parseInt(deliveryTimeMax);
        if (minTime >= maxTime) {
            setError("Maximum delivery time must be greater than minimum delivery time");
            return;
        }

        setIsSubmitting(true);

        try {
            const newShop = {
                name,
                description,
                category,
                cuisines: category === "Restaurant" ? tags.split(',').map(cuisine => cuisine.trim()) : [],
                contact: {
                    phone,
                    email
                },
                address: {
                    street: streetAddress,
                    city,
                    postalCode
                },
                deliveryTimeEstimate: {
                    min: parseInt(deliveryTimeMin),
                    max: parseInt(deliveryTimeMax)
                },
                deliveryFee: parseFloat(deliveryFee),
                freeDeliveryAbove: freeDeliveryAbove ? parseFloat(freeDeliveryAbove) : null,
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                image: "/no_shop.png" // Default image path
            };

            const response = await fetch('/api/addShop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newShop)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create shop');
            }

            // Redirect to dashboard with success message
            router.push("/admin/dashboard?success=shop-added");

        } catch (error) {
            console.error("Error adding shop:", error);
            setError(error instanceof Error ? error.message : "Failed to add shop. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormTemplatePage
            title="Add New Shop"
            subtitle="Enter the details of the new shop to be added to Fleeto"
            fields={[
                // Basic Shop Information
                {
                    label: "Shop Name",
                    type: "text",
                    name: "name",
                    placeholder: "e.g. Zakir Tikka",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    required: true,
                },
                {
                    label: "Category",
                    type: "select",
                    name: "category",
                    value: category,
                    onChange: (e) => setCategory(e.target.value as ShopCategory),
                    options: [
                        { value: "Restaurant", label: "Restaurant" },
                        { value: "Grocery", label: "Grocery Store" },
                        { value: "Medicine", label: "Medicine" }
                    ],
                    required: true,
                },
                {
                    label: "Description",
                    type: "textarea",
                    name: "description",
                    placeholder: "Brief description of the shop and what it offers",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    required: true,
                },
                {
                    label: "Tags",
                    type: "text",
                    name: "tags",
                    placeholder: "e.g., Desi Food, Medicine, Houshold Items",
                    value: tags,
                    onChange: (e) => setTags(e.target.value),
                    required: category === "Restaurant",
                },

                // Contact Information
                {
                    label: "Phone Number",
                    type: "tel",
                    name: "phone",
                    placeholder: "+92 300 1234567",
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                    required: true,
                },
                {
                    label: "Email Address",
                    type: "email",
                    name: "email",
                    placeholder: "contact@shop.com",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true,
                },

                // Address Information
                {
                    label: "Street Address",
                    type: "text",
                    name: "streetAddress",
                    placeholder: "Shop location address",
                    value: streetAddress,
                    onChange: (e) => setStreetAddress(e.target.value),
                    required: true,
                },
                {
                    label: "City",
                    type: "text",
                    name: "city",
                    placeholder: "Lahore",
                    value: city,
                    onChange: (e) => setCity(e.target.value),
                    required: true,
                },
                {
                    label: "Postal Code",
                    type: "text",
                    name: "postalCode",
                    placeholder: "54000",
                    value: postalCode,
                    onChange: (e) => setPostalCode(e.target.value),
                    required: false,
                },

                // Delivery Information
                {
                    label: "Delivery Fee ($)",
                    type: "number",
                    name: "deliveryFee",
                    placeholder: "1.99",
                    value: deliveryFee,
                    onChange: (e) => setDeliveryFee(e.target.value),
                    required: true,
                },
                {
                    label: "Minimum Delivery Time",
                    type: "number",
                    name: "deliveryTimeMin",
                    placeholder: "20",
                    value: deliveryTimeMin,
                    onChange: (e) => setDeliveryTimeMin(e.target.value),
                    required: true,
                },
                {
                    label: "Maximum Delivery Time",
                    type: "number",
                    name: "deliveryTimeMax",
                    placeholder: "40",
                    value: deliveryTimeMax,
                    onChange: (e) => setDeliveryTimeMax(e.target.value),
                    required: true,
                },
            ]}
            buttonText={isSubmitting ? "Adding Shop..." : "Add Shop"}
            onSubmit={handleSubmit}
            error={error}
            disabled={isSubmitting}
            note={
                <p className="text-gray-500 text-sm mt-4">
                    * Note: Shop logo and cover images will need to be uploaded separately in the shop management dashboard after creation.
                </p>
            }
        />
    );
}