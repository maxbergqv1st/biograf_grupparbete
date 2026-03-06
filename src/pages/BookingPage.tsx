import type { ComponentProps } from 'react';
import BiografCarousel from '@/components/custom/BiografCarousel';
import { Dates } from '@/stories/ui/BiografCarousel.stories';
import { Time } from '@/stories/ui/BiografCarousel.stories';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from '../parts/Image';
import BiografButton from '@/components/custom/BiografButton';
import { Trailer } from '@/stories/ui/BiografButton.stories'
import { Separator } from "@/components/ui/separator"




type BiografCarouselProps = ComponentProps<typeof BiografCarousel>;

type BiografButtonProps = ComponentProps<typeof BiografButton>;


DateTimeSelect.route = {
  path: '/DateTimeSelect',
  menuLabel: 'DateTimeSelect',
  index: 4,
};




export default function DateTimeSelect() {
  const argsDates = (Dates.args ?? {}) as BiografCarouselProps;
  const argsTime = (Time.args ?? {}) as BiografCarouselProps;
  const argsTrailer = (Trailer.args ?? {}) as BiografButtonProps;
  return <div className="relative left-1/2 w-screen -translate-x-1/2 grid min-h-screen grid-cols-3 grid-rows-3 gap-6 px-8">
<div className='w-2/3 h-full'>
        <Image className='w-2/3 h-full object-contain' src='/images/movies/Grimsby.jpg'/>
        </div>
      <AspectRatio className="w-full h-4/3 rounded-lg bg-[#1E1E1E] p-4">
                <h3 className='flex justify-center p-10 text-xl'>Välj Datum & tid</h3>
        <Separator />
        <div className='flex justify-center p-5'>
        <BiografCarousel {...argsDates} desktopTwoRows className='p-5'/>
        </div>
        <Separator className='flex justify-center'/>
        <div className='flex justify-center p-5'>
        <BiografCarousel {...argsTime} desktopTwoRows className='p-5' />
        </div>
        <Separator className='flex justify-center'/>
        <span className='flex justify-center p-6'>Fler datum & tider kommer snart...</span>
      </AspectRatio>

      <AspectRatio className="w-full max-h-2/4 max-w-md self-top justify-self-center rounded-lg bg-[#1E1E1E] p-4">
      <h1 className='flex justify-center p-5 text-[#b69852] text-2xl'>The Brothers Grimsby</h1>
      <Separator className='flex justify-center'/>
      <span className='flex justify-center p-5'>Den engelske fotbollshuliganen Nobby har spenderat tjugoåtta år av sitt liv med att söka sin lillebror Sebastian som han inte sett sedan de var små.</span>
      </AspectRatio>
<AspectRatio className='h-40 w-2/3 bg-[url(/images/movies/Grimsby.jpg)] border rounded-lg bg-center'>
<div  className='absolute bottom-5 right-5'>
  <a href='https://www.youtube.com/watch?v=_YtclB_02wA' target="_blank">
<BiografButton {...argsTrailer}/>
  </a>
</div>
</AspectRatio>
  </div>
}

