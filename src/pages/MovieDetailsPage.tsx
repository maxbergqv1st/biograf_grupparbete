import type { ComponentProps } from 'react';

import { useMovie } from '@/api/hooks/useMovies';
import { Trailer } from '@/stories/ui/BiografButton.stories';
import { Dates } from '@/stories/ui/BiografCarousel.stories';
import { Time } from '@/stories/ui/BiografCarousel.stories';
import { useParams } from 'react-router-dom';

import BiografButton from '@/components/custom/BiografButton';
import BiografCarousel from '@/components/custom/BiografCarousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';

import Image from '../parts/Image';

type BiografCarouselProps = ComponentProps<typeof BiografCarousel>;

type BiografButtonProps = ComponentProps<typeof BiografButton>;

MovieDetailsPage.route = {
  path: '/movies/:id',
  parent: '/',
  menuLabel: 'MovieDetail',
  index: 4,
};

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useMovie(+id!);
  console.log(data);
  console.log(isLoading);
  console.log(id);

  const argsDates = (Dates.args ?? {}) as BiografCarouselProps;
  const argsTime = (Time.args ?? {}) as BiografCarouselProps;
  const argsTrailer = (Trailer.args ?? {}) as BiografButtonProps;
  return (
    <div className="relative left-1/2 grid min-h-screen w-screen -translate-x-1/2 grid-cols-3 grid-rows-3 gap-6 px-8">
      <div className="h-full w-2/3">
        <Image
          className="h-full w-2/3 object-contain"
          src="/images/movies/grimsby.jpg"
        />
      </div>
      <AspectRatio className="h-4/3 w-full rounded-lg bg-[#1E1E1E] p-4">
        <h3 className="flex justify-center p-10 text-xl">Välj Datum & tid</h3>
        <Separator />
        <div className="flex justify-center p-5">
          <BiografCarousel {...argsDates} desktopTwoRows className="p-5" />
        </div>
        <Separator className="flex justify-center" />
        <div className="flex justify-center p-5">
          <BiografCarousel {...argsTime} desktopTwoRows className="p-5" />
        </div>
        <Separator className="flex justify-center" />
        <span className="flex justify-center p-6">
          Fler datum & tider kommer snart...
        </span>
      </AspectRatio>

      <AspectRatio className="self-top max-h-2/4 w-full max-w-md justify-self-center rounded-lg bg-[#1E1E1E] p-4">
        <h1 className="flex justify-center p-5 text-2xl text-[#b69852]">
          {data?.data.title}
        </h1>
        <Separator className="flex justify-center" />
        <span className="flex justify-center p-5">
          {data?.data.title ? data?.data.title : 'No title'}
        </span>
      </AspectRatio>
      <AspectRatio className="h-40 w-2/3 rounded-lg border bg-[url(/images/movies/grimsby.jpg)] bg-center">
        <div className="absolute right-5 bottom-5">
          <a href="https://www.youtube.com/watch?v=_YtclB_02wA" target="_blank">
            <BiografButton {...argsTrailer} />
          </a>
        </div>
      </AspectRatio>
    </div>
  );
}
