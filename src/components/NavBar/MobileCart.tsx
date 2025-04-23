"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useCart } from "@contexts/CartContext";
import SiteButton from "@components/SiteButton";

interface MobileCartProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    pathname: string;
    router: AppRouterInstance;
}

const MobileCart = forwardRef<HTMLDivElement, MobileCartProps>(
    function MobileCart({ isOpen, setIsOpen, pathname, router }, ref) {
        const { cartItems, updateQuantity } = useCart();

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
            <div
                ref={ref}
                className="fixed top-[70px] right-4 left-4 bg-white shadow-lg rounded-md z-50 py-3 px-4 max-h-[80vh] overflow-auto"
            >
                <h5 className="text-[18px] font-medium mb-3">Your Cart</h5>

                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Your cart is empty</p>
                ) : (
                    <>
                        <div>
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
        );
    }
);

export default MobileCart;