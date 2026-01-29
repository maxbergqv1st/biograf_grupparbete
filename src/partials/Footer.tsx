import { BiografContainer } from '@/components/custom/BiografContainer';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-8">
      <BiografContainer className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
        <span className="text-base font-semibold text-foreground">
          The Good Grocery
        </span>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </BiografContainer>
    </footer>
  );
}
