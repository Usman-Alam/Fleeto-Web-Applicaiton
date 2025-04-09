import React from "react";
import Link from "next/link";

interface ButtonProps {
    text: string;
    onClick?: ((e?: React.MouseEvent<HTMLButtonElement>) => void) | undefined;
    variant?: "filled" | "outlined";
    href?: string;
    type?: "button" | "submit";
    fullWidth?: boolean;
    className?: string;
    disabled?: boolean;
}

export default function SiteButton({
    text,
    onClick,
    variant = "filled",
    href,
    type = "button",
    fullWidth = false,
    className = "",
    disabled = false,
}: ButtonProps) {
    const baseStyles =
        "flex flex-row justify-center items-center p-[8px_12px] lg:p-[10px_16px] h-auto rounded-[8px] font-medium text-[20px] border border-[var(--accent)]";

    const variantStyles = {
        filled: "bg-[var(--accent)] text-[var(--white)]",
        outlined: "text-[var(--accent)]",
    };

    const widthStyle = fullWidth ? "w-full" : "w-auto";
    const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

    if (href) {
        return (
            <Link
                href={href}
                onClick={onClick as any}
                className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${disabledClass} ${className}`}
            >
                {text}
            </Link>
        );
    }

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${disabledClass} ${className}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {text}
        </button>
    );
}
