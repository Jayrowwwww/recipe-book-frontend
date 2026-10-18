import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonClass, type ButtonVariant } from "@/lib/button-class";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({ variant = "primary", className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, className)} {...props}>
      {children}
    </button>
  );
}
