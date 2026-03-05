export default async function moviesLoader({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  let url = '/api/movie';
  if (params.slug) {
    url += '?slug=' + params.slug;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`failed to fetch movies from database: ${res.status}`);
  }
  const resultToReturn = await res.json();
  return resultToReturn;
}
