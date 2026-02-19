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

export default function CarouselSize({...props}: BaseCarouselProps) {
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
          <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
            <Card className="m-2 border-0 bg-[#141414]  text-[#f3eee4] p-0 shadow-[0px_0px_5px_1px_#b69852] hover:shadow-[0px_0px_15px_1px_#b69852]">
              <CardContent className="flex aspect-square items-center justify-center p-0 text-sm">
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



