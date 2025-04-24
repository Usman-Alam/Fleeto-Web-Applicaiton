"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, MapPin } from 'lucide-react';
import SiteButton from '@components/SiteButton';

export default function OrderTrackingPage() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');
    const [currentStage, setCurrentStage] = useState(0);
    
    useEffect(() => {
        // Simulate order progress
        const timer1 = setTimeout(() => {
            setCurrentStage(1); // Move to in-transit
        }, 0.2 * 60 * 1000); // 10 minutes

        const timer2 = setTimeout(() => {
            setCurrentStage(2); // Move to delivered
        }, 0.4 * 60 * 1000); // 20 minutes

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const stages = [
        { name: 'Preparing Food', icon: '🍳' },
        { name: 'In-Transit', icon: '🚗' },
        { name: 'Delivered', icon: '✅' }
    ];

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] mb-[30px]">
                <div className="bg-white rounded-[16px] p-6 md:p-8" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                    {/* Order Number */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">Track Order</h1>
                        <p className="text-[var(--body)]">Order #{orderNumber}</p>
                    </div>

                    {/* Progress Tracker */}
                    <div className="relative mx-auto max-w-2xl mb-12">
                        {/* Progress Line */}
                        <div className="absolute top-[25px] left-[15%] right-[15%] h-[2px] bg-gray-200">
                            <div 
                                className="h-full bg-[var(--accent)] transition-all duration-500"
                                style={{ width: `${currentStage * 50}%` }}
                            />
                        </div>

                        {/* Stages */}
                        <div className="flex justify-between relative">
                            {stages.map((stage, index) => (
                                <div key={stage.name} className="flex flex-col items-center w-1/3">
                                    <div 
                                        className={`w-[50px] h-[50px] rounded-full flex items-center justify-center text-2xl
                                            ${index <= currentStage 
                                                ? 'bg-gradient-to-r from-[#F1C40F] to-[#D4AC0D] text-white' 
                                                : 'bg-gray-100 text-gray-400'
                                            } transition-all duration-500`}
                                    >
                                        {stage.icon}
                                    </div>
                                    <p className={`mt-3 text-center font-medium
                                        ${index <= currentStage ? 'text-[var(--accent)]' : 'text-gray-400'}`}
                                    >
                                        {stage.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* View on Map Button - Only show during transit */}
                    {currentStage === 1 && (
                        <div className="text-center">
                            <SiteButton
                                text="View on Maps"
                                variant="filled"
                                icon={<MapPin size={18} />}
                                onClick={() => window.open('https://maps.google.com', '_blank')}
                                className="px-8"
                            />
                        </div>
                    )}

                    {/* Estimated Time */}
                    <div className="mt-8 p-4 bg-[var(--bg2)] rounded-lg">
                        <p className="text-center text-[var(--body)]">
                            {currentStage === 0 && "Estimated preparation time: 10 minutes"}
                            {currentStage === 1 && "Estimated delivery time: 10 minutes"}
                            {currentStage === 2 && "Order has been delivered!"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// "use client";

// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { MapPin, Check } from 'lucide-react';
// import SiteButton from '@components/SiteButton';

// interface OrderTracking {
//     orderNumber: string;
//     status: 'preparing' | 'in-transit' | 'delivered';
//     currentStage: number;
//     startTime: string;
//     estimatedDeliveryTime: string;
//     location?: {
//         lat: number;
//         lng: number;
//     };
// }

// export default function OrderTrackingPage() {
//     const searchParams = useSearchParams();
//     const orderNumber = searchParams.get('orderNumber');
//     const [tracking, setTracking] = useState<OrderTracking | null>(null);
//     const [error, setError] = useState<string>('');
//     const [currentStage, setCurrentStage] = useState(0);

//     const stages = [
//         { name: 'Preparing Food', icon: '🍳' },
//         { name: 'In-Transit', icon: '🚗' },
//         { name: 'Delivered', icon: '✅' }
//     ];

//     useEffect(() => {
//         const fetchOrderStatus = async () => {
//             try {
//                 const response = await fetch(`/api/track-order?orderNumber=${orderNumber}`);
//                 const data = await response.json();

//                 if (!response.ok) {
//                     throw new Error(data.error || 'Failed to fetch order status');
//                 }

//                 setTracking(data);
//                 setCurrentStage(data.currentStage);
//             } catch (error) {
//                 setError('Failed to load order tracking');
//                 console.error('Error:', error);
//             }
//         };

//         // Initial fetch
//         if (orderNumber) {
//             fetchOrderStatus();
//         }

//         // Set up polling every 30 seconds
//         const interval = setInterval(() => {
//             if (orderNumber) {
//                 fetchOrderStatus();
//             }
//         }, 30000);

//         return () => clearInterval(interval);
//     }, [orderNumber]);

//     // Simulate progress (for demo purposes)
//     useEffect(() => {
//         const timer1 = setTimeout(() => {
//             setCurrentStage(1); // Move to in-transit
//         }, 1 * 60 * 1000); // 10 minutes

//         const timer2 = setTimeout(() => {
//             setCurrentStage(2); // Move to delivered
//         }, 2 * 60 * 1000); // 20 minutes

//         return () => {
//             clearTimeout(timer1);
//             clearTimeout(timer2);
//         };
//     }, []);

//     if (error) {
//         return (
//             <div className="flex flex-col items-center w-full">
//                 <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] mb-[30px]">
//                     <div className="bg-white rounded-[16px] p-6 text-center">
//                         <p className="text-red-500">{error}</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col items-center w-full">
//             <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] mb-[30px]">
//                 <div className="bg-white rounded-[16px] p-6 md:p-8" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
//                     {/* Order Number */}
//                     <div className="text-center mb-8">
//                         <h1 className="text-2xl font-bold mb-2">Track Order</h1>
//                         <p className="text-[var(--body)]">Order #{orderNumber}</p>
//                     </div>

//                     {/* Progress Tracker */}
//                     <div className="relative mx-auto max-w-2xl mb-12">
//                         {/* Progress Line */}
//                         <div className="absolute top-[25px] left-[15%] right-[15%] h-[2px] bg-gray-200">
//                             <div 
//                                 className="h-full bg-[var(--accent)] transition-all duration-500"
//                                 style={{ width: `${currentStage * 50}%` }}
//                             />
//                         </div>

//                         {/* Stages */}
//                         <div className="flex justify-between relative">
//                             {stages.map((stage, index) => (
//                                 <div key={stage.name} className="flex flex-col items-center w-1/3">
//                                     <div 
//                                         className={`w-[50px] h-[50px] rounded-full flex items-center justify-center text-2xl
//                                             ${index <= currentStage 
//                                                 ? 'bg-gradient-to-r from-[#F1C40F] to-[#D4AC0D] text-white' 
//                                                 : 'bg-gray-100 text-gray-400'
//                                             } transition-all duration-500`}
//                                     >
//                                         {stage.icon}
//                                     </div>
//                                     <p className={`mt-3 text-center font-medium
//                                         ${index <= currentStage ? 'text-[var(--accent)]' : 'text-gray-400'}`}
//                                     >
//                                         {stage.name}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* View on Map Button - Only show during transit */}
//                     {currentStage === 1 && tracking?.location && (
//                         <div className="text-center">
//                             <SiteButton
//                                 text="View on Maps"
//                                 variant="filled"
//                                 icon={<MapPin size={18} />}
//                                 onClick={() => window.open(
//                                     `https://www.google.com/maps?q=${tracking.location.lat},${tracking.location.lng}`,
//                                     '_blank'
//                                 )}
//                                 className="px-8"
//                             />
//                         </div>
//                     )}

//                     {/* Estimated Time */}
//                     <div className="mt-8 p-4 bg-[var(--bg2)] rounded-lg">
//                         <p className="text-center text-[var(--body)]">
//                             {currentStage === 0 && "Estimated preparation time: 10 minutes"}
//                             {currentStage === 1 && "Estimated delivery time: 10 minutes"}
//                             {currentStage === 2 && "Order has been delivered!"}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }