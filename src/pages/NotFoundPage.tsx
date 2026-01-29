import { Link, useLocation } from "react-router-dom";
import BiografButton from "@/components/custom/BiografButton";

NotFoundPage.route = {
  path: '*'
};

export default function NotFoundPage() {
  return (
    <section className="flex flex-col gap-6 rounded-lg border bg-card p-8 text-center shadow-sm">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          404
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find a page that matches:
        </p>
        <p className="rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground">
          {useLocation().pathname}
        </p>
      </div>
      <div className="flex justify-center">
        <BiografButton asChild>
          <Link to="/">Back to the start page</Link>
        </BiografButton>
      </div>
    </section>
  );
}
