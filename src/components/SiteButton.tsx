import React from "react";

interface ButtonProps {
  text: string;
  variant: "filled" | "outlined";
  fullWidth?: boolean;
  onClick?: ((e?: React.MouseEvent<HTMLButtonElement>) => void) | undefined;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function SiteButton({
  text,
  variant,
  fullWidth = false,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...props
}: ButtonProps) {
  // Determine the button styling based on the variant
  const baseClasses = "py-[10px] px-[20px] rounded-full text-[16px] font-medium transition-all duration-200";
  const variantClasses = {
    filled: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
    outlined: "border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-hover)] hover:text-white",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {text}
    </button>
  );
}
