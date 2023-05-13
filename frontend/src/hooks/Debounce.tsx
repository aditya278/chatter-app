import { useEffect, useState } from "react";

export const useDebounce = (value: string, milliseconds: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, milliseconds);

    return () => {
      clearTimeout(handler);
    }
  }, [value, milliseconds]);

  return debouncedValue;
};