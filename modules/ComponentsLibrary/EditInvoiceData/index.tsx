/* 

  Design Specification: converting this to React from Coldfusion
  https://app.kalosflorida.com/index.cfm?action=admin:contracts.edit&contract_id=3365&p=1

*/

import { Invoice } from '@kalos-core/kalos-rpc/Invoice';
import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { makeSafeFormObject } from '../../../helpers';
import { Form, Schema } from '../Form';
import { reducer, ACTIONS } from './reducer';

interface props {
  userId: number;
  onClose: () => any;
  onSave: (savedInvoice: Invoice) => any;
  onChange?: (currentData: Invoice) => any;
}

export const EditInvoiceData: FC<props> = ({ onClose, onSave, onChange }) => {
  const INVOICE_SCHEMA: Schema<Invoice> = [
    [
      {
        label: 'Terms',
        name: 'getTerms',
        multiline: true,
      },
    ],
    [
      {
        label: 'Service Performed (1)',
        name: 'getServicesperformedrow1',
      },
      {
        label: 'Total Cost (1)',
        name: 'getTotalamountrow1',
        type: 'number',
      },
    ],
    [
      {
        label: 'Service Performed (2)',
        name: 'getServicesperformedrow2',
      },
      {
        label: 'Total Cost (2)',
        name: 'getTotalamountrow2',
        type: 'number',
      },
    ],
    [
      {
        label: 'Service Performed (3)',
        name: 'getServicesperformedrow3',
      },
      {
        label: 'Total Cost (3)',
        name: 'getTotalamountrow3',
        type: 'number',
      },
    ],
    [
      {
        label: 'Service Performed (4)',
        name: 'getServicesperformedrow4',
      },
      {
        label: 'Total Cost (4)',
        name: 'getTotalamountrow4',
        type: 'number',
      },
    ],
  ];

  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    invoiceData: new Invoice(),
  });

  const load = useCallback(() => {
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, []);

  const cleanup = useCallback(() => {}, []);

  const calculateTotal = useCallback((...amounts: number[]) => {
    return amounts.reduce((previous, current) => previous + current);
  }, []);

  useEffect(() => {
    load();

    return () => {
      cleanup();
    };
  }, [load, cleanup]);

  return (
    <>
      <Form<Invoice>
        data={state.invoiceData}
        schema={INVOICE_SCHEMA}
        onClose={() => onClose()}
        onSave={saved => onSave(makeSafeFormObject(saved, new Invoice()))}
        onChange={currentData => {
          let currentDataSafe = makeSafeFormObject(currentData, new Invoice());
          let total = calculateTotal(
            ...[
              Number(currentDataSafe.getTotalamountrow1()),
              Number(currentDataSafe.getTotalamountrow2()),
              Number(currentDataSafe.getTotalamountrow3()),
              Number(currentDataSafe.getTotalamountrow4()),
            ],
          );
          currentDataSafe.setTotalamounttotal(total.toString());
          dispatch({ type: ACTIONS.SET_INVOICE_DATA, data: currentDataSafe });
          if (onChange) onChange(currentData);
        }}
      />
      <Form<Invoice>
        key={
          state.invoiceData.getTotalamountrow1().toString() +
          state.invoiceData.getTotalamountrow2().toString() +
          state.invoiceData.getTotalamountrow3().toString() +
          state.invoiceData.getTotalamountrow4().toString()
        }
        data={state.invoiceData}
        schema={[
          [
            {
              label: 'Total Cost (Overall)',
              name: 'getTotalamounttotal',
              type: 'number',
            },
          ],
        ]}
        onClose={() => onClose()}
        onSave={saved => onSave(saved)}
        onChange={currentData => {
          let currentDataState = state.invoiceData;
          let currentDataSafe = makeSafeFormObject(currentData, new Invoice());
          currentDataState.setTotalamounttotal(
            currentDataSafe.getTotalamounttotal(),
          );
          dispatch({ type: ACTIONS.SET_INVOICE_DATA, data: currentDataState });
          if (onChange) onChange(currentDataState);
        }}
      />
    </>
  );
};
