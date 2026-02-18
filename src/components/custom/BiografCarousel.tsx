import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { background } from "storybook/theming"

export default function CarouselSize() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
            <Card className="m-2 border-0 bg-[#141414]  text-[#f3eee4] shadow-[0px_0px_5px_1px_#b69852] hover:shadow-[0px_0px_15px_1px_#b69852]">
              <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-sm">
                <span>{index + 15}:e Feb</span>
                <span className="text-xs">Salong 2</span>


              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}



