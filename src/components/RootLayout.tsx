import { useState } from 'react';


import { useGetMe } from '@/api/hooks/useAuth';
import { navLinks } from '@/config/navigation';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';


import BiografButton from '@/components/custom/BiografButton';
import { BiografContainer } from '@/components/custom/BiografContainer';
import BiografSelect from '@/components/custom/BiografSelect';
import PopcornFooterCanvas from '@/components/custom/PopcornFooterCanvas';


import { useStateObject } from '@/utils/useStateObject';


import { LANGUAGES } from '../../i18n';


export default function RootLayout() {
  const [expanded, setExpanded] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: meData } = useGetMe();
  const user = meData?.data;


  const pathName = useLocation().pathname;


  const isActive = (path: string) => path === pathName;


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
              <img
                src="public\images\logo\Filmvisarnalogo.png"
                alt="Biograf"
                className="h-25 w-auto"
              />
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
                {navLinks.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className={
                        isActive(path)
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground transition'
                      }
                      onClick={() => setTimeout(() => setExpanded(false), 200)}
                    >
                      {t(label as string)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-3">
              <BiografSelect
                className="max-w-25"
                options={LANGUAGES.map((x) => ({ value: x }))}
                onValueChange={(lang) => i18n.changeLanguage(lang)}
                value={i18n.language}
              />
              <BiografButton
                variant="default"
                size="icon"
                className="shrink-0 rounded-full"
                aria-label={user ? 'Profile' : 'Login'}
                onClick={() => navigate(user ? '/profile' : '/login')}
              >
                <User className="h-8 w-8" />
              </BiografButton>
            </div>
          </div>
          {expanded && (
            <nav className="md:hidden" id="primary-navigation">
              <ul className="flex flex-col gap-3 pb-5 text-sm font-medium">
                {navLinks.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className={
                        isActive(path)
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground transition'
                      }
                      onClick={() => setTimeout(() => setExpanded(false), 200)}
                    >
                      {t(label as string)}
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


      <footer className="bg-muted/40 border-t py-8 relative">
        <PopcornFooterCanvas className="absolute inset-0 h-full w-full" />
        <BiografContainer className="text-muted-foreground relative z-10 flex flex-col items-center gap-4 text-center text-sm">
          <span className="text-foreground text-base font-semibold">
            Filmvisarna AB
          </span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </BiografContainer>
      </footer>
    </BiografContainer>
  );
}
