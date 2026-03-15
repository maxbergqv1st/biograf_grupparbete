import { useState, type ReactNode } from "react";

import MovieForm from "@/components/custom/MovieFrom";
import PosterUpload from "@/components/custom/PosterUpload";
import InsertScreeningForm from "@/components/custom/InsertScreeningForm";

AdminPage.route = {
  path: '/Admin',
  menuLabel: 'Admin',
  index: 3,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"movies" | "posters" | "screening">("movies");

  const AdminMenu = (isActive: boolean) =>
    [
      "px-4 py-2 text-sm font-medium transition-colors",
      "border-b-2",
      isActive
        ? "border-[color:var(--color-gold)] text-[color:var(--color-gold)]"
        : "border-transparent text-[color:var(--color-gold-dark)] hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold)]",
    ].join(" ");

  let activeContent: ReactNode = null;
  switch (activeTab) {
    case "movies":
      activeContent = <MovieForm />;
      break;
    case "posters":
      activeContent = <PosterUpload />;
      break;
    case "screening":
      activeContent = <InsertScreeningForm />
      break;
    default:
      activeContent = null;
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-sm text--color-gold-dark">
          Välj ett admin-alternativ nedan.
        </p>
      </header>

      <nav className="flex gap-2 border-b border--color-gold-dark">
        <button
          type="button"
          className={AdminMenu(activeTab === "movies")}
          onClick={() => setActiveTab("movies")}
        >
          Filmer
        </button>
        <button
          type="button"
          className={AdminMenu(activeTab === "posters")}
          onClick={() => setActiveTab("posters")}
        >
          Affischer
        </button>
        <button
          type="button"
          className={AdminMenu(activeTab === "screening")}
          onClick={() => setActiveTab("screening")}
        >
          Screening
        </button>
      </nav>

      <div>{activeContent}</div>
    </section>
  );
}
