import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';

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
    <article className="h-[450px] w-[300px]">
      {poster ? (
        <AdvancedImage
          cldImg={cld.image(poster).resize(fill().width(300).height(450))}
          alt={`Poster för ${title}`}
          className="h-full w-full rounded-lg border border-border object-cover shadow-sm"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-zinc-700">
          <p className="text-sm text-zinc-200">Ingen bild ännu</p>
        </div>
      )}
    </article>
  );
}
