import { useEffect, useState } from "react";
import { useTelegram } from "./useTelegram";

export const useFetch = (url = "api", method = "GET", options = {}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      const response = await fetch(
        `https://mr-zayafkachi.uz/api/iii.php/${url}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer your_token",
          },
          ...options.body,
        }
      );
      const data = await response.json();
      console.log(data, options.body);

      setData(data);
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, error, loading };
};
