import Link from "next/link";

interface InputFieldProps {
    label: string;
    type: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    showForgot?: boolean;
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
}: InputFieldProps) {
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

            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`p-[10px] px-4 bg-[var(--white)] border border-[var(--shadow)] rounded-[8px] focus:outline-none focus:border-[var(--accent)]
                    ${value.length === 0 ? "text-[var(--disabled)]" : "text-[var(--body)]"}
                    autofill:!text-[20px] autofill:!text-[var(--body)] autofill:!bg-[var(--white)]`}
                required={required}
            />
        </div>
    );
}