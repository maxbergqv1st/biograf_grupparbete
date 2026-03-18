import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';
import { useNavigate } from 'react-router-dom';
import BiografCard from './BiografCard';

const cld = new Cloudinary({ cloud: { cloudName: 'dveubqvv8' } });

type MoviePosterProps = {
  id: number;
  title: string;
  poster?: string | null; // publicId
};

export default function MoviePoster({
  id,
  title,
  poster,
}: MoviePosterProps) {
  const navigate = useNavigate();

  return (
    <BiografCard
      className="group relative mx-auto w-full max-w-xs cursor-pointer overflow-hidden rounded-xl! border-zinc-800 p-0! shadow-md transition-transform hover:scale-[1.02]"
      contentClassName="p-0!"
      onClick={() => navigate('/movies/' + id)}
    >
      {poster ? (
        <AdvancedImage
          cldImg={cld.image(poster).resize(fill().width(300).height(450))}
          alt={`Poster för ${title}`}
          className="aspect-2/3 w-full object-cover"
        />
      ) : (
        <div className="flex aspect-2/3 w-full items-center justify-center bg-zinc-700">
          <p className="text-sm text-zinc-200">Ingen bild ännu</p>
        </div>
      )}
    </BiografCard>
  );
}
