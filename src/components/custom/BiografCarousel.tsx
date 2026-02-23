import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
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
}
//lagt till  selectable = false,
export default function CarouselSize({ selectable = false, ...props}: BiografCarouselProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  
  return (
    <Carousel
    orientation={props.orientation}
      opts={{
        align: "start",
      }}
      className="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 lg:basis-1/3 bg-[#141414]">
              <Card
                onClick={selectable ? () => setSelectedIndex(index) : undefined}
                className={cn(
                "m-2 border-0 bg-black items-center text-[#f3eee4] p-0 shadow-[0px_0px_5px_1px_#b69852]",
                selectable && selectedIndex === index
                ? "bg-[#b69852] text-black shadow-[0px_0px_15px_1px_#b69852]"
                : "hover:shadow-[0px_0px_15px_1px_#b69852]"
                )}>
              <CardContent className="flex aspect-square justify-center p-0 text-sm">
                {props.children ? props.children : <><span>{index + 15}:e Feb</span>
                <span className="text-xs">Salong 2</span></>}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}



