import { useParams } from 'react-router-dom';

MovieDetailsPage.route = {
  path: '/movies/:id',
  parent: '/',
  menuLabel: 'MovieDetail',
  index: 2,
};

export default function MovieDetailsPage() {
  const { id } = useParams();

  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">Movie details</h1>
      <p>ID: {id}</p>
    </section>
  );
}
