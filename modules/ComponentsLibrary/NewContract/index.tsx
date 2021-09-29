/* 

  Design Specification: 

*/

import { Contract } from '@kalos-core/kalos-rpc/Contract';
import React, { useReducer, useEffect, useCallback, FC } from 'react';
import {
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
} from '../../CustomerDetails/components/ContractInfo';
import { Form, Schema } from '../Form';
import { SectionBar } from '../SectionBar';
import { reducer, ACTIONS, FREQUENCIES, BILLING_OPTIONS } from './reducer';

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
  [
    {
      label: 'Frequency',
      options: Object.values(FREQUENCIES),
      name: 'getFrequency',
      required: true,
    },
  ],
  [
    {
      label: 'Group Billing',
      options: Object.values(BILLING_OPTIONS),
      name: 'getGroupBilling',
      required: true,
    },
  ],
  [
    {
      label: 'Payment Type',
      options: PAYMENT_TYPE_OPTIONS,
      name: 'getPaymentType',
      required: true,
    },
  ],
  [
    {
      label: 'Payment Status',
      options: PAYMENT_STATUS_OPTIONS,
      name: 'getPaymentStatus',
      required: true,
    },
  ],
];

export const NewContract: FC<props> = ({ onSave, onClose }) => {
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
  );
};
