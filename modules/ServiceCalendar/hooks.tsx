import { useState, useEffect, useContext } from 'react';
import { EmployeesContext } from './main';

export const useEmployees = () => useContext(EmployeesContext);

type State = {
  data: any[],
  isLoading: boolean,
  page: number,
  totalCount: number,
  fetchedCount: number,
}

type Response = {
  resultsList: any[],
  totalCount: number,
}

export const useFetchAll = (fetchFn: (page: number) => Promise<Response>) => {
  const [state, setState] = useState<State>({
    data: [],
    isLoading: true,
    page: 0,
    totalCount: 0,
    fetchedCount: 0
  });
  const { data, isLoading, page, totalCount, fetchedCount } = state;

  useEffect(() => {
    if(fetchedCount < totalCount || !totalCount) {
      (async () => {
        const res = await fetchFn(page);
        setState({
          data: [...data, ...res.resultsList],
          totalCount: res.totalCount,
          fetchedCount: fetchedCount + res.resultsList.length,
          page: page + 1,
          isLoading: true,
        });
      })();
    } else if (fetchedCount === totalCount) {
      setState({
        ...state,
        isLoading: false,
      });
    }
  }, [fetchedCount, totalCount, fetchFn]);

  return { data, isLoading };
};
