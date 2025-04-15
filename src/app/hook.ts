import { useEffect, useState } from "react";

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

export function useDebounceQuery<T>(query: T, delay: number): T {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), delay);
    return () => clearTimeout(handler);
  }, [query, delay]);

  return debouncedQuery;
}