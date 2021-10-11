/* 

  Design Specification: converting this to React from Coldfusion
  https://app.kalosflorida.com/index.cfm?action=admin:contracts.edit&contract_id=3365&p=1

*/

import { Contract } from '@kalos-core/kalos-rpc/Contract';
import React, { useReducer, useEffect, useCallback, FC } from 'react';
import {
  ContractClientService,
  DevlogClientService,
  InvoiceClientService,
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
import { Loader } from '../../Loader/main';
import { Alert } from '../Alert';

export interface Output {
  contractData: Contract;
  propertiesSelected: Property[];
  invoiceData: Invoice;
}

interface props {
  userID: number;
  contractID: number;
  onSave: (savedContract: Output) => any;
  onClose: () => any;
  onChange?: (currentData: Output) => any;
}

export const EditContractInfo: FC<props> = ({
  userID,
  contractID,
  onSave,
  onClose,
  onChange,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    contractData: new Contract(),
    propertiesSelected: [],
    isValidating: false,
    invoiceData: new Invoice(),
    isSaving: false,
    error: undefined,
    fatalError: false,
  });
  console.log('FREQUENCY: ', state.contractData.getFrequency());
  console.log(
    'Group billing: ',
    state.contractData.getGroupBilling() === 1
      ? BILLING_OPTIONS.GROUP
      : BILLING_OPTIONS.SITE,
  );

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
        defaultValue: FREQUENCIES.SEMIANNUAL,
      },
    ],
    [
      {
        label: 'Group Billing',
        options: Object.values(BILLING_OPTIONS),
        name: 'getGroupBilling',
        required: true,
        defaultValue:
          state.contractData.getGroupBilling() === 1
            ? BILLING_OPTIONS.GROUP
            : BILLING_OPTIONS.SITE,
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

  const load = useCallback(async () => {
    try {
      let req = new Contract();
      req.setId(contractID);
      let res = await ContractClientService.Get(req);
      if (!res) {
        console.error(`Contract ${contractID} no longer exists.`);
        dispatch({
          type: ACTIONS.SET_ERROR,
          data: `The contract with the ID provided (${contractID}) no longer exists.`,
        });
        dispatch({
          type: ACTIONS.SET_FATAL_ERROR,
          data: true,
        });
        try {
          let devlog = new Devlog();
          devlog.setUserId(userID);
          devlog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          devlog.setIsError(1);
          devlog.setDescription(
            `Failed to get a contract with ID ${contractID}: contract no longer appears to exist.`,
          );
        } catch (err) {
          console.error('Failed to upload a devlog.');
        }
      }

      dispatch({ type: ACTIONS.SET_CONTRACT_DATA, data: res });
    } catch (err) {
      console.error(`An error occurred while loading a contract: ${err}`);
    }

    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [contractID, userID]);

  const save = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_SAVING, data: true });
    onSave({
      contractData: state.contractData,
      propertiesSelected: state.propertiesSelected,
      invoiceData: state.invoiceData,
    } as Output);
    let contractRes: Contract | undefined;
    let error: string = '';
    try {
      let reqContract = state.contractData;
      if (state.propertiesSelected)
        reqContract.setProperties(state.propertiesSelected.join(','));
      console.log('Req contract: ', reqContract);
      reqContract.setGroupBilling(
        // Casting to any because it is set in the form as a string
        (reqContract.getGroupBilling() as any) === 'Group' ? 1 : 0,
      );
      reqContract.setUserId(userID);
      reqContract.setDateCreated(format(new Date(), 'yyyy-mm-dd hh:mm:ss'));
      contractRes = await ContractClientService.Update(reqContract);
    } catch (err) {
      console.error(`An error occurred while upserting a contract: ${err}`);
      error = `${err}`;
      try {
        let devlog = new Devlog();
        devlog.setUserId(userID);
        devlog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        devlog.setIsError(1);
        devlog.setDescription(`Failed to upsert a contract with error: ${err}`);
        await DevlogClientService.Create(devlog);
      } catch (err) {
        console.error(`Failed to upload a devlog: ${err}`);
      }
    }

    if (!contractRes || error) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        data: `An error occurred while trying to save the contract: \n${error}.\n The contract was not saved, and the invoice will not be saved. Please contact the webtech team if this issue persists.`,
      });
      return;
    }

    try {
      let reqInvoice = new Invoice();
      reqInvoice.setContractId(contractRes!.getId());
      reqInvoice.setServicesperformedrow1(
        state.invoiceData.getServicesperformedrow1(),
      );
      reqInvoice.setTotalamountrow1(
        `${state.invoiceData.getTotalamountrow1()}`,
      );
      reqInvoice.setServicesperformedrow2(
        state.invoiceData.getServicesperformedrow2(),
      );
      reqInvoice.setTotalamountrow2(
        `${state.invoiceData.getTotalamountrow2()}`,
      );
      reqInvoice.setServicesperformedrow3(
        state.invoiceData.getServicesperformedrow3(),
      );
      reqInvoice.setTotalamountrow3(
        `${state.invoiceData.getTotalamountrow3()}`,
      );
      reqInvoice.setServicesperformedrow4(
        state.invoiceData.getServicesperformedrow4(),
      );
      reqInvoice.setTotalamountrow4(
        `${state.invoiceData.getTotalamountrow4()}`,
      );
      reqInvoice.setTotalamounttotal(
        `${state.invoiceData.getTotalamounttotal()}`,
      );
      reqInvoice.setTerms(state.invoiceData.getTerms());
      reqInvoice.setUserId(userID);
      reqInvoice.setFieldMaskList([
        'Totalamountrow1',
        'Totalamountrow2',
        'Totalamountrow3',
        'Totalamountrow4',
        'Totalamounttotal',
      ]);
      // don't forget to associate the invoice with the contract
      let invoiceRes = await InvoiceClientService.Create(reqInvoice);
    } catch (err) {
      console.error(`An error occurred while upserting an invoice: ${err}`);
    }
    dispatch({ type: ACTIONS.SET_SAVING, data: false });
  }, [
    onSave,
    state.contractData,
    state.invoiceData,
    state.propertiesSelected,
    userID,
  ]);

  const cleanup = useCallback(() => {}, []);

  const validateForSave = () => {
    if (state.propertiesSelected !== undefined) {
      if (state.propertiesSelected.length <= 0) {
        dispatch({ type: ACTIONS.SET_VALIDATING, data: true });
        return;
      }
    }

    save();
  };

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);

  console.log('Contract data: ', state.contractData);
  return (
    <>
      {state.isSaving || (!state.isLoaded && <Loader />)}
      {state.error && (
        <Alert
          title="Error"
          open={state.error !== undefined}
          onClose={() => {
            dispatch({ type: ACTIONS.SET_ERROR, data: undefined });
          }}
        >
          {state.error}
        </Alert>
      )}
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
            key={state.isLoaded.toString()}
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
                  invoiceData: state.invoiceData,
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
                  invoiceData: state.invoiceData,
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
          onSave={savedInvoice => {
            dispatch({
              type: ACTIONS.SET_INVOICE_DATA,
              data: makeSafeFormObject(savedInvoice, new Invoice()),
            });
            validateForSave();
          }}
          onChange={currentData => {
            dispatch({
              type: ACTIONS.SET_INVOICE_DATA,
              data: currentData,
            });
            if (onChange)
              onChange({
                contractData: state.contractData,
                propertiesSelected:
                  state.propertiesSelected !== undefined
                    ? state.propertiesSelected
                    : [],
                invoiceData: state.invoiceData,
              });
          }}
        />
      </SectionBar>
    </>
  );
};
