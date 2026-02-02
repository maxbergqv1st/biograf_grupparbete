import type Product from '../interfaces/Product';
import { Link, useLoaderData } from 'react-router-dom';
import BiografButton from '@/components/custom/BiografButton';
import NotFoundPage from './NotFoundPage';
import Image from '../parts/Image';
import productsLoader from '../utils/productsLoader';

ProductDetailsPage.route = {
  path: '/products/:slug',
  parent: '/',
  loader: productsLoader
};

export default function ProductDetailsPage() {

  const product =
    useLoaderData().products[0] as Product;

  // if no product found, show 404
  if (!product) {
    return <NotFoundPage />;
  }

  const { id, name, quantity, price$, description } = product;

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Product details
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
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
          {description
            .split('\n')
            .map((text) => <p key={`${id}-${text}`}>{text}</p>)}
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Quantity</span>
              <span className="text-foreground">{quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Price</span>
              <span className="text-foreground">
                ${price$.toFixed(2)}
              </span>
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
