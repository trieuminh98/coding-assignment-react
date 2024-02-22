/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { POST_DATA_METHOD, postData } from '../services/request.service';

const useQuery = <T>(url: string, handleErr?: () => void) => {
  const [data, setData] = useState<T>();
  const [isFetching, setIsFetching] = useState(false);

  async function query() {
    setIsFetching(true);
    const data = await fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong');
      })
      .catch((err) => {
        console.log(err);
        handleErr?.();
      });
    setData(data);
    setIsFetching(false);
  }

  useEffect(() => {
    query();
  }, []);

  const refetch = () => query();

  return { data, refetch, isFetching };
};

const usePostData = (method: POST_DATA_METHOD) => {
  const [isPosting, setPosting] = useState(false);

  const post = async <T>(url: string, payload?: T) => {
    setPosting(true);
    await postData(method, url, payload || {});
    setPosting(false);
  };

  return { post, isPosting };
};

export { usePostData, useQuery };
