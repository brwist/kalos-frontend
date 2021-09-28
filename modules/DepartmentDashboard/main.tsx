/* 

  Design Specification: 

*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { PageWrapper } from '../PageWrapper/main';
import { reducer, ACTIONS } from './reducer';
import { DepartmentDashboard as DepartmentDashboardComponent } from '../ComponentsLibrary/DepartmentDashboard';
// add any prop types here
interface props {
  userID: number;
}

export const DepartmentDashboard: FC<props> = function DepartmentDashboard({
  userID,
}) {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
  });

  const load = useCallback(() => {
    // RPCs that are in here should be stubbed in the tests at least 9 times out of 10.
    // This ensures that the fake data gets "loaded" instantly and the tests can progress quickly and without RPC errors
    // For some examples, check out /test/modules/Teams or /test/modules/Payroll

    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, []);

  const cleanup = useCallback(() => {
    // TODO clean up your function calls here (called once the component is unmounted, prevents "Can't perform a React state update on an unmounted component" errors)
    // This is important for long-term performance of our components
  }, []);

  useEffect(() => {
    load();

    return () => {
      cleanup();
    };
  }, [load, cleanup]);

  return (
    <PageWrapper userID={userID} withHeader>
      <DepartmentDashboardComponent
        userId={userID}
      ></DepartmentDashboardComponent>
    </PageWrapper>
  );
};
