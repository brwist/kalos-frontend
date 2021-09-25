/* 

  Design Specification: 

*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { PageWrapper } from '../PageWrapper/main';
import { reducer, ACTIONS } from './reducer';

// add any prop types here
interface props {
  userID: number;
}

export const NewContract: FC<props> = function NewContract({ userID }) {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
  });

  const load = useCallback(() => {
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, []);

  const cleanup = useCallback(() => {}, []);

  useEffect(() => {
    load();

    return () => {
      cleanup();
    };
  }, [load, cleanup]);

  return (
    <PageWrapper userID={userID} withHeader>
      <SectionBar
        title="New Contract"
        actions={[{ label: 'Cancel', onClick: () => alert('Cancel') }]}
      ></SectionBar>
    </PageWrapper>
  );
};
