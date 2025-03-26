'use client';

import InputField from "@/components/InputField";
import SiteButton from "@/components/SiteButton";
import { useState } from "react";

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
      const response = await fetch("/api/auth", {
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
    <div className="w-[var(--section-width)] flex flex-row justify-center items-center">
      <div
        className="flex flex-col justify-center items-center p-[32px_64px] gap-[32px] w-full max-w-[800px] bg-[var(--bg2)] rounded-[20px]"
        style={{ boxShadow: "0px 1px 10px var(--shadow)", }}
      >
        <h3>Sign up Form</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] w-full">
          <div className="flex flex-col gap-[20px] w-full">
            <div className="flex flex-row gap-[20px] w-full">
              {/* First Name Field */}
              <InputField
                label="First Name"
                type="text"
                name="firstname"
                placeholder="Muhammad"
                value={formData.firstname}
                onChange={handleChange}
                required
              />

              {/* Last Name Field */}
              <InputField
                label="Last Name"
                type="text"
                name="lastname"
                placeholder="."
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Field */}
            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="muhammad@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Phone Field */}
            <InputField
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="+92 323 4836951"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            {/* Address Field */}
            <InputField
              label="Address"
              type="text"
              name="address"
              placeholder="Sector U, Phase 5, DHA, Lahore"
              value={formData.address}
              onChange={handleChange}
            />


            <div className="flex flex-row gap-[20px] w-full">
              {/* Password Field */}
              <InputField
                label="Password"
                type="password"
                name="password"
                placeholder="1234abcd"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {/* Confirm Password Field */}
              <InputField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="1234abcd"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Terms & Conditions, Privacy Policy */}
          <div className="flex flex-row items-start gap-[10px]">
            <input
              type="checkbox"
              id="terms"
              checked={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
              required
              className="w-[18px] h-[18px] accent-[var(--accent)] cursor-pointer"
            />
            <label htmlFor="terms" className="text-[14px]">
              I agree to Fleeto’s <a href="/terms-and-conditions" className="text-[var(--accent)]">Terms & Conditions</a>
              and <a href="/privacy-policy" className="text-[var(--accent)]">Privacy Policy</a>.
            </label>
          </div>

          {/* Submit Button */}
          <SiteButton text="Sign up" variant="filled" type="submit" />
        </form>
      </div>
    </div>
  );
}
