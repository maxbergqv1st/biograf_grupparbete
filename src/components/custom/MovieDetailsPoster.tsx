import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

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
      {poster ? (
        <AdvancedImage
          cldImg={cld.image(poster).resize(fill().width(600).height(900))}
          alt={`Poster för ${title}`}
          className="h-full w-full rounded-lg border border-[#B69852] object-cover shadow-[0px_0px_8px_1px_rgba(182,152,82,0.3)]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-zinc-700">
          <p className="text-sm text-zinc-200">Ingen bild ännu</p>
        </div>
      )}
    </article>
  );
}
