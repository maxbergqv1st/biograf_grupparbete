export default async function productsLoader({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  let url = '/api/products';
  if (params.slug) {
    url += '?slug=' + params.slug;
  }
  return {
    products: await (await fetch(url)).json(),
  };
}
