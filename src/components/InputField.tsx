import React from "react";
import Link from "next/link";

interface InputFieldProps {
    label: string;
    type: string;
    name: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    showForgot?: boolean;
    options?: { value: string; label: string }[];
}

export default function InputField({
    label,
    type,
    name,
    placeholder,
    value,
    onChange,
    required = false,
    showForgot = false,
    options
}: InputFieldProps) {
    // Common styling class for all input types
    const commonInputClass = `p-[10px] px-4 w-full bg-[var(--white)] border border-[var(--shadow)] rounded-[8px] focus:outline-none focus:border-[var(--accent)]
        ${value.length === 0 ? "text-[var(--disabled)]" : "text-[var(--body)]"}
        autofill:!text-[20px] autofill:!text-[var(--body)] autofill:!bg-[var(--white)]`;

    return (
        <div className="flex flex-col items-stretch gap-[6px] w-full">
            <div className="flex flex-row gap-[16px] items-center justify-between">
                <label className="font-medium text-[var(--heading)] flex items-center gap-[4px]">
                    {label}:
                    {required && <span className="text-[var(--error)]">*</span>}
                </label>
                {showForgot && (
                    <Link href="/forgot-password" className="text-[var(--info)] font-medium hover:underline">
                        Forgot?
                    </Link>
                )}
            </div>

            {type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={commonInputClass}
                >
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`${commonInputClass} resize-none`}
                    rows={4}
                />
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={commonInputClass}
                />
            )}
        </div>
    );
}