"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@contexts/AuthContext";
import SiteButton from "@components/SiteButton";
import { Camera, Check, X, Loader } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, updateUser } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Form states
    const [profileData, setProfileData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: ""
    });

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    // Fetch user data on component mount
    useEffect(() => {
        // Check authentication
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        // If user is authenticated, populate form with existing data
        if (user) {
            setProfileData({
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || ""
            });

            // Set profile image if available
            if (user.image) {
                setPreviewUrl(user.image);
            }

            setIsLoading(false);
        }
    }, [user, isAuthenticated, router]);

    // Handle profile image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);

            // Create a preview URL
            const fileReader = new FileReader();
            fileReader.onload = () => {
                if (fileReader.result) {
                    setPreviewUrl(fileReader.result as string);
                }
            };
            fileReader.readAsDataURL(file);
        }
    };

    // Handle profile info update
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: "", text: "" });

        try {
            // API call to update user profile
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            // Update user context
            if (updateUser) {
                updateUser({
                    ...user,
                    ...profileData,
                });
            }

            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Failed to update profile"
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle profile image upload
    const handleImageSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
        // Remove the existing e.preventDefault() since MouseEvent might be undefined
        if (e) {
            e.preventDefault();
        }

        if (!profileImage) return;

        setIsSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const formData = new FormData();
            formData.append("profileImage", profileImage);

            const response = await fetch("/api/user/profile-image", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to upload image");
            }

            // Update user context with new image URL
            if (updateUser && data.imageUrl) {
                updateUser({
                    ...user,
                    image: data.imageUrl,
                });
            }

            setMessage({ type: "success", text: "Profile picture updated successfully!" });
        } catch (error) {
            console.error("Error uploading image:", error);
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Failed to upload image"
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader className="animate-spin text-[var(--accent)]" size={32} />
            </div>
        );
    }

    return (
        <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] px-4 md:px-8 lg:px-0 mx-auto mb-16">
            <h1 className="text-[var(--heading)] mb-6">My Profile</h1>

            {/* Status Messages */}
            {message.text && (
                <div
                    className={`mb-6 p-4 rounded-lg flex items-center justify-between ${message.type === "error"
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                        }`}
                >
                    <div className="flex items-center">
                        {message.type === "error" ? (
                            <X className="mr-2" size={20} />
                        ) : (
                            <Check className="mr-2" size={20} />
                        )}
                        {message.text}
                    </div>
                    <button
                        onClick={() => setMessage({ type: "", text: "" })}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Picture */}
                <div className="col-span-1">
                    <div className="bg-white p-6 rounded-[16px]" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                        <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-4">
                                <Image
                                    src={previewUrl || "/no_profile.png"}
                                    alt="Profile"
                                    fill
                                    className="rounded-full object-cover"
                                />
                                <label
                                    htmlFor="profile-image"
                                    className="absolute bottom-0 right-0 bg-[var(--accent)] rounded-full p-2 cursor-pointer hover:bg-[var(--accent-dark)] transition-colors"
                                >
                                    <Camera size={18} color="white" />
                                </label>
                                <input
                                    type="file"
                                    id="profile-image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            {profileImage && (
                                <SiteButton
                                    text={isSaving ? "Uploading..." : "Save Picture"}
                                    variant="filled"
                                    onClick={handleImageSubmit}
                                    disabled={isSaving}
                                    className="mt-2"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="col-span-1 md:col-span-2">
                    <div className="bg-white p-6 rounded-[16px]" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

                        <form onSubmit={handleProfileSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label htmlFor="firstname" className="block text-sm font-medium mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        value={profileData.firstname}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, firstname: e.target.value })
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lastname" className="block text-sm font-medium mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        value={profileData.lastname}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, lastname: e.target.value })
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, email: e.target.value })
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, phone: e.target.value })
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="address" className="block text-sm font-medium mb-1">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={profileData.address}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, address: e.target.value })
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end">
                                <SiteButton
                                    text={isSaving ? "Saving..." : "Save Changes"}
                                    variant="filled"
                                    type="submit"
                                    disabled={isSaving}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}