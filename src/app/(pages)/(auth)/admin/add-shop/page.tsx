"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteButton from "@components/SiteButton";
import { Store, Phone, Mail, Clock, Truck, Star, Lock } from "lucide-react";

interface ShopFormData {
  name: string;
  description: string;
  category: "Restaurant" | "Grocery" | "Medicine";
  cuisines: string[];
  contact: {
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  deliveryTimeEstimate: {
    min: number;
    max: number;
  };
  deliveryFee: number;
  freeDeliveryAbove: number | null;
  image: string;
  password: string;
  confirmPassword: string;
}

export default function AddShopPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cuisineInput, setCuisineInput] = useState("");

  const [formData, setFormData] = useState<ShopFormData>({
    name: "",
    description: "",
    category: "Restaurant",
    cuisines: [],
    contact: {
      phone: "",
      email: "",
    },
    address: {
      street: "",
      city: "",
      postalCode: "",
    },
    deliveryTimeEstimate: {
      min: 20,
      max: 40,
    },
    deliveryFee: 0,
    freeDeliveryAbove: null,
    image: "/no_shop.png",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

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

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ShopFormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCuisine = () => {
    if (cuisineInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        cuisines: [...prev.cuisines, cuisineInput.trim()],
      }));
      setCuisineInput("");
    }
  };

  const handleRemoveCuisine = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cuisines: prev.cuisines.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Create submission data with slug and password
      const submissionData = {
        ...formData,
        slug,
        password: formData.password // Include password
      };

      // Remove confirmPassword from submission
      delete submissionData.confirmPassword;

      const response = await fetch("/api/addShop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add shop");
      }

      router.push("/admin/dashboard?success=true");
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] mb-[30px]">
        <div
          className="bg-white rounded-[16px] p-6 md:p-8"
          style={{ boxShadow: "0px 1px 10px var(--shadow)" }}
        >
          <h1 className="text-[28px] font-bold mb-6 flex items-center gap-2">
            <Store className="text-[var(--accent)]" />
            Add New Shop
          </h1>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-[20px] font-semibold">Basic Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Medicine">Medicine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Cuisines */}
            <div className="space-y-4">
              <h2 className="text-[20px] font-semibold">Cuisines</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cuisineInput}
                  onChange={(e) => setCuisineInput(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="Enter cuisine type"
                />
                <SiteButton
                  text="Add"
                  variant="outlined"
                  onClick={handleAddCuisine}
                  type="button"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cuisines.map((cuisine, index) => (
                  <span
                    key={index}
                    className="bg-[var(--bg2)] px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {cuisine}
                    <button
                      type="button"
                      onClick={() => handleRemoveCuisine(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-[20px] font-semibold flex items-center gap-2">
                <Phone className="text-[var(--accent)]" size={20} />
                Contact Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="contact.email"
                    value={formData.contact.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
              <h2 className="text-[20px] font-semibold flex items-center gap-2">
                <Lock className="text-[var(--accent)]" size={20} />
                Security
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                    placeholder="Choose a secure password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h2 className="text-[20px] font-semibold">Address</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h2 className="text-[20px] font-semibold flex items-center gap-2">
                <Truck className="text-[var(--accent)]" size={20} />
                Delivery Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Delivery Time (minutes)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="deliveryTimeEstimate.min"
                      value={formData.deliveryTimeEstimate.min}
                      onChange={handleInputChange}
                      required
                      min={1}
                      className="w-full p-2 border rounded-md"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      name="deliveryTimeEstimate.max"
                      value={formData.deliveryTimeEstimate.max}
                      onChange={handleInputChange}
                      required
                      min={1}
                      className="w-full p-2 border rounded-md"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    name="deliveryFee"
                    value={formData.deliveryFee}
                    onChange={handleInputChange}
                    required
                    min={0}
                    step={0.01}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Free Delivery Above ($)
                </label>
                <input
                  type="number"
                  name="freeDeliveryAbove"
                  value={formData.freeDeliveryAbove || ""}
                  onChange={handleInputChange}
                  min={0}
                  step={0.01}
                  className="w-full p-2 border rounded-md"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <SiteButton
                text="Cancel"
                variant="outlined"
                onClick={() => router.back()}
                type="button"
                fullWidth
              />
              <SiteButton
                text={isSubmitting ? "Adding Shop..." : "Add Shop"}
                variant="filled"
                type="submit"
                disabled={isSubmitting}
                fullWidth
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}