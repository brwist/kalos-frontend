/* 

  Design Specification: 

*/

import { Contract } from '@kalos-core/kalos-rpc/Contract';
import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { Form, Schema } from '../ComponentsLibrary/Form';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { PageWrapper } from '../PageWrapper/main';
import { reducer, ACTIONS } from './reducer';

// add any prop types here
interface props {
  userID: number;
  onSave: (savedContract: Contract) => any;
  onClose: () => any;
}

const NEW_CONTRACT_SCHEMA: Schema<Contract> = [
  [
    {
      label: 'Start Date',
      type: 'date',
      name: 'getDateStarted',
      required: true,
    },
  ],
  [
    {
      label: 'End Date',
      type: 'date',
      name: 'getDateEnded',
      required: true,
    },
  ],
];

export const NewContract: FC<props> = function NewContract({
  userID,
  onSave,
  onClose,
}) {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    contractData: new Contract(),
  });

  const load = useCallback(() => {
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, []);

  const cleanup = useCallback(() => {}, []);

  const save = useCallback(() => {
    onSave(state.contractData);
  }, [onSave, state.contractData]);

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
        actions={[{ label: 'Cancel', onClick: () => onClose() }]}
      >
        <Form
          schema={NEW_CONTRACT_SCHEMA}
          data={state.contractData}
          onSave={() => save()}
          onClose={() => onClose()}
        />
      </SectionBar>
    </PageWrapper>
  );
};
