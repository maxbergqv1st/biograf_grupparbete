export default async function fetchJson(url: string, options = {}) {
  // Wait for a response from the REST api
  let response = await fetch(url, options);

  // Unpack/deserialize json into a data structure from the reponse
  let data = await response.json();

  return data;
}
