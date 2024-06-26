import { useEffect, useState } from "preact/hooks";
import type { FetchOptions } from "./types.ts";

/**
 * Hook for fetching data from a URL
 * @param url url to fetch data from
 * @param options fetch options: method, headers, body
 * @returns {data, loading, error, refetch} data is the fetched data, loading is a boolean indicating if the fetch is in progress, error is the error if the fetch failed, refetch is a function to refetch the data
 * @example const { data, loading, error, refetch } = useFetch<DataType>("https://api.example.com/data");
 * @example const { data, loading, error } = useFetch<DataType>("https://api.example.com/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "value" }) });
 */
export function useFetch<Type>(
  url: string,
  options?: FetchOptions
): {
  data: Type | null;
  loading: boolean;
  error: Error | null;
  refetch: (newURL?: string, newOptions?: FetchOptions) => void;
} {
  const [data, setData] = useState<Type | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [url, options]);

  const refetch = (newURL?: string, newOptions?: FetchOptions) => {
    setLoading(true);
    setError(null);
    fetch(newURL || url, newOptions || options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  return { data, loading, error, refetch };
}
