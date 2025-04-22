"use client";

import { useState, useRef, useEffect } from 'react';

interface FAQProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

export default function FAQ({ question, answer, isOpen, onClick }: FAQProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    // Measure the content height when it changes or when isOpen changes
    useEffect(() => {
        if (contentRef.current) {
            const scrollHeight = contentRef.current.scrollHeight;
            setContentHeight(scrollHeight);
        }
    }, [answer, isOpen]);

    return (
        <div className="flex flex-col w-full rounded-[12px] overflow-hidden mb-4" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
            {/* Question and arrow container */}
            <div
                onClick={onClick}
                className="flex flex-row justify-between items-center p-4 bg-[var(--bg2)] cursor-pointer hover:bg-[var(--bg3)] transition-colors duration-200"
            >
                <h5>{question}</h5>
                <span
                    className={`text-[var(--accent)] transition-transform duration-300 ease-out ${isOpen ? 'rotate-180' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </div>

            {/* Answer container with animation */}
            <div
                className="overflow-hidden transition-all duration-300 ease-out border-t border-[var(--accent-light)]"
                style={{ height: isOpen ? contentHeight + 'px' : '0px' }}
            >
                {/* Inner content wrapper with ref for height measurement */}
                <div ref={contentRef} className="p-4 bg-white">
                    <p className="text-[var(--body)] whitespace-pre-line">{answer}</p>
                </div>
            </div>
        </div>
    );
}