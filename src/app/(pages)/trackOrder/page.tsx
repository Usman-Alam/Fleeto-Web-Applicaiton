"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, MapPin } from 'lucide-react';
import SiteButton from '@components/SiteButton';
import { useRouter } from 'next/navigation';

export default function OrderTrackingPage() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');
    const router = useRouter();

    // Initialize currentStage from localStorage or default to 0
    const [currentStage, setCurrentStage] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`orderStage_${orderNumber}`);
            return saved ? parseInt(saved) : 0;
        }
        return 0;
    });

    var maxTime: number = Number(localStorage.getItem('maxDeliveryTime'))
    var prepareTime = maxTime / 2
    var inTransitTime = maxTime / 2

    useEffect(() => {
        let timer1: NodeJS.Timeout;
        let timer2: NodeJS.Timeout;

        // Set timers based on current stage
        if (currentStage === 0) {
            timer1 = setTimeout(() => {
                setCurrentStage(1);
                localStorage.setItem(`orderStage_${orderNumber}`, '1');
            }, (prepareTime / 120) * 60 * 1000); // 6 seconds
        }

        if (currentStage === 1) {
            timer2 = setTimeout(() => {
                setCurrentStage(2);
                localStorage.setItem(`orderStage_${orderNumber}`, '2');
            }, (inTransitTime / 60) * 60 * 1000); // 12 seconds
        }

        return () => {
            if (timer1) clearTimeout(timer1);
            if (timer2) clearTimeout(timer2);
        };
    }, [orderNumber, currentStage]);

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
                                onClick={() => router.push('/request')}
                                className="px-8"
                            />
                        </div>
                    )}

                    {/* Estimated Time */}
                    <div className="mt-8 p-4 bg-[var(--bg2)] rounded-lg">
                        <p className="text-center text-[var(--body)]">
                            {currentStage === 0 && `Estimated preparation time: ${prepareTime} minutes`}
                            {currentStage === 1 && `Estimated delivery time: ${inTransitTime} minutes`}
                            {currentStage === 2 && "Order has been delivered!"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}