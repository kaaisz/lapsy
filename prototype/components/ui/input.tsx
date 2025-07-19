import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"

const inputVariants = cva(
  "flex w-full rounded-2xl border-0 bg-input-background px-4 py-3 text-base transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]",
  {
    variants: {
      variant: {
        default: "border-input",
        error: [
          "border-2 border-destructive border-dashed",
          "focus-visible:ring-destructive",
          "bg-destructive/5",
        ],
        success: [
          "border-2 border-neon-lime border-solid", 
          "focus-visible:ring-neon-lime",
          "bg-neon-lime/5",
        ],
        warning: [
          "border-2 border-yellow-500 border-dotted",
          "focus-visible:ring-yellow-500",
          "bg-yellow-500/5",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string
  success?: string
  warning?: string
  label?: string
  helperText?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    type, 
    error, 
    success, 
    warning, 
    label, 
    helperText, 
    icon,
    id,
    required,
    ...props 
  }, ref) => {
    const reactId = React.useId(); // ← ここで必ず呼ぶ
    const inputId = id ?? reactId; // ← どちらかを使う
    const helperId = `${inputId}-helper`
    const errorId = `${inputId}-error`
    
    // Determine variant based on state
    const currentVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant
    
    // Determine icon based on state
    const stateIcon = error ? (
      <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
    ) : success ? (
      <CheckCircle2 className="h-4 w-4 text-neon-lime" aria-hidden="true" />
    ) : warning ? (
      <AlertCircle className="h-4 w-4 text-yellow-500" aria-hidden="true" />
    ) : icon

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-label="必須">
                *
              </span>
            )}
          </label>
        )}
        
        <div className="relative">
          {stateIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              {stateIcon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              inputVariants({ variant: currentVariant }),
              stateIcon && "pl-10",
              className
            )}
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(
              helperText && helperId,
              error && errorId
            )}
            {...props}
          />
        </div>
        
        {/* Helper text */}
        {helperText && !error && !success && !warning && (
          <p 
            id={helperId}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
        
        {/* Error message */}
        {error && (
          <div 
            id={errorId}
            className="flex items-center gap-2 text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Success message */}
        {success && (
          <div 
            className="flex items-center gap-2 text-sm text-neon-lime"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>{success}</span>
          </div>
        )}
        
        {/* Warning message */}
        {warning && (
          <div 
            className="flex items-center gap-2 text-sm text-yellow-600"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <span>{warning}</span>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }