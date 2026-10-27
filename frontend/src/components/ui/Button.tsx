import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "outline";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "btn",
        `btn-${variant}`,
        size === "lg" && "btn-lg",
        fullWidth && "btn-full",
        loading && "btn-loading",
        className,
      )}
      {...rest}
    >
      {loading ? <span className="spinner" aria-hidden></span> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
};

export default button;
