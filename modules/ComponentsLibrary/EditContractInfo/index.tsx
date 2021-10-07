/* 

  Design Specification: converting this to React from Coldfusion
  https://app.kalosflorida.com/index.cfm?action=admin:contracts.edit&contract_id=3365&p=1

*/

import { Contract } from '@kalos-core/kalos-rpc/Contract';
import React, { useReducer, useEffect, useCallback, FC } from 'react';
import {
  ContractClientService,
  DevlogClientService,
  makeSafeFormObject,
} from '../../../helpers';
import {
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
} from '../../CustomerDetails/components/ContractInfo';
import { Form, Schema } from '../Form';
import { SectionBar } from '../SectionBar';
import { reducer, ACTIONS, FREQUENCIES, BILLING_OPTIONS } from './reducer';
import { PropertyDropdown } from '../PropertyDropdown/index';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { Confirm } from '../Confirm';
import { EditInvoiceData } from '../EditInvoiceData';
import { Devlog } from '@kalos-core/kalos-rpc/Devlog';
import { format } from 'date-fns';
import { Invoice } from '@kalos-core/kalos-rpc/Invoice';

export interface Output {
  contractData: Contract;
  propertiesSelected: Property[];
}

interface props {
  userID: number;
  onSave: (savedContract: Output) => any;
  onClose: () => any;
  onChange?: (currentData: Output) => any;
}

const CONTRACT_SCHEMA: Schema<Contract> = [
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

export const EditContractInfo: FC<props> = ({
  userID,
  onSave,
  onClose,
  onChange,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    contractData: new Contract(),
    propertiesSelected: [],
    isValidating: false,
  });

  const load = useCallback(() => {
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, []);

  const save = useCallback(
    async (contractData: Contract, propertiesSelected: Property[]) => {
      try {
        let reqContract = contractData;
        reqContract.setProperties(propertiesSelected.join(','));
        const res = await ContractClientService.Create(reqContract);
        console.log('Result of upload: ', res);
      } catch (err) {
        console.error(`An error occurred while upserting a contract: ${err}`);
        try {
          let devlog = new Devlog();
          devlog.setUserId(userID);
          devlog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          devlog.setIsError(1);
          devlog.setDescription(
            `Failed to upsert a contract with error: ${err}`,
          );
          await DevlogClientService.Create(devlog);
        } catch (err) {
          console.error(`Failed to upload a devlog: ${err}`);
        }
      }

      try {
        let reqInvoice = new Invoice();
        console.error('Save invoice here');
      } catch (err) {
        console.error(`An error occurred while upserting an invoice: ${err}`);
      }
    },
    [userID],
  );

  const cleanup = useCallback(() => {}, []);

  const validateForSave = () => {
    if (state.propertiesSelected !== undefined) {
      if (state.propertiesSelected.length <= 0) {
        dispatch({ type: ACTIONS.SET_VALIDATING, data: true });
        return;
      }
    }

    onSave({
      contractData: state.contractData,
      propertiesSelected: state.propertiesSelected,
    } as Output);
  };

  useEffect(() => {
    load();

    return () => {
      cleanup();
    };
  }, [load, cleanup]);

  return (
    <>
      {state.isValidating && (
        <Confirm
          title="Confirm Save"
          open={true}
          onClose={() =>
            dispatch({ type: ACTIONS.SET_VALIDATING, data: false })
          }
          onConfirm={() => {
            onSave({
              contractData: state.contractData,
              propertiesSelected: state.propertiesSelected,
            } as Output);
            dispatch({ type: ACTIONS.SET_VALIDATING, data: false });
          }}
        >
          There are no properties selected in the properties dropdown. No
          properties will be associated with the contract. Are you sure you wish
          to continue?
        </Confirm>
      )}
      <SectionBar
        title="New Contract"
        actions={[
          { label: 'Cancel', onClick: () => onClose() },
          { label: 'Save', onClick: () => validateForSave() },
        ]}
      >
        <div style={{ width: '75%', display: 'inline-block' }}>
          <Form<Contract>
            schema={CONTRACT_SCHEMA}
            data={state.contractData}
            onSave={() => validateForSave()}
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
              if (onChange)
                onChange({
                  contractData: req,
                  propertiesSelected: state.propertiesSelected,
                } as Output);
            }}
          />
        </div>
        <div
          style={{
            width: '20%',
            display: 'inline-block',
            verticalAlign: 'top',
          }}
        >
          <PropertyDropdown
            userId={userID}
            onSave={propertyData =>
              console.log('Saving property data: ', propertyData)
            }
            onClose={() => {}}
            onChange={propertyData => {
              dispatch({
                type: ACTIONS.SET_PROPERTIES_SELECTED,
                data: propertyData,
              });
              if (onChange)
                onChange({
                  contractData: state.contractData,
                  propertiesSelected: propertyData,
                } as Output);
            }}
          />
        </div>
      </SectionBar>
      <SectionBar
        title="Invoice Data"
        actions={[
          { label: 'Cancel', onClick: () => onClose() },
          { label: 'Save', onClick: () => validateForSave() },
        ]}
      >
        <EditInvoiceData
          userId={userID}
          onClose={() => onClose()}
          onSave={savedInvoice => validateForSave()}
          onChange={currentData => {
            console.log(
              'Make sure to assign this to the stuff to save, and then save that as well! ',
              currentData,
            );
          }}
        />
      </SectionBar>
    </>
  );
};
