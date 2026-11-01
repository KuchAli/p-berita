import { useId, type ComponentType, type InputHTMLAttributes, type MouseEvent } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightIcon?: ComponentType<{ size?: number }>;
  onRightIconClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Input = ({
  label,
  error,
  rightIcon: RightIcon,
  onRightIconClick,
  className,
  id,
  ...rest
}: InputProps) => {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className="field">
      <label
        htmlFor={inputId}
        className={cn("input-wrap", error && "error", className)}
      >
        <span className="input-body">
          <span className="input-label">{label}</span>
          <input id={inputId} {...rest} />
        </span>
        {RightIcon && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRightIconClick?.(e);
            }}
            tabIndex={-1}
          >
            <RightIcon size={20} />
          </button>
        )}
      </label>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};

export default Input;