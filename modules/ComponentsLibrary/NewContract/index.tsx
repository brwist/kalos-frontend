/* 

  Design Specification: 

*/

import { Contract } from '@kalos-core/kalos-rpc/Contract';
import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { makeSafeFormObject } from '../../../helpers';
import {
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
} from '../../CustomerDetails/components/ContractInfo';
import { Form, Schema } from '../Form';
import { SectionBar } from '../SectionBar';
import { reducer, ACTIONS, FREQUENCIES, BILLING_OPTIONS } from './reducer';
import { PropertyDropdown } from '../PropertyDropdown/index';

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
  [
    {
      label: 'Payment Terms',
      type: 'text',
      name: 'getPaymentTerms',
    },
  ],
  [
    {
      label: 'Notes',
      type: 'text',
      multiline: true,
      name: 'getNotes',
    },
  ],
];

export const NewContract: FC<props> = ({ userID, onSave, onClose }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    contractData: new Contract(),
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
    <SectionBar
      title="New Contract"
      actions={[
        { label: 'Cancel', onClick: () => onClose() },
        { label: 'Save', onClick: () => onSave(state.contractData) },
      ]}
    >
      <div style={{ width: '75%', display: 'inline-block' }}>
        <Form<Contract>
          schema={NEW_CONTRACT_SCHEMA}
          data={state.contractData}
          onSave={contractData => onSave(contractData)}
          onClose={() => onClose()}
          onChange={contractData => {
            let req = makeSafeFormObject(contractData, new Contract());
            switch (req.getFrequency() as any) {
              case FREQUENCIES.MONTHLY:
                req.setFrequency(30);
                break;
              case FREQUENCIES.BIMONTHLY:
                req.setFrequency(60);
                break;
              case FREQUENCIES.QUARTERLY:
                req.setFrequency(90);
                break;
              case FREQUENCIES.SEMIANNUAL:
                req.setFrequency(182);
                break;
              case FREQUENCIES.ANNUAL:
                req.setFrequency(365);
                break;
            }
            dispatch({
              type: ACTIONS.SET_CONTRACT_DATA,
              data: req,
            });
          }}
        />
      </div>
      <div
        style={{ width: '20%', display: 'inline-block', verticalAlign: 'top' }}
      >
        <PropertyDropdown
          userId={userID}
          onSave={propertyData =>
            console.log('Saving property data: ', propertyData)
          }
          onClose={() => {}}
          onChange={propertyData =>
            console.log('Changed property data: ', propertyData)
          }
        />
      </div>
    </SectionBar>
  );
};
