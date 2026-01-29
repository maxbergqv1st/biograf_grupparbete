import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BiografContainer } from '@/components/custom/BiografContainer';
import routes from '../routes';

export default function Header() {

  // whether the navbar is expanded or not
  // (we use this to close it after a click/selection)
  const [expanded, setExpanded] = useState(false);

  //  get the current route
  const pathName = useLocation().pathname;
  const currentRoute = routes
    .slice().sort((a, b) => a.path.length > b.path.length ? -1 : 1)
    .find(x => pathName.indexOf(x.path.split(':')[0]) === 0);
  // function that returns true if a menu item is 'active'
  const isActive = (path: string) =>
    path === currentRoute?.path || path === currentRoute?.parent;

  return <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur">
    <BiografContainer>
      <div className="flex h-16 items-center justify-between">
        <Link
          className="text-lg font-semibold tracking-tight text-foreground"
          to="/"
        >
          The Good Grocery
        </Link>
        <button
          className="rounded-md border border-input px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-accent md:hidden"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          onClick={() => setExpanded(!expanded)}
        >
          Menu
        </button>
        <nav className="hidden md:flex" id="primary-navigation">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {routes.filter(x => x.menuLabel).map(
              ({ menuLabel, path }) =>
                <li key={path}>
                  <Link
                    to={path}
                    className={
                      isActive(path)
                        ? 'text-foreground'
                        : 'text-muted-foreground transition hover:text-foreground'
                    }
                    onClick={() => setTimeout(() => setExpanded(false), 200)}
                  >
                    {menuLabel}
                  </Link>
                </li>
            )}
          </ul>
        </nav>
      </div>
      {expanded ? (
        <nav className="md:hidden" id="primary-navigation">
          <ul className="flex flex-col gap-3 pb-5 text-sm font-medium">
            {routes.filter(x => x.menuLabel).map(
              ({ menuLabel, path }) =>
                <li key={path}>
                  <Link
                    to={path}
                    className={
                      isActive(path)
                        ? 'text-foreground'
                        : 'text-muted-foreground transition hover:text-foreground'
                    }
                    onClick={() => setTimeout(() => setExpanded(false), 200)}
                  >
                    {menuLabel}
                  </Link>
                </li>
            )}
          </ul>
        </nav>
      ) : null}
    </BiografContainer>
  </header>;
}
