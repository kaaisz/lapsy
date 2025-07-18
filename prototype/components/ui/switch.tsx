import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "./utils"

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string
  description?: string
  error?: string
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, label, description, error, id, ...props }, ref) => {
  const switchId = id || React.useId()
  const descriptionId = `${switchId}-description`
  const errorId = `${switchId}-error`
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <SwitchPrimitives.Root
          className={cn(
            // Base styles with accessibility improvements
            "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            // Unchecked state with pattern for accessibility
            "bg-switch-unchecked hover:bg-switch-unchecked-hover",
            // Checked state with different pattern
            "data-[state=checked]:bg-switch-checked data-[state=checked]:hover:bg-switch-checked-hover",
            // Error state
            error && "ring-2 ring-destructive ring-offset-2",
            className
          )}
          id={switchId}
          ref={ref}
          aria-describedby={cn(
            description && descriptionId,
            error && errorId
          )}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              "pointer-events-none block h-5 w-5 rounded-full bg-switch-thumb shadow-lg ring-0 transition-all duration-200",
              // Transform position with visual indicator
              "translate-x-0 data-[state=checked]:translate-x-5",
              // Add shadow for better visibility
              "shadow-md data-[state=checked]:shadow-lg",
              // Subtle scale animation for feedback
              "scale-100 data-[state=checked]:scale-110"
            )}
          >
            {/* Visual indicators for state (accessible patterns) */}
            <div 
              className={cn(
                "absolute inset-0 rounded-full transition-opacity duration-200",
                "opacity-0 data-[state=checked]:opacity-100",
                // Small check mark pattern for checked state
                "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-1 before:border-b-2 before:border-l-2 before:border-current before:rotate-[-45deg]"
              )}
            />
          </SwitchPrimitives.Thumb>
        </SwitchPrimitives.Root>
        
        {/* Label with proper association */}
        {label && (
          <label
            htmlFor={switchId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
      
      {/* Description */}
      {description && (
        <p 
          id={descriptionId}
          className="text-sm text-muted-foreground pl-15"
        >
          {description}
        </p>
      )}
      
      {/* Error message */}
      {error && (
        <div 
          id={errorId}
          className="flex items-center gap-2 text-sm text-destructive pl-15"
          role="alert"
          aria-live="polite"
        >
          <div className="h-4 w-4 rounded-full bg-destructive flex items-center justify-center">
            <span className="text-xs text-white" aria-hidden="true">!</span>
          </div>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }