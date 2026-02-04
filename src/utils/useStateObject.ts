import { useState } from 'react';

import { useOutletContext } from 'react-router-dom';

export interface AppState {
  categoryChoice: string;
  sortChoice: string;
  bwImages: boolean;
}

export function useStateObject<T extends Record<string, unknown>>(object: T) {
  const [state, setState] = useState<T>(object);
  function setter<K extends keyof T>(key: K, value: T[K]) {
    setState({ ...state, [key]: value });
  }
  return [state, setter] as const;
}

export function useStateContext() {
  return useOutletContext<
    readonly [
      AppState,
      <K extends keyof AppState>(key: K, value: AppState[K]) => void,
    ]
  >();
}
