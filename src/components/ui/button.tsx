import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 border bg-clip-padding font-sans text-[12.5px] font-semibold tracking-[0.10em] whitespace-nowrap uppercase transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:brightness-[1.07]",
        outline:
          "border-line-strong bg-transparent text-ink hover:border-gold hover:text-gold",
        "ghost-gold":
          "border-gold bg-transparent text-gold hover:bg-gold-soft",
        ghost:
          "border-transparent bg-transparent text-mut hover:text-ink",
      },
      size: {
        nav: "h-10 px-5",
        action: "h-11 px-5",
        form: "h-12 px-7",
        cta: "h-13 px-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "action",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "action",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
