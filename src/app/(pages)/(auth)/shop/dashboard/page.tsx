"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useAuth } from "@contexts/AuthContext";

type Item = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available: boolean;
};

type Shop = {
    id: string;
    name: string;
    ownerName: string;
    image: string;
};

export default function ShopDashboard() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [shop, setShop] = useState<Shop | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [shopImageFile, setShopImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Form state for new/editing item
    const [itemForm, setItemForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        available: true,
        image: null as File | null,
        imagePreview: "",
    });

    // Authentication check
    useEffect(() => {
        // First wait for auth to finish loading
        if (authLoading) return;

        // If user is not authenticated, redirect to login
        if (!isAuthenticated) {
            router.push("/shop/login");
            return;
        }

        // Check if the user has the restaurant role
        if (user?.role !== "restaurant" && user?.role !== "admin") {
            // Not a shop owner or admin, redirect to login
            router.push("/shop/login");
            return;
        }

        // If authenticated, fetch shop data
        const fetchShopData = async () => {
            try {
                setLoading(true);

                // Fetch shop details
                const shopResponse = await fetch("/api/shop/details");

                if (!shopResponse.ok) {
                    if (shopResponse.status === 401) {
                        router.push("/shop/login");
                        return;
                    }
                    throw new Error("Failed to fetch shop details");
                }

                const shopData = await shopResponse.json();
                setShop(shopData.shop);

                // Fetch shop items
                const itemsResponse = await fetch(`/api/shop/items`);
                if (!itemsResponse.ok) throw new Error("Failed to fetch shop items");

                const itemsData = await itemsResponse.json();
                setItems(itemsData.items);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchShopData();
    }, [isAuthenticated, authLoading, user, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // File size validation (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File too large. Maximum size is 5MB.");
            return;
        }

        // File type validation
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            alert("Only JPEG, PNG and WebP images are allowed.");
            return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        setItemForm({
            ...itemForm,
            image: file,
            imagePreview: previewUrl,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setItemForm({ ...itemForm, [name]: checked });
        } else {
            setItemForm({ ...itemForm, [name]: value });
        }
    };

    const openAddModal = () => {
        setSelectedItem(null);
        setItemForm({
            name: "",
            description: "",
            price: "",
            category: "",
            available: true,
            image: null,
            imagePreview: "",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: Item) => {
        setSelectedItem(item);
        setItemForm({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            category: item.category,
            available: item.available,
            image: null,
            imagePreview: item.image,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", itemForm.name);
            formData.append("description", itemForm.description);
            formData.append("price", itemForm.price);
            formData.append("category", itemForm.category);
            formData.append("available", itemForm.available.toString());

            if (itemForm.image) {
                formData.append("image", itemForm.image);
            }

            // If editing an existing item
            if (selectedItem) {
                formData.append("id", selectedItem.id);

                const response = await fetch(`/api/shop/items/${selectedItem.id}`, {
                    method: "PUT",
                    body: formData,
                });

                if (!response.ok) throw new Error("Failed to update item");

                // Update the items state with the edited item
                const updatedItemData = await response.json();
                setItems(items.map(item =>
                    item.id === selectedItem.id ? updatedItemData.item : item
                ));
            }
            // If adding a new item
            else {
                const response = await fetch("/api/shop/items", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) throw new Error("Failed to add item");

                // Add the new item to the items state
                const newItemData = await response.json();
                setItems([...items, newItemData.item]);
            }

            // Close modal after successful submission
            setIsModalOpen(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : "An error occurred");
            console.error(err);
        }
    };

    const handleDelete = async (itemId: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const response = await fetch(`/api/shop/items/${itemId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete item");

            // Remove the deleted item from the items state
            setItems(items.filter(item => item.id !== itemId));
        } catch (err) {
            alert(err instanceof Error ? err.message : "An error occurred");
            console.error(err);
        }
    };

    const handleShopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // File size validation (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File too large. Maximum size is 5MB.");
            return;
        }

        // File type validation
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            alert("Only JPEG, PNG and WebP images are allowed.");
            return;
        }

        setShopImageFile(file);
    };

    const handleUploadShopImage = async () => {
        if (!shopImageFile || !shop?.id) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("shopId", shop.id);
            formData.append("image", shopImageFile);

            const response = await fetch("/api/shop/update-image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update shop image");
            }

            const data = await response.json();

            // Update the shop state with the new image URL
            setShop({
                ...shop,
                image: data.imageUrl
            });

            setShopImageFile(null);
            alert("Shop image updated successfully");

        } catch (error) {
            console.error("Error updating shop image:", error);
            alert("Failed to update shop image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Display loading state during authentication check
    if (authLoading || loading) return <div className="container mx-auto p-8 text-center">Loading shop data...</div>;

    // Show error if any
    if (error) return <div className="container mx-auto p-8 text-center text-red-500">Error: {error}</div>;

    // If we don't have shop data yet, return empty content (redirecting will happen via useEffect)
    if (!shop && !loading) return <div className="container mx-auto p-8 text-center">Redirecting...</div>;

    // Render the dashboard if everything is good
    return (
        <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] flex flex-col items-center justify-top w-full">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2">Welcome, {shop.ownerName}!</h1>
                <h2 className="text-xl text-gray-700">{shop.name} Dashboard</h2>
            </div>

            {/* Shop Display Image Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Shop Display Image</h2>
                <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Preview current image */}
                    <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden bg-gray-100 relative">
                        <Image
                            src={shop?.image || "/no_shop.png"}
                            alt={shop?.name || "Shop"}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Upload controls */}
                    <div className="flex-1">
                        <p className="text-gray-600 mb-4">
                            This image will be displayed on your shop page and in search results.
                            Use a high-quality image with a 16:9 aspect ratio for best results.
                        </p>

                        <div className="flex flex-col gap-4">
                            <input
                                type="file"
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handleShopImageChange}
                                className="hidden"
                                id="shop-image-upload"
                            />
                            <label
                                htmlFor="shop-image-upload"
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md cursor-pointer inline-block w-fit"
                            >
                                Select New Image
                            </label>

                            {shopImageFile && (
                                <div className="text-sm text-gray-600">
                                    Selected: {shopImageFile.name}
                                    <button
                                        onClick={() => setShopImageFile(null)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {shopImageFile && (
                                <button
                                    onClick={handleUploadShopImage}
                                    disabled={isUploading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-fit"
                                >
                                    {isUploading ? "Uploading..." : "Update Shop Image"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">Total Items</h3>
                    <p className="text-3xl font-bold">{items.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">Available Items</h3>
                    <p className="text-3xl font-bold">{items.filter(item => item.available).length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">Unavailable Items</h3>
                    <p className="text-3xl font-bold">{items.filter(item => !item.available).length}</p>
                </div>
            </div>

            {/* Item Management Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <h2 className="text-xl font-bold mb-4 md:mb-0">Manage Items</h2>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={openAddModal}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                        >
                            <FaPlus className="mr-2" /> Add New Item
                        </button>
                    </div>
                </div>

                {/* Items Table */}
                {filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {items.length === 0 ? "No items found. Add your first item!" : "No items match your search."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 mr-4">
                                                    <Image
                                                        width={40}
                                                        height={40}
                                                        className="h-10 w-10 rounded-md object-cover"
                                                        src={item.image || "/no_item.png"}
                                                        alt={item.name}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 max-w-xs truncate">{item.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{item.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}>
                                                {item.available ? "Available" : "Unavailable"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <FaEdit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {selectedItem ? "Edit Item" : "Add New Item"}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* Item Name */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Item Name*
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={itemForm.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. Chicken Tikka"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price*
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={itemForm.price}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category*
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            required
                                            value={itemForm.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. Main Course, Appetizer"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description*
                                        </label>
                                        <textarea
                                            name="description"
                                            required
                                            value={itemForm.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Describe your item..."
                                        />
                                    </div>

                                    {/* Availability */}
                                    <div className="col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="available"
                                                name="available"
                                                checked={itemForm.available}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                                                Item is available for order
                                            </label>
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Item Image {selectedItem ? "(Leave empty to keep current image)" : "*"}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png, image/webp"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required={!selectedItem}
                                        />
                                        {itemForm.imagePreview && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                                                <Image
                                                    src={itemForm.imagePreview}
                                                    alt="Preview"
                                                    width={100}
                                                    height={100}
                                                    className="h-24 w-24 object-cover rounded-md"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        {selectedItem ? "Update Item" : "Add Item"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}