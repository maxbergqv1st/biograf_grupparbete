export default async function moviesLoader({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  let url = '/api/v1/movies';
  if (params.id) {
    url += '/' + params.id;
  } else if (params.slug) {
    url += '?slug=' + params.slug;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`failed to fetch movies from database: ${res.status}`);
  }
  return await res.json();
}
