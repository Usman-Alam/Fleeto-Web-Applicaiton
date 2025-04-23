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
    icon?: React.ReactNode;
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
    icon
}: ButtonProps) {
    const baseStyles = 
        "flex flex-row justify-center items-center gap-2 p-[8px_12px] lg:p-[10px_16px] h-auto rounded-[8px] font-medium text-[20px] border transition-colors duration-200";

    const variantStyles = {
        filled: "bg-[var(--accent)] text-[var(--white)] border-[var(--accent)] hover:bg-transparent hover:text-[var(--accent)]",
        outlined: "bg-transparent text-[var(--accent)] border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--white)]",
    };

    const widthStyle = fullWidth ? "w-full" : "w-auto";
    const disabledClass = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer";
    
    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${widthStyle} ${disabledClass} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedStyles} onClick={onClick as any}>
                {icon && icon}
                {text}
            </Link>
        );
    }

    return (
        <button
            className={combinedStyles}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {icon && icon}
            {text}
        </button>
    );
}
