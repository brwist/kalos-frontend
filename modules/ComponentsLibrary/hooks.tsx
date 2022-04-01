import { useState, useEffect, useLayoutEffect } from 'react';
import { UserList } from '../../../@kalos-core/kalos-rpc/User';
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

export const useFetchAll = (fetchFn: () => Promise<UserList>) => {
  const [state, setState] = useState<State>(initialState);
  const { data, totalCount, fetchedCount } = state;
  useEffect(() => {
    if (totalCount === 0 || fetchedCount === 0) {
      (async () => {
        const res = await fetchFn();
        setState({
          data: res.getResultsList(),
          totalCount: res.getTotalCount(),
          fetchedCount: fetchedCount + res.getResultsList().length,
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
