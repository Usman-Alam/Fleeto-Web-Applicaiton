"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@contexts/CartContext";
import SiteButton from "@components/SiteButton";

interface CartDropdownProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const CartDropdown = forwardRef<HTMLDivElement, CartDropdownProps>(
    function CartDropdown({ isOpen, setIsOpen }, ref) {
        const router = useRouter();
        const pathname = usePathname();
        const { cartItems, updateQuantity } = useCart();

        const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        const handleUpdateQuantity = (id: string, newQuantity: number, e?: React.MouseEvent) => {
            e?.preventDefault();
            e?.stopPropagation();
            updateQuantity(id, newQuantity);
        };

        return (
            <div className="relative" ref={ref}>
                <button
                    className="p-1 rounded-full"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="relative w-[24px] h-[24px]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>

                        {cartItemCount > 0 && (
                            <div className="absolute -bottom-1 -right-1 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
                                {cartItemCount > 9 ? '9+' : cartItemCount}
                            </div>
                        )}
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute top-[40px] right-0 bg-white shadow-lg rounded-md w-[320px] z-50 py-3 px-4">
                        <h5 className="text-[18px] font-medium mb-3">Your Cart</h5>

                        {cartItems.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Your cart is empty</p>
                        ) : (
                            <>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {cartItems.map((item, index) => (
                                        <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100">
                                            <div className="text-gray-500 text-sm">{index + 1}.</div>
                                            <div className="relative w-[40px] h-[40px] rounded-md overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-gray-600 text-sm">${item.price.toFixed(2)}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                                                    data-cart-control="true"
                                                    onClick={(e) => handleUpdateQuantity(item.id, item.quantity - 1, e)}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                                                    data-cart-control="true"
                                                    onClick={(e) => handleUpdateQuantity(item.id, item.quantity + 1, e)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex justify-between mb-3">
                                        <span className="font-medium">Total:</span>
                                        <span className="font-bold">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <SiteButton
                                        text={cartItems.length > 0 ? "Proceed to Checkout" : "Browse Shops"}
                                        variant="filled"
                                        fullWidth
                                        data-cart-proceed="true"
                                        onClick={() => {
                                            if (cartItems.length > 0) {
                                                router.push("/checkout");
                                            } else {
                                                if (pathname === "/") {
                                                    const shopsElement = document.getElementById("shops");
                                                    if (shopsElement) {
                                                        shopsElement.scrollIntoView({ behavior: "smooth" });
                                                    }
                                                } else {
                                                    router.push("/#shops");
                                                }
                                            }
                                            setIsOpen(false);
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

export default CartDropdown;