import { useState } from "react";
import { Coins } from "lucide-react";

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
    const [coinInputValue, setCoinInputValue] = useState(coinsToUse.toString());

    const roundToNearestTwenty = (value: number) => {
        return Math.floor(value / 20) * 20;
    };

    const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value);
        setCoinInputValue(event.target.value);

        if (!isNaN(newValue)) {
            const validValue = Math.min(roundToNearestTwenty(newValue), maxUsableCoins);
            setCoinsToUse(validValue);
            setCoinInputValue(validValue.toString());
        }
    };

    const applyMaxCoins = () => {
        setCoinsToUse(roundToNearestTwenty(maxUsableCoins));
        setCoinInputValue(roundToNearestTwenty(maxUsableCoins).toString());
    };

    const resetCoins = () => {
        setCoinsToUse(0);
        setCoinInputValue("0");
    };

    return (
        <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-bold flex items-center">
                    <Coins className="mr-2 text-[var(--accent)]" size={24} />
                    FleetoCoins
                </h2>
            </div>

            {availableCoins > 0 ? (
                <div>
                    <div className="bg-[var(--bg2)] p-4 rounded-lg mb-4 border border-[var(--shadow)]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Available Balance:</span>
                            <span className="text-[var(--accent)] font-bold">{availableCoins} Coins</span>
                        </div>
                        <p className="text-sm text-[var(--body)] mb-1">
                            You can use your FleetoCoins to pay for your order.
                        </p>
                        <p className="text-sm font-medium text-[var(--body)]">
                            Exchange Rate: 20 FleetoCoins = $1 off
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[var(--body)] mb-1">
                            Use FleetoCoins
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="0"
                                max={maxUsableCoins}
                                step="20"
                                value={coinsToUse}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setCoinsToUse(val);
                                    setCoinInputValue(val.toString());
                                }}
                                className="w-full h-2 bg-[var(--bg3)] rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center mt-3 gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    value={coinInputValue}
                                    onChange={handleCoinChange}
                                    className="w-full p-2 pr-12 border rounded"
                                    min="0"
                                    max={maxUsableCoins}
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    coins
                                </span>
                            </div>
                            <button
                                onClick={applyMaxCoins}
                                className="px-3 py-2 bg-[var(--bg2)] text-[var(--body)] rounded hover:bg-[var(--bg3)]"
                            >
                                Max
                            </button>
                            <button
                                onClick={resetCoins}
                                className="px-3 py-2 bg-[var(--bg3)] text-[var(--body)] rounded hover:bg-[var(--shadow-hover)]"
                            >
                                Reset
                            </button>
                        </div>

                        {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}

                        {coinsToUse > 0 && (
                            <div className="mt-2 p-2 bg-[var(--bg2)] text-[var(--accent)] rounded-md">
                                You&apos;ll save ${coinDiscount.toFixed(2)} with {coinsToUse} coins
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-[var(--bg2)] p-4 rounded-lg text-[var(--body)]">
                    You don&apos;t have any FleetoCoins yet. Complete orders to earn coins!
                </div>
            )}

            <div className="mt-4 bg-[var(--bg2)] p-3 rounded-md border border-[var(--shadow)]">
                <div className="font-medium text-[var(--body)]">You&apos;ll earn with this order:</div>
                <div className="flex items-center gap-2 mt-1">
                    <Coins size={16} className="text-[var(--accent)]" />
                    <span className="font-bold text-[var(--accent)]">
                        {projectedCoinsToEarn} FleetoCoins
                    </span>
                    <span className="text-sm text-[var(--body)]">
                        (1 coin per $20 spent)
                    </span>
                </div>
            </div>
        </div>
    );
}