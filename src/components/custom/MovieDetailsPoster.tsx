import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

import BiografCard from './BiografCard';

const cld = new Cloudinary({ cloud: { cloudName: 'dveubqvv8' } });

type MoviePosterProps = {
  title: string;
  poster?: string | null; // publicId
};

export default function MovieDetailsPagePoster({
  title,
  poster,
}: MoviePosterProps) {
  return (
    <article className="h-full w-full">
      <BiografCard
        className="h-[450px] w-[300px] overflow-hidden p-0!"
        contentClassName="p-0! h-full"
      >
        {poster ? (
          <AdvancedImage
            cldImg={cld.image(poster).resize(fill().width(600).height(900))}
            alt={`Poster för ${title}`}
            className="border-border h-[91.5dvh] w-full rounded-lg border object-contain shadow-sm"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-zinc-700">
            <p className="text-sm text-zinc-200">Ingen bild ännu</p>
          </div>
        )}
      </BiografCard>
    </article>
  );
}
