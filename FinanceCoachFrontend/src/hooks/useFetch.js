// src/hooks/useFetch.js
import { useState, useEffect } from "react";

export default function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(url, options)
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Error fetching data");
        }
        return response.json();
      })
      .then((json) => {
        if (isMounted) setData(json);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Unknown error");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [url, options]);

  return { data, loading, error };
}
