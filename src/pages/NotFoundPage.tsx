import { Link, useLocation } from 'react-router-dom';

import BiografButton from '@/components/custom/BiografButton';

NotFoundPage.route = {
  path: '*',
};

export default function NotFoundPage() {
  return (
    <section className="bg-card flex flex-col gap-6 rounded-lg border p-8 text-center shadow-sm">
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
          404
        </p>
        <h1 className="text-foreground text-2xl font-semibold">
          Page not found
        </h1>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t find a page that matches:
        </p>
        <p className="bg-muted text-foreground rounded-md px-3 py-2 text-sm font-medium">
          {useLocation().pathname}
        </p>
      </div>
      <div className="flex justify-center">
        <BiografButton>
          <Link to="/">Back to the start page</Link>
        </BiografButton>
      </div>
    </section>
  );
}
