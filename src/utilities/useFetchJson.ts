import { useEffect, useState } from 'react';

import fetchJson from './fetchJson';

export default function useFetchJson<Type>(url: string) {
  //Set the data to null until the fetch is complete, then set it to the fetched data
  const [data, setData] = useState<Type | null>(null);

  useEffect(() => {
    //Calling use effect with an empty dependency array means it will only run once, when the component mounts. This is perfect for fetching data from an API, as we only want to fetch the data once when the component loads.
    (async () => {
      setData(await fetchJson(url));
    })();
  }, []);

  async function reloadData() {
    setData(await fetchJson(url));
  }

  return [data, reloadData] as const;
}
