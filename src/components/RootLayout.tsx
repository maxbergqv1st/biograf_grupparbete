import { useState } from 'react';

import { LANGUAGES } from '@/i18n';
import routes from '@/routes';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { BiografContainer } from '@/components/custom/BiografContainer';
import BiografSelect from '@/components/custom/BiografSelect';

import { useStateObject } from '@/utils/useStateObject';

export default function RootLayout() {
  const [expanded, setExpanded] = useState(false);
  const { t, i18n } = useTranslation();

  const pathName = useLocation().pathname;
  const currentRoute = routes
    .slice()
    .sort((a, b) => (a.path.length > b.path.length ? -1 : 1))
    .find((x) => pathName.indexOf(x.path.split(':')[0]) === 0);
  const isActive = (path: string) =>
    path === currentRoute?.path || path === currentRoute?.parent;

  const stateAndSetter = useStateObject({
    categoryChoice: 'All',
    sortChoice: 'Price (low to high)',
    bwImages: false,
  });

  return (
    <BiografContainer variant="page" colorScheme="brand">
      <header className="bg-accent/50 sticky top-0 z-40 w-full border-b backdrop-blur-md">
        <BiografContainer>
          <div className="flex h-16 items-center justify-between">
            <Link
              className="text-foreground text-lg font-semibold tracking-tight"
              to="/"
            >
              The Good Grocery
            </Link>
            <button
              className="border-input text-foreground hover:bg-accent rounded-md border px-3 py-1.5 text-sm font-medium transition md:hidden"
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
                {routes
                  .filter((x) => x.menuLabel)
                  .map(({ menuLabel, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        className={
                          isActive(path)
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground transition'
                        }
                        onClick={() =>
                          setTimeout(() => setExpanded(false), 200)
                        }
                      >
                        {t(menuLabel as string)}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
            <BiografSelect
              className="max-w-25"
              options={LANGUAGES.map((x) => ({ value: x }))}
              onValueChange={(lang) => i18n.changeLanguage(lang)}
              value={i18n.language}
            />
          </div>
          {expanded && (
            <nav className="md:hidden" id="primary-navigation">
              <ul className="flex flex-col gap-3 pb-5 text-sm font-medium">
                {routes
                  .filter((x) => x.menuLabel)
                  .map(({ menuLabel, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        className={
                          isActive(path)
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground transition'
                        }
                        onClick={() =>
                          setTimeout(() => setExpanded(false), 200)
                        }
                      >
                        {t(menuLabel as string)}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          )}
        </BiografContainer>
      </header>

      <main className="flex-1 py-10">
        <BiografContainer className="space-y-10">
          <Outlet context={stateAndSetter} />
        </BiografContainer>
      </main>

      <footer className="bg-muted/40 border-t py-8">
        <BiografContainer className="text-muted-foreground flex flex-col items-center gap-2 text-center text-sm">
          <span className="text-foreground text-base font-semibold">
            The Good Grocery
          </span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </BiografContainer>
      </footer>
    </BiografContainer>
  );
}
