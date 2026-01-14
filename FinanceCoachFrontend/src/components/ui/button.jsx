import * as React from "react";
import { cn } from "@/lib/utils";

// Variant styles (optional – you can extend this for shadcn’s button-variants)
const baseButtonStyles =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const defaultVariant = "bg-primary text-primary-foreground hover:bg-primary/90";

const secondaryVariant =
  "bg-secondary text-secondary-foreground hover:bg-secondary/80";

const destructiveVariant =
  "bg-destructive text-destructive-foreground hover:bg-destructive/90";

const outlineVariant =
  "border border-input bg-background hover:bg-accent hover:text-accent-foreground";

const ghostVariant = "hover:bg-accent hover:text-accent-foreground";

const linkVariant = "text-primary underline-offset-4 hover:underline";

const variantMap = {
  default: defaultVariant,
  secondary: secondaryVariant,
  destructive: destructiveVariant,
  outline: outlineVariant,
  ghost: ghostVariant,
  link: linkVariant,
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseButtonStyles,
          variantMap[variant],
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          size === "default" && "h-10 px-4 py-2",
          className // 🟢 merge your custom classes
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
