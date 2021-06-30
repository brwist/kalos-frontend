import { useState, useEffect, useLayoutEffect } from 'react';

type State = {
  data: any[];
  totalCount: number;
  fetchedCount: number;
};

type Response = {
  resultsList: any[];
  totalCount: number;
};

const initialState = {
  data: [],
  totalCount: 0,
  fetchedCount: 0,
};

export const useFetchAll = (fetchFn: () => Promise<Response>) => {
  const [state, setState] = useState<State>(initialState);
  const { data, totalCount, fetchedCount } = state;
  useEffect(() => {
    if (totalCount === 0 || fetchedCount === 0) {
      (async () => {
        const res = await fetchFn();
        setState({
          data: [...data, ...res.resultsList],
          totalCount: res.totalCount,
          fetchedCount: fetchedCount + res.resultsList.length,
        });
      })();
    }
  }, [fetchedCount, totalCount, fetchFn, data]);
  return { data, isLoading: false };
};

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};
