import { useNavigate } from 'react-router-dom';

import BiografButton from '@/components/custom/BiografButton';
import BiografCard from '@/components/custom/BiografCard';

import type Product from '../interfaces/Product';
import Image from './Image';

export default function ProductCard({
  id,
  name,
  quantity,
  price$,
  slug,
}: Product) {
  const navigate = useNavigate();
  return (
    <BiografCard className="group mb-4 transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <h3 className="text-foreground text-lg font-semibold">{name}</h3>
            <p className="text-muted-foreground text-sm">
              Freshly stocked and thoughtfully sourced.
            </p>
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">Quantity</span>
            <span className="text-foreground">{quantity}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">Price</span>
            <span className="text-foreground">${price$.toFixed(2)}</span>
          </div>
          <div className="pt-2">
            <BiografButton onClick={() => navigate('/products/' + slug)}>
              More info
            </BiografButton>
          </div>
        </div>
        <div className="md:w-44">
          <Image
            src={'/images/products/' + id + '.jpg'}
            alt={'Product image of the product ' + name + '.'}
            className="h-full"
          />
        </div>
      </div>
    </BiografCard>
  );
}
