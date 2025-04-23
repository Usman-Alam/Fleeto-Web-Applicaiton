import { Coins } from "lucide-react";
import SiteButton from "@components/SiteButton";

interface OrderTotalProps {
    subtotal: number;
    deliveryMethod: "standard" | "express";
    baseDeliveryFee: number;
    isDormDrop: boolean;
    dormDropFee: number;
    tax: number;
    coinsToUse: number;
    coinDiscount: number;
    total: number;
    isPlacingOrder: boolean;
    error?: string;
    onPlaceOrder: () => void;
    onContinueShopping: () => void;
}

export default function OrderTotal({
    subtotal,
    deliveryMethod,
    baseDeliveryFee,
    isDormDrop,
    dormDropFee,
    tax,
    coinsToUse,
    coinDiscount,
    total,
    isPlacingOrder,
    error,
    onPlaceOrder,
    onContinueShopping
}: OrderTotalProps) {
    return (
        <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
            <h2 className="text-[20px] font-bold mb-4">Order Total</h2>

            <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between">
                    <span className="text-[var(--body)]">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* Base delivery fee */}
                <div className="flex justify-between">
                    <span className="text-[var(--body)]">
                        {deliveryMethod === "standard" ? "Standard Delivery" : "Express Delivery"}
                    </span>
                    <span>${baseDeliveryFee.toFixed(2)}</span>
                </div>

                {/* DormDrop fee if applicable */}
                {isDormDrop && (
                    <div className="flex justify-between">
                        <span className="text-[var(--body)]">Dorm Drop Service</span>
                        <span>${dormDropFee.toFixed(2)}</span>
                    </div>
                )}

                {/* Tax */}
                <div className="flex justify-between">
                    <span className="text-[var(--body)]">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>

                {/* FleetoCoins discount if applied */}
                {coinsToUse > 0 && (
                    <div className="flex justify-between text-[var(--accent)]">
                        <span className="flex items-center gap-1">
                            <Coins size={16} />
                            <span>FleetoCoins Discount</span>
                            <span className="text-xs text-[var(--body)] ml-1">({coinsToUse} coins)</span>
                        </span>
                        <span>-${coinDiscount.toFixed(2)}</span>
                    </div>
                )}

                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <SiteButton
                text={isPlacingOrder ? "Processing..." : "Place Order"}
                variant="filled"
                fullWidth
                onClick={onPlaceOrder}
                disabled={isPlacingOrder}
            />

            <button
                className="w-full text-center mt-3 text-[var(--accent)] hover:underline"
                onClick={onContinueShopping}
            >
                Continue Shopping
            </button>
        </div>
    );
}