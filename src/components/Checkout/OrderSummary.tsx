import Image from "next/image";
import SiteButton from "@components/SiteButton";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { CartItem } from "@contexts/CartContext";

interface OrderSummaryProps {
    cartItems: CartItem[];
    updateQuantity: (id: string, quantity: number) => void;
    router: AppRouterInstance;
}

export default function OrderSummary({ cartItems, updateQuantity, router }: OrderSummaryProps) {
    return (
        <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
            <h2 className="text-[20px] font-bold mb-4">Order Summary</h2>

            {cartItems.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-[var(--body)] mb-4">Your cart is empty</p>
                    <SiteButton
                        text="Browse Shops"
                        variant="outlined"
                        onClick={() => router.push("/")}
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <div className="w-16 h-16 rounded-md overflow-hidden bg-[var(--bg3)] relative">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                            <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-[var(--body)]">${item.price.toFixed(2)}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className="w-7 h-7 rounded-full bg-[var(--bg3)] flex items-center justify-center"
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                >
                                    <span>-</span>
                                </button>

                                <span className="w-6 text-center">{item.quantity}</span>

                                <button
                                    className="w-7 h-7 rounded-full bg-[var(--bg3)] flex items-center justify-center"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                    <span>+</span>
                                </button>
                            </div>

                            <div className="font-medium w-20 text-right">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>

                            <button
                                className="text-[var(--body)] hover:text-red-500"
                                onClick={() => updateQuantity(item.id, 0)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}