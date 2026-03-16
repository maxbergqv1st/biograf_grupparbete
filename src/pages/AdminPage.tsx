import MovieForm from "@/components/custom/MovieFrom";
import PosterUpload from "@/components/custom/PosterUpload";

AdminPage.route = {
  path: '/Admin',
  menuLabel: 'Admin',
  index: 3,
};

export default function AdminPage() {
  return (
    <>
    <MovieForm />
    <PosterUpload />
    </>
  )
}
