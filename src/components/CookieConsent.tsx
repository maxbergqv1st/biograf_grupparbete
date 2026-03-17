import { useEffect, useState } from 'react';

import BiografButton from '@/components/custom/BiografButton';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieConsent');
    if (!accepted) setOpen(true);
  }, []);

  const handleConsent = (choice: 'all' | 'necessary') => {
    localStorage.setItem('cookieConsent', choice);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        // Lade till border och vår specifik färg #B69852 på hela boxen
        className="w-full max-w-md border border-[#B69852] p-5"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">
            Din integritet och cookies (GDPR)
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2 text-xs leading-relaxed">
            För att följa dataskyddslagen (GDPR) vill vi vara tydliga med hur vi
            hanterar dina uppgifter. Vi använder nödvändiga tekniska cookies för
            att inloggning och bokning ska fungera.{' '}
            <a
              href="https://pts.se/internet-och-telefoni/kakor-cookies/"
              target="_blank"
              rel="noopener noreferrer"
              //  färglänk som matchar
              className="text-[#B69852] underline underline-offset-2 transition-colors hover:text-[#B69852]/80"
            >
              Läs mer om kakor hos Post- och telestyrelsen.
            </a>
            <br />
            <br />
            Snart kommer vi även införa cookies för statistik och
            marknadsföring. Du kan redan nu välja om du vill tillåta dessa i
            framtiden, eller om du endast vill godkänna de som är helt
            nödvändiga.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {/* Knapp med outline i #B69852 och vit text */}
          <button
            onClick={() => handleConsent('necessary')}
            className="inline-flex h-8 w-full items-center justify-center rounded-md border border-[#B69852] bg-transparent px-4 text-[11px] text-white transition-colors hover:bg-[#B69852]/20 hover:text-white sm:w-auto"
          >
            Endast nödvändiga
          </button>

          <BiografButton
            variant="default"
            onClick={() => handleConsent('all')}
            className="h-8 w-full text-[11px] sm:w-auto"
          >
            Acceptera alla
          </BiografButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
