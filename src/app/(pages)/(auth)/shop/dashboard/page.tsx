"use client";

import { useState, useEffect } from "react";    
import { useRouter } from "next/navigation";
import { FaPlus, FaMinus } from "react-icons/fa";

// type MenuItem = {
//     dishname: string;
//     dishdescription: string;
//     dishprice: number;
// };

export default function ShopDashboard() {
    const router = useRouter();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [shopName, setShopName] = useState("");

    // Form states
    const [menuForm, setMenuForm] = useState({
        dishname: "",
        dishdescription: "",
        dishprice: "",
    });

    const [removeForm, setRemoveForm] = useState({
        dishname: ""
    });

    // Authentication check
    useEffect(() => {
        const checkAuth = () => {
            const role = localStorage.getItem('role');
            const email = localStorage.getItem('email');
            const shopname = localStorage.getItem('shopname');

            if (!role || role !== 'vendor' || !email) {
                router.push('/shop/login');
                return false;
            }
            
            // Set shop name for welcome message
            if (shopname) {
                setShopName(shopname);
            }
            
            setLoading(false);
            return true;
        };

        checkAuth();
    }, [router]);

    const handleLogout = () => {
        // Clear all localStorage
        localStorage.clear();
        // Redirect to login page
        router.push('/shop/login');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMenuForm(prev => ({ ...prev, [name]: value }));
    };

    const handleRemoveInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRemoveForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const shopname = localStorage.getItem('shopname');
            if (!shopname) {
                throw new Error("Shop information not found");
            }

            const response = await fetch('/api/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shopname,
                    menuItem: {
                        dishname: menuForm.dishname,
                        dishdescription: menuForm.dishdescription,
                        dishprice: parseFloat(menuForm.dishprice)
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add menu item');
            }

            alert("Item added successfully!");
            setIsAddModalOpen(false);
            setMenuForm({
                dishname: "",
                dishdescription: "",
                dishprice: "",
            });
        } catch (err) {
            alert(err instanceof Error ? err.message : "An error occurred");
            console.error(err);
        }
    };

    const handleRemoveSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const shopname = localStorage.getItem('shopname');
            if (!shopname) {
                throw new Error("Shop information not found");
            }

            const response = await fetch('/api/removeItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shopname,
                    dishname: removeForm.dishname
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove menu item');
            }

            alert("Item removed successfully!");
            setIsRemoveModalOpen(false);
            setRemoveForm({ dishname: "" });
        } catch (err) {
            alert(err instanceof Error ? err.message : "An error occurred");
            console.error(err);
        }
    };

    if (loading) {
        return <div className="container mx-auto p-8 text-center">Loading...</div>;
    }

    return (
        <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] flex flex-col items-center justify-top w-full">
            {/* Welcome Message - Moved to top */}
            <div className="bg-[var(--bg2)] rounded-lg p-8 mb-8 w-full text-center">
                <h1 className="text-4xl font-bold text-[var(--accent)] mb-4">
                    Welcome to your dashboard
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                    Managing <span className="font-semibold text-[var(--accent)]">{shopName}</span>
                </p>
                <p className="text-base text-gray-500">
                    Here you can add or remove items from your menu
                </p>
            </div>

            {/* Menu Management Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Menu Management</h2>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-white text-[var(--accent)] border-2 border-[var(--accent)] px-4 py-2 rounded-md hover:bg-[var(--accent)] hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <FaPlus /> Add Item
                        </button>
                        <button 
                            onClick={() => setIsRemoveModalOpen(true)}
                            className="bg-white text-red-500 border-2 border-red-500 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <FaMinus /> Remove Item
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="bg-white text-red-500 border-2 border-red-500 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Add Item</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item Name*
                                </label>
                                <input
                                    type="text"
                                    name="dishname"
                                    required
                                    value={menuForm.dishname}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description*
                                </label>
                                <textarea
                                    name="dishdescription"
                                    required
                                    value={menuForm.dishdescription}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price*
                                </label>
                                <input
                                    type="number"
                                    name="dishprice"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={menuForm.dishprice}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-white text-[var(--accent)] border-2 border-[var(--accent)] px-4 py-2 rounded-md hover:bg-[var(--accent)] hover:text-white transition-colors"
                                >
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Remove Item Modal */}
            {isRemoveModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Remove Item</h2>
                        <form onSubmit={handleRemoveSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item Name to Remove*
                                </label>
                                <input
                                    type="text"
                                    name="dishname"
                                    required
                                    value={removeForm.dishname}
                                    onChange={handleRemoveInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter exact item name to remove"
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsRemoveModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-white text-red-500 border-2 border-red-500 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    Remove Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}