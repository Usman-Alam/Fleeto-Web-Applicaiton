interface FleetoCoinsSectionProps {
    availableCoins: number;
    coinsToUse: number;
    setCoinsToUse: (coins: number) => void;
    maxUsableCoins: number;
    coinDiscount: number;
    projectedCoinsToEarn: number;
    errors?: string;
}

export default function FleetoCoinsSection({
    availableCoins,
    coinsToUse,
    setCoinsToUse,
    maxUsableCoins,
    coinDiscount,
    projectedCoinsToEarn,
    errors
}: FleetoCoinsSectionProps) {
    const handleCoinChange = (value: number) => {
        // Ensure value doesn't exceed available coins or max usable coins
        const maxCoins = Math.min(availableCoins, maxUsableCoins);
        setCoinsToUse(Math.min(value, maxCoins));
    };

    return (
        <div className="bg-white rounded-[16px] p-6 mb-4" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
            <h3 className="text-lg font-semibold mb-2">Use FleetoCoins</h3>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={coinsToUse}
                    onChange={(e) => handleCoinChange(Number(e.target.value))}
                    min={0}
                    max={maxUsableCoins}
                    className="w-24 p-2 border rounded"
                />
                <span className="text-sm text-gray-500">
                    Available: {availableCoins} coins
                </span>
            </div>
            <div className="mt-2">
                <p className="text-sm text-gray-500">
                    10 coins = $1 discount (Max: ${(maxUsableCoins/10).toFixed(2)})
                </p>
                {coinDiscount > 0 && (
                    <p className="text-sm text-[var(--accent)]">
                        Current discount: ${coinDiscount.toFixed(2)}
                    </p>
                )}
                {projectedCoinsToEarn > 0 && (
                    <p className="text-sm text-green-600">
                        You will earn {projectedCoinsToEarn} coins from this order
                    </p>
                )}
            </div>
            {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}
        </div>
    );
}