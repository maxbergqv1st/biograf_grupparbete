import { useState } from 'react';

import { Ellipsis } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

export type MobileNavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type MobileFooterNavProps = {
  items: MobileNavItem[];
  maxVisible?: number;
};

function MobileFooterNavItem({
  item,
  isActive,
}: {
  item: MobileNavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={cn(
        'flex items-center justify-center rounded-[20px] transition-all duration-300',
        isActive
          ? 'h-[58px] w-[113px] gap-2 bg-(--color-gold) font-semibold text-black'
          : 'h-[58px] w-[58px] bg-linear-to-r from-[#1F1F1F] to-[#333333] text-(--color-text-primary)',
      )}
    >
      <Icon className={cn(isActive ? 'h-6 w-6' : 'h-7 w-7')} />
      {isActive && <span className="text-sm">{item.label}</span>}
    </Link>
  );
}

function MobileFooterOverflow({
  items,
  hasActiveChild,
}: {
  items: MobileNavItem[];
  hasActiveChild: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center justify-center rounded-[20px] transition-all duration-300',
            hasActiveChild
              ? 'h-[58px] w-[113px] gap-2 bg-(--color-gold) font-semibold text-black'
              : 'h-[58px] w-[58px] bg-linear-to-r from-[#1F1F1F] to-[#333333] text-(--color-text-primary)',
          )}
        >
          <Ellipsis className="h-7 w-7" />
          {hasActiveChild && <span className="text-sm">Mer</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={16}
        align="end"
        className="w-auto min-w-[160px] rounded-[12px] border-(--color-gold) bg-[#1E1E1E] p-2"
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 rounded-lg p-2.5 text-(--color-text-primary) transition-colors hover:bg-linear-to-r hover:from-[#1F1F1F] hover:to-[#333333] hover:text-(--color-gold)"
              onClick={() => setOpen(false)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export default function MobileFooterNav({
  items,
  maxVisible = 3,
}: MobileFooterNavProps) {
  const { pathname } = useLocation();

  const hasOverflow = items.length > maxVisible;
  const visibleItems = hasOverflow ? items.slice(0, maxVisible) : items;
  const overflowItems = hasOverflow ? items.slice(maxVisible) : [];

  const isActive = (path: string) => pathname === path;
  const hasActiveOverflowChild = overflowItems.some((item) =>
    isActive(item.path),
  );

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center justify-around gap-2 rounded-[20px] bg-[#1E1E1E] p-3">
        {visibleItems.map((item) => (
          <MobileFooterNavItem
            key={item.path}
            item={item}
            isActive={isActive(item.path)}
          />
        ))}
        {hasOverflow && (
          <MobileFooterOverflow
            items={overflowItems}
            hasActiveChild={hasActiveOverflowChild}
          />
        )}
      </div>
    </nav>
  );
}
