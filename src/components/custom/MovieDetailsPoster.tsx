import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fit } from '@cloudinary/url-gen/actions/resize';

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
          cldImg={cld.image(poster).resize(fit().width(300).height(450))}
          alt={`Poster för ${title}`}
          className="border-border h-full w-full rounded-lg border object-contain shadow-sm"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-zinc-700">
          <p className="text-sm text-zinc-200">Ingen bild ännu</p>
        </div>
      )}
    </article>
  );
}
