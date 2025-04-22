"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SiteButton from "@components/SiteButton";
import { useAuth } from "@contexts/AuthContext";
import admin_hero from "@public/admin_hero.png";

// Sample shop requests data - using generic terminology
const initialShopRequests = [
    {
        id: "req1",
        name: "Spicy Corner",
        owner: "Ahmed Khan",
        email: "ahmed@spicycorner.com",
        phone: "+92 300 1234567",
        type: "Food & Beverage",
        date: "2025-04-20",
        status: "pending"
    },
    {
        id: "req2",
        name: "Burger Hub",
        owner: "Fatima Ali",
        email: "fatima@burgerhub.com",
        phone: "+92 301 9876543",
        type: "Food & Beverage",
        date: "2025-04-19",
        status: "pending"
    },
    {
        id: "req3",
        name: "Green Leaf Market",
        owner: "Hassan Raza",
        email: "hassan@greenleaf.com",
        phone: "+92 333 5554443",
        type: "Retail",
        date: "2025-04-18",
        status: "pending"
    }
];

// Sample FAQs data
const initialFaqs = [
    {
        id: "faq1",
        question: "How does Fleeto delivery work?",
        answer: "Our delivery partners pick up your order from the shop and deliver it straight to your doorstep."
    },
    {
        id: "faq2",
        question: "What are the delivery hours?",
        answer: "We deliver from 8:00 AM to 11:00 PM, seven days a week."
    },
    {
        id: "faq3",
        question: "How much is the delivery fee?",
        answer: "Standard delivery is $1.99, express delivery is $4.99, and dorm drop service is an additional $0.99."
    }
];

