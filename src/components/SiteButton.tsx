import Link from "next/link";

interface ButtonProps {
    text: string;
    onClick?: () => void;
    variant?: "filled" | "outlined";
    href?: string;
    type?: "button" | "submit";
    fullWidth?: boolean;
}

export default function SiteButton({
    text,
    onClick,
    variant = "filled",
    href,
    type = "button",
    fullWidth = false,
}: ButtonProps) {
    const baseStyles =
        "flex flex-row justify-center items-center p-[8px_12px] lg:p-[10px_16px] h-auto rounded-[8px] font-medium text-[20px] border border-[var(--accent)]";

    const variantStyles = {
        filled: "bg-[var(--accent)] text-[var(--white)]",
        outlined: "text-[var(--accent)]",
    };

    const widthStyle = fullWidth ? "w-full" : "w-auto";

    if (href) {
        return (
            <Link
                href={href}
                onClick={onClick}
                className={`${baseStyles} ${variantStyles[variant]} ${widthStyle}`}
            >
                {text}
            </Link>
        );
    }

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${widthStyle}`}
            onClick={onClick}
            type={type}
        >
            {text}
        </button>
    );
}
