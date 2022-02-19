import {useEffect, useState} from 'react';

export const useDebounce = (value: any, delayMillis: number) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value);
    }, delayMillis);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delayMillis]);

  return debounced;
};
