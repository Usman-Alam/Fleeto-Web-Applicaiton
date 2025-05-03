interface DormInformationProps {
    hostelName: string;
    setHostelName: (name: string) => void;
    roomNumber: string;
    setRoomNumber: (number: string) => void;
    errors: {
        hostelName?: string;
        roomNumber?: string;
    };
}

export default function DormInformation({
    hostelName,
    setHostelName,
    roomNumber,
    setRoomNumber,
    errors
}: DormInformationProps) {
    return (
        <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
            <h2 className="text-[20px] font-bold mb-4">Dorm Information</h2>

            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="hostelName" className="block text-sm font-medium text-[var(--body)] mb-1">
                        Hostel Name
                    </label>
                    <input
                        type="text"
                        id="hostelName"
                        placeholder="e.g. M1, F3"
                        value={hostelName}
                        onChange={(e) => setHostelName(e.target.value.toUpperCase())}
                        className={`w-full p-3 border rounded-lg ${errors.hostelName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <p className="text-xs text-[var(--body)] mt-1">
                        Valid formats: M1-M7 for male hostels, F1-F6 for female hostels
                    </p>
                    {errors.hostelName && (
                        <p className="text-red-500 text-sm mt-1">{errors.hostelName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-[var(--body)] mb-1">
                        Room Number
                    </label>
                    <input
                        type="text"
                        id="roomNumber"
                        placeholder="e.g. 101, 305"
                        value={roomNumber}
                        onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, '');
                            // Limit to 3 digits
                            setRoomNumber(value.slice(0, 3));
                        }}
                        maxLength={3}
                        className={`w-full p-3 border rounded-lg ${errors.roomNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <p className="text-xs text-[var(--body)] mt-1">
                        Room number must be exactly 3 digits
                    </p>
                    {errors.roomNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>
                    )}
                </div>
            </div>
        </div>
    );
}