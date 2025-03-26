import Link from "next/link";

interface ButtonProps {
    text: string;
    onClick?: () => void;
    variant?: "filled" | "outlined";
    href?: string;
    type?: "button" | "submit";
}

export default function SiteButton({
    text,
    onClick,
    variant = "filled",
    href,
    type = "button",
}: ButtonProps) {
    const baseStyles =
        "flex flex-row justify-center items-center px-[16px] py-[10px] w-auto h-auto rounded-[8px] font-medium border border-[var(--accent)]";

    const variantStyles = {
        filled: "bg-[var(--accent)] text-[var(--white)]",
        outlined: "text-[var(--accent)]",
    };

    if (href) {
        return (
            <Link
                href={href}
                onClick={onClick}
                className={`${baseStyles} ${variantStyles[variant]}`}
            >
                {text}
            </Link>
        );
    }

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]}`}
            onClick={onClick}
            type={type}
        >
            {text}
        </button>
    );
}
