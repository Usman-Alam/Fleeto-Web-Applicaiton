type PaymentMethod = "card" | "cash";

interface PaymentMethodProps {
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
}

export default function PaymentMethodComponent({ paymentMethod, setPaymentMethod }: PaymentMethodProps) {
    return (
        <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
            <h2 className="text-[20px] font-bold mb-4">Payment Method</h2>

            <div className="flex flex-col gap-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white">
                    <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="mr-3"
                    />
                    <div className="flex-1">
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-[var(--body)]">Pay securely with your card</div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">MC</span>
                        </div>
                    </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white">
                    <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                        className="mr-3"
                    />
                    <div className="flex-1">
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-[var(--body)]">Pay when your order arrives</div>
                    </div>
                    <div className="w-6 h-6 text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                    </div>
                </label>
            </div>
        </div>
    );
}