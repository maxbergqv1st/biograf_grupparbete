import { BiografContainer } from '@/components/custom/BiografContainer';

export default function Footer() {
  return (
    <footer className="bg-muted/40 border-t py-8">
      <BiografContainer className="text-muted-foreground flex flex-col items-center gap-2 text-center text-sm">
        <span className="text-foreground text-base font-semibold">
          The Good Grocery
        </span>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </BiografContainer>
    </footer>
  );
}
