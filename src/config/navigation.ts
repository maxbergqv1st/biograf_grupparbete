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

export interface NavLink {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const commonLinks: NavLink[] = [
  { path: '/', label: 'common:mobileNav.movies', icon: Clapperboard },
  { path: '/offers', label: 'common:mobileNav.offers', icon: Tag },
  { path: '/about', label: 'common:mobileNav.aboutUs', icon: Info },
];

const visitorLinks: NavLink[] = [...commonLinks];

const visitorMobileLinks: NavLink[] = [
  ...commonLinks,
  { path: '/login', label: 'common:mobileNav.login', icon: LogIn },
];

const userLinks: NavLink[] = [
  { path: '/', label: 'common:mobileNav.movies', icon: Clapperboard },
  { path: '/offers', label: 'common:mobileNav.offers', icon: Tag },
  { path: '/my-bookings', label: 'common:mobileNav.bookings', icon: Ticket },
  { path: '/my-tickets', label: 'common:mobileNav.tickets', icon: TicketCheck },
  { path: '/about', label: 'common:mobileNav.aboutUs', icon: Info },
];

const userMobileLinks: NavLink[] = [
  { path: '/', label: 'common:mobileNav.movies', icon: Clapperboard },
  { path: '/profile', label: 'common:mobileNav.profile', icon: User },
  { path: '/offers', label: 'common:mobileNav.offers', icon: Tag },
  { path: '/my-bookings', label: 'common:mobileNav.bookings', icon: Ticket },
  { path: '/my-tickets', label: 'common:mobileNav.tickets', icon: TicketCheck },
  { path: '/about', label: 'common:mobileNav.aboutUs', icon: Info },
];

const adminLinks: NavLink[] = [
  ...userLinks,
  { path: '/admin', label: 'common:mobileNav.admin', icon: ShieldCheck },
];

const adminMobileLinks: NavLink[] = [
  ...userMobileLinks,
  { path: '/admin', label: 'common:mobileNav.admin', icon: ShieldCheck },
];

export function getNavLinks(options: {
  isLoggedIn: boolean;
  isAdmin?: boolean;
}): NavLink[] {
  if (options.isAdmin) return adminLinks;
  if (options.isLoggedIn) return userLinks;
  return visitorLinks;
}

export function getMobileNavLinks(options: {
  isLoggedIn: boolean;
  isAdmin?: boolean;
}): NavLink[] {
  if (options.isAdmin) return adminMobileLinks;
  if (options.isLoggedIn) return userMobileLinks;
  return visitorMobileLinks;
}
