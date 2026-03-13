import * as React from "react";
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type BaseCarouselProps,
} from "@/components/ui/carousel"
import type { background } from "storybook/theming"
import { cn } from "@/lib/utils"

//Skapar en bool
type BiografCarouselProps = BaseCarouselProps & {
  selectable?: boolean
  desktopTwoRows?: boolean
  items?: React.ReactNode[]
  resetSelectionKey?: string | number | null
}
//lagt till  selectable = false,
export default function CarouselSize({ selectable = false, desktopTwoRows = false, ...props}: BiografCarouselProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  React.useEffect(() => {
    setSelectedIndex(null)
  }, [props.resetSelectionKey])
  const fallbackItems = props.children
    ? Array.from({ length: 5 }, () => props.children)
    : []
  const items = props.items ?? fallbackItems
  
  return (
    <Carousel
    orientation={props.orientation}
      opts={{
        align: 'start',
      }}
      className={cn("w-full max-w-[12rem] sm:max-w-xs md:max-w-sm", props.className)}
    >
      <CarouselContent className={cn(desktopTwoRows && "md:flex-wrap")}>
        {items.map((item, index) => (
          <CarouselItem key={index} className={cn(desktopTwoRows ? "basis-1/2 md:basis-1/3" : "basis-1/2 lg:basis-1/3")}>
              <Card
                onClick={selectable ? () => setSelectedIndex(index) : undefined}
                className={cn(
                "m-2 border-0 bg-black items-center text-[#f3eee4] p-0 shadow-[0px_0px_5px_1px_#b69852]",
                selectable && selectedIndex === index
                ? "bg-[#b69852] text-black shadow-[0px_0px_15px_1px_#b69852]"
                : "hover:shadow-[0px_0px_15px_1px_#b69852]"
                )}>
              <CardContent className="flex aspect-square justify-center p-0 text-sm">
                {item}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
