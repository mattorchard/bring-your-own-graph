import { useCallback, useState } from "react";

const getInitialState = <T>(initialValue: T, storageKey: string) => () => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      return JSON.parse(raw);
    }
  } finally {
  }
  return initialValue;
};

const useLocalStorageBackedState = <T>(initialValue: T, storageKey: string) => {
  const [state, setState] = useState(getInitialState(initialValue, storageKey));
  const setStateAndSave = useCallback(
    value => {
      setState(value);
      localStorage.setItem(storageKey, JSON.stringify(value));
    },
    [storageKey]
  );
  return [state, setStateAndSave];
};

export default useLocalStorageBackedState;
