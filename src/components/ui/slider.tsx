
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showTooltip?: boolean
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showTooltip = false, ...props }, ref) => {
  const [tooltipValue, setTooltipValue] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  
  // Calculate position and value for tooltip
  const calculateValue = React.useCallback((value: number[]) => {
    return Math.round(value[0]);
  }, []);
  
  const handleValueChange = (value: number[]) => {
    setTooltipValue(calculateValue(value));
    if (props.onValueChange) {
      props.onValueChange(value);
    }
  };

  // Color gradient based on value
  const getTrackColor = () => {
    const value = tooltipValue || (props.value ? props.value[0] : 0);
    const hue = 50 - (value / 100) * 30; // From yellow (50) to orange (20)
    return `hsl(${hue}, 90%, 65%)`;
  };

  return (
    <div className="relative py-4">
      <SliderPrimitive.Root
        ref={ref}
        onValueChange={handleValueChange}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full bg-secondary/30 shadow-inner">
          <SliderPrimitive.Range 
            className="absolute h-full transition-colors duration-200" 
            style={{ background: getTrackColor() }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-lg ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 active:scale-95">
          {showTooltip && tooltipValue !== null && (
            <div 
              className={cn(
                "absolute -top-10 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium shadow-md border border-border transition-opacity duration-200",
                isDragging || props.value ? "opacity-100" : "opacity-0"
              )}
            >
              {tooltipValue}%
            </div>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    </div>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
