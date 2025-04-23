type DeliveryMethod = "standard" | "express";

interface DeliveryMethodProps {
    deliveryMethod: DeliveryMethod;
    setDeliveryMethod: (method: DeliveryMethod) => void;
}

export default function DeliveryMethodComponent({
    deliveryMethod,
    setDeliveryMethod
}: DeliveryMethodProps) {
    return (
        <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
            <h2 className="text-[20px] font-bold mb-4">Delivery Method</h2>

            <div className="flex flex-col gap-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white">
                    <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === "standard"}
                        onChange={() => setDeliveryMethod("standard")}
                        className="mr-3"
                    />
                    <div className="flex-1">
                        <div className="font-medium">Standard Delivery</div>
                        <div className="text-sm text-[var(--body)]">Estimated delivery: 30-45 minutes</div>
                    </div>
                    <div className="font-medium">$1.99</div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white">
                    <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === "express"}
                        onChange={() => setDeliveryMethod("express")}
                        className="mr-3"
                    />
                    <div className="flex-1">
                        <div className="font-medium">Express Delivery</div>
                        <div className="text-sm text-[var(--body)]">Estimated delivery: 15-20 minutes</div>
                    </div>
                    <div className="font-medium">$4.99</div>
                </label>
            </div>
        </div>
    );
}