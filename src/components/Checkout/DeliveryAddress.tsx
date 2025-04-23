interface DeliveryAddressProps {
    address: string;
    setAddress: (address: string) => void;
    error?: string;
}

export default function DeliveryAddress({ address, setAddress, error }: DeliveryAddressProps) {
    return (
        <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
            <h2 className="text-[20px] font-bold mb-4">Delivery Address</h2>

            <div>
                <textarea
                    placeholder="Enter your delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className={`w-full p-3 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        </div>
    );
}