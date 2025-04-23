interface DormDropToggleProps {
    isDormDrop: boolean;
    setIsDormDrop: (value: boolean) => void;
}

export default function DormDropToggle({ isDormDrop, setIsDormDrop }: DormDropToggleProps) {
    return (
        <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-bold">Dorm Drop Service</h2>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isDormDrop}
                        onChange={(e) => setIsDormDrop(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-[var(--bg3)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                </label>
            </div>

            <div className="bg-[var(--bg2)] p-3 rounded-md mb-4">
                <div className="font-medium">Campus Delivery to Your Dorm</div>
                <div className="text-sm text-[var(--body)] mt-1">
                    Our delivery person will bring your order directly to your dorm room.
                </div>
                <div className="text-sm font-medium mt-2 text-[var(--accent)]">
                    Additional fee: $0.99
                </div>
            </div>
        </div>
    );
}