export default function AdminDashboard() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [shopRequests, setShopRequests] = useState(initialShopRequests);
    const [faqs, setFaqs] = useState(initialFaqs);
    const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
    const [editingFaq, setEditingFaq] = useState<string | null>(null);
    const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
    const [isLoading, setIsLoading] = useState(true);

    // Move the authentication check to useEffect
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
            // Redirect to admin login if not authenticated as admin
            router.push("/admin/login");
        }
        setIsLoading(false);
    }, [isAuthenticated, user, router, isLoading]);

    // Rest of your component functions
    const handleAddShopClick = () => {
        router.push("/admin/add-shop");
    };

    const handleViewDetails = (id: string) => {
        setExpandedRequest(expandedRequest === id ? null : id);
    };

    const handleRequestAction = (id: string, action: "accept" | "reject") => {
        // In a real app, you'd call an API to update the status
        setShopRequests(
            shopRequests.map(req =>
                req.id === id ? { ...req, status: action } : req
            )
        );
        setExpandedRequest(null);
    };

    const handleEditFaq = (id: string) => {
        setEditingFaq(id);
    };

    const handleUpdateFaq = (id: string, updatedFaq: { question: string; answer: string }) => {
        setFaqs(faqs.map(faq =>
            faq.id === id ? { ...faq, ...updatedFaq } : faq
        ));
        setEditingFaq(null);
    };

    const handleDeleteFaq = (id: string) => {
        setFaqs(faqs.filter(faq => faq.id !== id));
    };

    const handleAddFaq = () => {
        if (newFaq.question.trim() && newFaq.answer.trim()) {
            setFaqs([
                ...faqs,
                {
                    id: `faq${Date.now()}`,
                    question: newFaq.question,
                    answer: newFaq.answer
                }
            ]);
            setNewFaq({ question: "", answer: "" });
        }
    };

    // If still loading or not authenticated, show loading or nothing
    if (isLoading) {
        return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
    }

    // If not authenticated (will redirect in useEffect), don't render the dashboard content
    if (!isAuthenticated || user?.role !== "admin") {
        return null;
    }

    // Normal component render with dashboard UI
    return (
        <div className="flex flex-col items-center w-full">
            {/* Hero Section */}
            <section className="w-full px-4 md:px-8 lg:px-0 lg:w-[var(--section-width)] mt-[var(--page-top-padding)] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 mb-12">
                <div className="flex flex-col items-center md:items-start w-full md:w-1/2 lg:w-[500px] gap-6">
                    <div className="flex flex-col items-center md:items-start w-full gap-4">
                        <h1>
                            Welcome to <span className="text-[var(--accent)]">Admin Portal</span>
                        </h1>
                        <p>
                            Manage shops, track orders, and update content from this central dashboard.
                        </p>
                    </div>
                    <SiteButton
                        text="Add New Shop"
                        variant="filled"
                        onClick={handleAddShopClick}
                    />
                </div>

                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                    <Image
                        src={admin_hero}
                        alt="Admin Dashboard"
                        width={400}
                        height={300}
                        className="object-contain"
                    />
                </div>
            </section>

            {/* Shop Requests Section */}
            <section className="w-full px-4 md:px-8 lg:px-0 lg:w-[var(--section-width)] mb-12">
                <h2 className="text-2xl font-bold mb-6">Shop Join Requests</h2>

                {shopRequests.length === 0 ? (
                    <div className="bg-white rounded-[16px] p-6 text-center" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                        <p className="text-gray-500">No pending shop requests</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {shopRequests.map(request => (
                            <div
                                key={request.id}
                                className="bg-white rounded-[16px] p-6"
                                style={{ boxShadow: "0px 1px 10px var(--shadow)" }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">{request.name}</h3>
                                        <p className="text-gray-500">{request.type} • Requested on {new Date(request.date).toLocaleDateString()}</p>
                                        <p className="text-gray-700 mt-1">Owner: {request.owner}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm ${request.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                            request.status === "accept" ? "bg-green-100 text-green-800" :
                                                "bg-red-100 text-red-800"
                                            }`}>
                                            {request.status === "pending" ? "Pending" :
                                                request.status === "accept" ? "Approved" : "Rejected"}
                                        </span>

                                        <SiteButton
                                            text="View Details"
                                            variant="outlined"
                                            onClick={() => handleViewDetails(request.id)}
                                        />
                                    </div>
                                </div>

                                {expandedRequest === request.id && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p>{request.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p>{request.phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 mt-4">
                                            <SiteButton
                                                text="Reject"
                                                variant="outlined"
                                                className="bg-white text-red-500 border-red-500 hover:bg-red-50"
                                                onClick={() => handleRequestAction(request.id, "reject")}
                                            />
                                            <SiteButton
                                                text="Accept"
                                                variant="filled"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleRequestAction(request.id, "accept")}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* FAQs Management Section */}
            <section className="w-full px-4 md:px-8 lg:px-0 lg:w-[var(--section-width)] mb-12">
                <h2 className="text-2xl font-bold mb-6">Manage FAQs</h2>

                {/* Add new FAQ form */}
                <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                    <h3 className="text-xl font-semibold mb-4">Add New FAQ</h3>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="newQuestion" className="block text-sm font-medium mb-1">Question</label>
                            <input
                                type="text"
                                id="newQuestion"
                                value={newFaq.question}
                                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                                placeholder="Enter FAQ question"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)] focus:border-[var(--accent)]"
                            />
                        </div>

                        <div>
                            <label htmlFor="newAnswer" className="block text-sm font-medium mb-1">Answer</label>
                            <textarea
                                id="newAnswer"
                                value={newFaq.answer}
                                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                                placeholder="Enter FAQ answer"
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                            />
                        </div>

                        <div className="flex justify-end">
                            <SiteButton
                                text="Add FAQ"
                                variant="filled"
                                onClick={handleAddFaq}
                                disabled={!newFaq.question.trim() || !newFaq.answer.trim()}
                            />
                        </div>
                    </div>
                </div>

                {/* Existing FAQs list */}
                <div className="space-y-4">
                    {faqs.map(faq => (
                        <div
                            key={faq.id}
                            className="bg-white rounded-[16px] p-6"
                            style={{ boxShadow: "0px 1px 10px var(--shadow)" }}
                        >
                            {editingFaq === faq.id ? (
                                // Edit mode
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Question</label>
                                        <input
                                            type="text"
                                            value={faq.question}
                                            onChange={(e) => handleUpdateFaq(faq.id, { ...faq, question: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Answer</label>
                                        <textarea
                                            value={faq.answer}
                                            onChange={(e) => handleUpdateFaq(faq.id, { ...faq, answer: e.target.value })}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <SiteButton
                                            text="Cancel"
                                            variant="outlined"
                                            onClick={() => setEditingFaq(null)}
                                        />
                                        <SiteButton
                                            text="Save"
                                            variant="filled"
                                            onClick={() => setEditingFaq(null)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                // View mode
                                <>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold">{faq.question}</h3>
                                            <p className="text-gray-700 mt-2">{faq.answer}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditFaq(faq.id)}
                                                className="p-2 text-gray-500 hover:text-[var(--accent)]"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => handleDeleteFaq(faq.id)}
                                                className="p-2 text-gray-500 hover:text-red-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}