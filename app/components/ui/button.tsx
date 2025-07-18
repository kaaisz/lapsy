import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"

const buttonVariants = cva(
  // Base styles with accessibility improvements
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] min-h-[44px] min-w-[44px]",
  {
    variants: {
      variant: {
        default: [
          "bg-button-primary text-button-primary-foreground",
          "hover:bg-button-primary-hover",
          "active:bg-button-primary-active",
          "disabled:bg-button-primary-disabled disabled:text-button-primary-disabled-foreground",
          "shadow-sm hover:shadow-md",
        ],
        destructive: [
          "bg-button-destructive text-button-destructive-foreground",
          "hover:bg-button-destructive-hover",
          "active:bg-button-destructive-active",
          "shadow-sm hover:shadow-md",
        ],
        outline: [
          "border border-button-secondary-border bg-button-secondary text-button-secondary-foreground",
          "hover:bg-button-secondary-hover",
          "active:bg-button-secondary-active",
          "shadow-sm hover:shadow-md",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
          "active:bg-secondary/60",
        ],
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/60",
        ],
        link: [
          "text-primary underline-offset-4 hover:underline",
          "focus-visible:underline",
        ],
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 py-2 text-sm min-h-[40px] min-w-[40px]",
        lg: "h-14 px-8 py-4 text-lg min-h-[48px] min-w-[48px]",
        icon: "h-12 w-12 min-h-[44px] min-w-[44px]",
        "icon-sm": "h-10 w-10 min-h-[40px] min-w-[40px]",
        "icon-lg": "h-14 w-14 min-h-[48px] min-w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    loadingText,
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const isDisabled = disabled || loading
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <div 
              className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            <span className="sr-only">読み込み中</span>
            {loadingText || "読み込み中..."}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }