import InputField from "@components/InputField";
import SiteButton from "@components/SiteButton";

interface FormTemplateProps {
    title: string;
    subtitle?: string;
    fields: {
        label: string;
        type: string;
        name: string;
        placeholder?: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
        required?: boolean;
        options?: { value: string; label: string }[];
    }[];
    showTerms?: boolean;
    termsValue?: boolean;
    onTermsChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    buttonText: string;
    onSubmit: (e: React.FormEvent) => void;
    error?: string | null;
    disabled?: boolean;
    note?: React.ReactNode;
}

export default function FormTemplatePage({
    title,
    subtitle,
    fields,
    showTerms = false,
    termsValue = false,
    onTermsChange,
    buttonText,
    onSubmit,
    error = null,
    disabled = false,
    note
}: FormTemplateProps) {
    return (
        <div className="w-[var(--section-width)] flex flex-row justify-center items-center pt-[var(--page-top-padding)]">
            <div
                className="flex flex-col justify-center items-center lg:p-[32px_64px] md:p-[28px_32px] p-[24px_24px] lg:gap-[32px] md:gap-[28px] gap-[24px] w-full lg:max-w-[800px] bg-[var(--bg2)] md:rounded-[20px] rounded-[12px]"
                style={{ boxShadow: "0px 1px 10px var(--shadow)" }}
            >
                <h3>{title}</h3>

                {subtitle && (
                    <p className="text-gray-600 text-center -mt-4">{subtitle}</p>
                )}

                <form onSubmit={onSubmit} className="flex flex-col lg:gap-[24px] md:gap-[20px] gap-[16px] w-full">
                    {/* Error Display - Moved inside form for better positioning */}
                    {error && (
                        <div className="w-full p-3 bg-red-100 border border-red-400 text-[var(--error)] rounded-md text-center">
                            {error}
                        </div>
                    )}

                    {fields.length > 5 ? (
                        <div className="flex flex-col md:gap-[20px] gap-[16px] w-full">
                            {/* First Two Fields */}
                            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[20px] gap-[16px] w-full">
                                <InputField {...fields[0]} />
                                <InputField {...fields[1]} />
                            </div>

                            {/* Middle Fields */}
                            {fields.slice(2, -2).map((field, index) => (
                                <InputField key={index + 2} {...field} />
                            ))}

                            {/* Last Two Fields */}
                            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[20px] gap-[16px] w-full">
                                <InputField {...fields[fields.length - 2]} />
                                <InputField {...fields[fields.length - 1]} />
                            </div>
                        </div>
                    ) : (
                        // If 5 or fewer fields, keep them all in a single-column layout
                        <div className="flex flex-col md:gap-[20px] gap-[16px] w-full">
                            {fields.map((field, index) => (
                                <InputField key={index} {...field} />
                            ))}
                        </div>
                    )}

                    {/* Terms & Conditions */}
                    {showTerms && (
                        <div className="flex flex-row items-start md:gap-[10px] gap-[6px]">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                checked={termsValue}
                                onChange={onTermsChange}
                                required
                                className="w-[18px] h-[18px] flex-shrink-0 accent-[var(--accent)] cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-[14px]">
                                I agree to Fleeto&apos;s{" "}
                                <a href="/terms-and-conditions" className="text-[var(--accent)] font-medium">
                                    Terms & Conditions
                                </a>{" "}
                                and{" "}
                                <a href="/privacy-policy" className="text-[var(--accent)] font-medium">
                                    Privacy Policy
                                </a>
                                .
                            </label>
                        </div>
                    )}

                    {/* Optional note */}
                    {note && <div className="w-full">{note}</div>}

                    {/* Submit Button */}
                    <SiteButton
                        text={buttonText}
                        variant="filled"
                        type="submit"
                        disabled={disabled}
                        fullWidth
                    />
                </form>
            </div>
        </div>
    );
}
