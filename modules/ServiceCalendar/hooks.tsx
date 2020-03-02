import { useState, useEffect, useContext } from 'react';
import { EmployeesContext } from './main';

export const useEmployees = () => useContext(EmployeesContext);

export const useGetAll = (page = 0, fetchFn) => {
  const [loading, toggleLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  if (page === 0) {
    toggleLoading(!loading);
  }
  const res = fetchFn();
  setData([...data, res.resultsList]);

  if (page === 0) {
    toggleLoading(!loading);
  }
};
