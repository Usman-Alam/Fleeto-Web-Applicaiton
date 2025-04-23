"use client";

import { useState } from "react";
import FormTemplatePage from "@components/FormTemplatePage";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "App",
    feedback: "",
    rating: 0,
    shopName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating: number) => {
    // Ensure rating stays between 0 and 5
    const clampedRating = Math.max(1, Math.min(5, newRating));
    setFormData((prev) => ({ ...prev, rating: clampedRating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!formData.feedback.trim()) {
      setError("Feedback is required.");
      return;
    }
    if (formData.rating === 0) {
      setError("Please provide a rating.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      alert("Feedback submitted successfully!");
      setFormData({ name: "", category: "App", feedback: "", rating: 0, shopName: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormTemplatePage
      title="Feedback Form"
      onSubmit={handleSubmit}
      buttonText={isSubmitting ? "Submitting..." : "Submit Feedback"}
      disabled={isSubmitting}
      error={error}
      fields={[
        {
          type: "text",
          name: "name",
          label: "Name",
          value: formData.name,
          placeholder: "Your name",
          required: true,
          onChange: handleChange
        },
        {
          type: "select",
          name: "category",
          label: "Category",
          value: formData.category,
          onChange: handleChange,
          options: [
            { value: "App", label: "App" },
            { value: "Restaurant", label: "Restaurant" },
            { value: "Grocery", label: "Grocery" },
            { value: "Pharmacy", label: "Pharmacy" }
          ]
        },
        // Conditionally add shop name field
        ...(formData.category !== "App" ? [{
          type: "text",
          name: "shopName",
          label: `${formData.category} Name`,
          value: formData.shopName,
          placeholder: `Enter ${formData.category.toLowerCase()} name`,
          required: true,
          onChange: handleChange
        }] : []),
        {
          type: "select",
          name: "rating",
          label: "Rate your experience",
          value: formData.rating.toString(), // Convert to string for select value
          onChange: (e) => handleRatingChange(Number(e.target.value)), // Convert back to number
          options: [
            { value: "1", label: "1 - Poor" },
            { value: "2", label: "2 - Fair" },
            { value: "3", label: "3 - Good" },
            { value: "4", label: "4 - Very Good" },
            { value: "5", label: "5 - Excellent" }
          ],
          placeholder: "Select a rating"
        },
        {
          type: "textarea",
          name: "feedback",
          label: "Feedback",
          value: formData.feedback,
          placeholder: "Write your feedback here...",
          onChange: handleChange
        }
      ]}
    />
  );
}