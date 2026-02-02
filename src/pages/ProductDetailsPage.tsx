import { Link, useLoaderData } from 'react-router-dom';

import BiografButton from '@/components/custom/BiografButton';

import type Product from '../interfaces/Product';
import Image from '../parts/Image';
import productsLoader from '../utils/productsLoader';
import NotFoundPage from './NotFoundPage';

ProductDetailsPage.route = {
  path: '/products/:slug',
  parent: '/',
  loader: productsLoader,
};

export default function ProductDetailsPage() {
  const product = useLoaderData().products[0] as Product;

  // if no product found, show 404
  if (!product) {
    return <NotFoundPage />;
  }

  const { id, name, quantity, price$, description } = product;

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            Product details
          </p>
          <h1 className="text-foreground text-3xl font-semibold tracking-tight">
            {name}
          </h1>
        </div>
        <Image
          src={'/images/products/' + id + '.jpg'}
          alt={'Product image of the product ' + name + '.'}
        />
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="prose prose-neutral max-w-none">
          {description.split('\n').map((text) => (
            <p key={`${id}-${text}`}>{text}</p>
          ))}
        </div>
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">Quantity</span>
              <span className="text-foreground">{quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">Price</span>
              <span className="text-foreground">${price$.toFixed(2)}</span>
            </div>
            <BiografButton asChild className="w-full">
              <Link to="/">Back to the product list</Link>
            </BiografButton>
          </div>
        </div>
      </div>
    </article>
  );
}
