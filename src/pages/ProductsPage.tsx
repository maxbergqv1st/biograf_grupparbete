import { useLoaderData } from 'react-router-dom';

import BiografSelect from '@/components/custom/BiografSelect';
import BiografSwitch from '@/components/custom/BiografSwitch';

import ProductCard from '../parts/ProductCard';
import type { SortOption } from '../utils/productPageHelpers';
import { getHelpers } from '../utils/productPageHelpers';
import productsLoader from '../utils/productsLoader';
import { useStateContext } from '../utils/useStateObject';

ProductsPage.route = {
  path: '/',
  menuLabel: 'main.navigation.products',
  index: 1,
  parent: '/',
  loader: productsLoader,
};

export default function ProductsPage() {
  const { products, categories, sortOptions, sortDescriptions } = getHelpers(
    useLoaderData().products,
  );

  // get state object and setter from the outlet context
  const [{ categoryChoice, sortChoice, bwImages }, setState] =
    useStateContext();

  // get the chosen category without the product count part
  const category = categoryChoice.split(' (')[0];
  // get the key and order to from the chosen sort option
  const { key: sortKey, order: sortOrder } = sortOptions.find(
    (x) => x.description === sortChoice,
  ) as SortOption;

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Our products
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Our products are fantastic, organic, and fresh. They are also
          reasonably priced, considering they are harvested with the greatest
          care.
        </p>
      </header>

      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-foreground text-sm font-medium">
                Image style
              </div>
              <div className="text-muted-foreground text-xs">
                {bwImages ? 'Black & white' : 'Full color'}
              </div>
            </div>
            <BiografSwitch
              checked={!bwImages}
              onCheckedChange={(checked) => setState('bwImages', !checked)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">Category</div>
            <BiografSelect
              value={categoryChoice}
              onValueChange={(nextValue) =>
                setState('categoryChoice', nextValue)
              }
              options={categories.map((option) => ({ value: option }))}
              placeholder="Select"
            />
          </div>
          <div className="space-y-2">
            <div className="text-foreground text-sm font-medium">Sort by</div>
            <BiografSelect
              value={sortChoice}
              onValueChange={(nextValue) => setState('sortChoice', nextValue)}
              options={sortDescriptions.map((option) => ({ value: option }))}
              placeholder="Select"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {products
          // filter by the chosen category
          .filter((x) => category === 'All' || x.categories.includes(category))
          // sort by the chosen choice for sorting
          .sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1) * sortOrder)
          // map to product cards
          .map((product) => (
            <ProductCard {...product} key={product.id} />
          ))}
      </div>
    </section>
  );
}
