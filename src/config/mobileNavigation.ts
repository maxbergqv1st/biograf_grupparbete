import { Clapperboard, Calendar, Ticket, Info, Eye } from 'lucide-react';

import type { MobileNavItem } from '@/components/custom/MobileFooterNav';

export const mobileNavItems: MobileNavItem[] = [
  { path: '/', label: 'Filmer', icon: Clapperboard },
  { path: '/booking', label: 'Kalender', icon: Calendar },
  { path: '/seats', label: 'Biljetter', icon: Ticket },
  { path: '/about', label: 'Om oss', icon: Info },
  { path: '/our-vision', label: 'Vision', icon: Eye },
];
