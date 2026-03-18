import {
  Clapperboard,
  Info,
  LogIn,
  ShieldCheck,
  Tag,
  Ticket,
  TicketCheck,
  User,
} from 'lucide-react';

import type { MobileNavItem } from '@/components/custom/MobileFooterNav';

const commonItems: MobileNavItem[] = [
  { path: '/', label: 'common:mobileNav.movies', icon: Clapperboard },
  { path: '/offers', label: 'common:mobileNav.offers', icon: Tag },
  { path: '/about', label: 'common:mobileNav.aboutUs', icon: Info },
];

const visitorItems: MobileNavItem[] = [
  ...commonItems,
  { path: '/login', label: 'common:mobileNav.login', icon: LogIn },
];

const userItems: MobileNavItem[] = [
  { path: '/', label: 'common:mobileNav.movies', icon: Clapperboard },
  { path: '/profile', label: 'common:mobileNav.profile', icon: User },
  { path: '/offers', label: 'common:mobileNav.offers', icon: Tag },
  { path: '/about', label: 'common:mobileNav.aboutUs', icon: Info },
  { path: '/my-bookings', label: 'common:mobileNav.bookings', icon: Ticket },
  { path: '/my-tickets', label: 'common:mobileNav.tickets', icon: TicketCheck },
];

const adminItems: MobileNavItem[] = [
  ...userItems,
  { path: '/admin', label: 'common:mobileNav.admin', icon: ShieldCheck },
];

export function getMobileNavItems(options: {
  isLoggedIn: boolean;
  isAdmin?: boolean;
}): MobileNavItem[] {
  if (options.isAdmin) return adminItems;
  if (options.isLoggedIn) return userItems;
  return visitorItems;
}
