import { useState } from 'react';

import { useGetMe } from '@/api/hooks/useAuth';
import { getMobileNavLinks, getNavLinks } from '@/config/navigation';
import { MessageCircleMore, User, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { CookieConsent } from '@/components/CookieConsent';
import BiografButton from '@/components/custom/BiografButton';
import { BiografContainer } from '@/components/custom/BiografContainer';
import BiografSelect from '@/components/custom/BiografSelect';
import MobileFooterNav from '@/components/custom/MobileFooterNav';

import { useIsMobile } from '@/hooks/common/useIsMobile';

import { useStateObject } from '@/utils/useStateObject';

import { cn } from '@/lib/utils';

import { LANGUAGES } from '../../i18n';
import AiChat from '../parts/AiChat';

export default function RootLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: meData } = useGetMe();
  const user = meData?.data;

  const isMobile = useIsMobile();
  const pathName = location.pathname;

  const isActive = (path: string) => path === pathName;

  const [showChat, setShowChat] = useState(false);

  const stateAndSetter = useStateObject({
    categoryChoice: 'All',
    sortChoice: 'Price (low to high)',
    bwImages: false,
  });

  return (
    <BiografContainer variant="page" colorScheme="brand">
      {!isMobile && (
        <header className="sticky top-0 z-40 w-full border-b border-[#B69852]/20 bg-[#141414]/80 backdrop-blur-md">
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
              <nav className="flex" id="primary-navigation">
                <ul className="flex items-center gap-1">
                  {getNavLinks({ isLoggedIn: !!user }).map(({ label, path, icon: Icon }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        className={cn(
                          'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                          isActive(path)
                            ? 'bg-[#B69852] text-black shadow-[0px_0px_10px_rgba(182,152,82,0.3)]'
                            : 'text-[#F3EEE4]/70 hover:bg-white/5 hover:text-[#F3EEE4]',
                        )}
                      >
                        <Icon className="h-4 w-4" />
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
          </BiografContainer>
        </header>
      )}

      {isMobile && (
        <header className="sticky top-0 z-40 flex w-full items-center justify-center border-b border-[#B69852]/20 bg-[#141414]/80 py-2 backdrop-blur-md">
          <Link to="/">
            <img
              src="public/images/logo/Filmvisarnalogo.png"
              alt="Biograf"
              className="h-12 w-auto"
            />
          </Link>
        </header>
      )}

      <main className={cn('flex-1 py-10', isMobile && 'pb-28')}>
        <BiografContainer className={cn('space-y-10', isMobile && 'px-1')}>
          <Outlet context={stateAndSetter} />
        </BiografContainer>
      </main>

      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed right-4 bottom-32 z-50 rounded-full bg-[#B69852] p-3 text-white shadow-lg hover:bg-[#a08547]"
      >
        <MessageCircleMore size={24} />
      </button>

      {showChat && (
        <div className="fixed right-4 bottom-20 z-50 flex h-[400px] w-80 flex-col rounded-lg border-2 border-[#B69852] bg-[#141414] shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-[#B69852] p-3">
            <h3 className="font-bold text-[#F3EEE4]">Chatta med Margot</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-[#F3EEE4] hover:text-[#B69852]"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-grow overflow-auto">
            <AiChat />
          </div>
        </div>
      )}

      <footer className={cn('bg-muted/40 border-t py-8', isMobile && 'pb-28')}>
        <BiografContainer className="text-muted-foreground flex flex-col items-center gap-2 text-center text-sm">
          <span className="text-foreground text-base font-semibold">
            Filmvisarna AB
          </span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </BiografContainer>
      </footer>
      <CookieConsent />
      {isMobile && (
        <MobileFooterNav
          items={getMobileNavLinks({ isLoggedIn: !!user })}
          languagePicker={{
            languages: LANGUAGES,
            currentLanguage: i18n.language,
            onChangeLanguage: (lang) => i18n.changeLanguage(lang),
          }}
        />
      )}
    </BiografContainer>
  );
}
