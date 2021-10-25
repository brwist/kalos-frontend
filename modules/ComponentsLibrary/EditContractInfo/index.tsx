/* 

  Design Specification: converting this to React from Coldfusion
  https://app.kalosflorida.com/index.cfm?action=admin:contracts.edit&contract_id=3365&p=1

*/

import { Contract } from '@kalos-core/kalos-rpc/Contract';
import React, { useReducer, useEffect, useCallback, FC } from 'react';
import {
  ContractClientService,
  DevlogClientService,
  EventClientService,
  InvoiceClientService,
  JobSubtypeClientService,
  JobTypeClientService,
  JobTypeSubtypeClientService,
  makeSafeFormObject,
  PropertyClientService,
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
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Request } from '../ServiceCall/components/Request';
import { OPTION_BLANK } from '../../../constants';
import {
  CANCEL_LABEL,
  CONFIRM_SAVE_DIALOG,
  CONFIRM_SAVE_LABEL,
  CONTRACT_SECTION_NAME,
  ERROR_LABEL,
  INVOICE_SECTION_NAME,
  SAVE_LABEL,
  SERVICE_CALL_SECTION_NAME,
  SERVICE_CALL_SUBTITLE,
} from './constants';

export interface Output {
  contractData: Contract;
  propertiesSelected: Property[];
  invoiceData: Invoice;
}

interface props {
  userID: number;
  contractID: number;
  onSaveStarted?: (savedContract: Output) => any;
  onSaveFinished?: (savedContract: Output) => any;
  onClose: () => any;
  onChange?: (currentData: Output) => any;
}

export const EditContractInfo: FC<props> = ({
  userID,
  contractID,
  onSaveStarted,
  onSaveFinished,
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
    invoiceId: -1,
    contractEvents: [],
    jobTypes: [],
    jobSubtypes: [],
    jobTypeSubtypes: [],
    eventPage: 0,
    initiatedSchema: [],
  });

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

  const getContract = useCallback(async () => {
    let res;
    try {
      let req = new Contract();
      req.setId(contractID);
      res = await ContractClientService.Get(req);
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
          await DevlogClientService.Create(devlog);
        } catch (err) {
          console.error('Failed to upload a devlog.');
        }
      }

      switch (res.getFrequency()) {
        case 30:
          // @ts-expect-error
          res.setFrequency(FREQUENCIES.MONTHLY);
          break;
        case 60:
          // @ts-expect-error
          res.setFrequency(FREQUENCIES.BIMONTHLY);
          break;
        case 90:
          // @ts-expect-error
          res.setFrequency(FREQUENCIES.QUARTERLY);
          break;
        case 182:
          // @ts-expect-error
          res.setFrequency(FREQUENCIES.SEMIANNUAL);
          break;
        case 365:
          // @ts-expect-error
          res.setFrequency(FREQUENCIES.ANNUAL);
          break;
      }

      switch (res.getGroupBilling()) {
        case 0:
          // @ts-expect-error
          res.setGroupBilling('Site');
          break;
        case 1:
          // @ts-expect-error
          res.setGroupBilling('Group');
          break;
      }

      dispatch({ type: ACTIONS.SET_CONTRACT_DATA, data: res });
    } catch (err) {
      console.error(`An error occurred while loading a contract: ${err}`);
    }

    return res;
  }, [contractID, userID]);

  const getContractEvents = useCallback(async () => {
    try {
      let req = new Event();
      req.setContractId(contractID);
      req.setIsActive(1);
      const res = await EventClientService.BatchGet(req);
      if (res.getTotalCount() === 0) {
        throw new Error('No event / job exists for this contract.');
      } else {
        dispatch({
          type: ACTIONS.SET_CONTRACT_EVENTS,
          data: res.getResultsList(),
        });
      }
    } catch (err) {
      console.error(
        `An error occurred while looking for an event with corresponding contract with id: ${contractID}`,
      );
      dispatch({
        type: ACTIONS.SET_ERROR,
        data: `The event for the contract with ID ${contractID} failed to load: ${err}`,
      });
      try {
        let devlog = new Devlog();
        devlog.setUserId(userID);
        devlog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        devlog.setIsError(1);
        devlog.setDescription(
          `An error occurred while looking for an event with corresponding contract with id: ${contractID}`,
        );
        await DevlogClientService.Create(devlog);
      } catch (err) {
        console.error('Failed to upload a devlog.');
      }
    }
  }, [contractID, userID]);

  const getProperties = useCallback(
    async (contract: Contract) => {
      let propertiesRes: Property[] = [];
      try {
        let propertiesReq = new Property();
        propertiesReq.setUserId(userID);
        propertiesReq.setIsActive(1);

        propertiesRes = (
          await PropertyClientService.BatchGet(propertiesReq)
        ).getResultsList();

        let propertiesSelected: Property[] = [];
        contract
          .getProperties()
          .split(',')
          .forEach(async result => {
            const filtered = propertiesRes.filter(property => {
              return property.getId() === Number(result);
            });
            filtered.forEach(f => propertiesSelected.push(f));
          });
        dispatch({
          type: ACTIONS.SET_PROPERTIES_SELECTED,
          data: propertiesSelected,
        });
      } catch (err) {
        console.error(
          `An error occurred while loading the properties for contract ${contractID} - ${err}`,
        );
        dispatch({ type: ACTIONS.SET_FATAL_ERROR, data: true });
      }
    },
    [contractID, userID],
  );

  const getJobTypes = useCallback(async () => {
    try {
      const jobTypes = await JobTypeClientService.loadJobTypes();
      dispatch({ type: ACTIONS.SET_JOB_TYPES, data: jobTypes });
    } catch (err) {
      console.error(`An error occurred while getting job types: ${contractID}`);
      dispatch({
        type: ACTIONS.SET_ERROR,
        data: `Job types failed to load: ${err}`,
      });
      try {
        let devlog = new Devlog();
        devlog.setUserId(userID);
        devlog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        devlog.setIsError(1);
        devlog.setDescription(
          `An error occurred while getting job types: ${contractID}`,
        );
        await DevlogClientService.Create(devlog);
      } catch (err) {
        console.error('Failed to upload a devlog.');
      }
    }
  }, [contractID, userID]);

  const getJobSubtypes = useCallback(async () => {
    try {
      const jobSubtypes = await JobSubtypeClientService.loadJobSubtypes();
      dispatch({ type: ACTIONS.SET_JOB_SUBTYPES, data: jobSubtypes });
    } catch (err) {
      console.error(
        `An error occurred while getting job subtypes: ${contractID}`,
      );
      dispatch({
        type: ACTIONS.SET_ERROR,
        data: `Job subtypes failed to load: ${err}`,
      });
      try {
        let devlog = new Devlog();
        devlog.setUserId(userID);
        devlog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        devlog.setIsError(1);
        devlog.setDescription(
          `An error occurred while getting job subtypes: ${contractID}`,
        );
        await DevlogClientService.Create(devlog);
      } catch (err) {
        console.error('Failed to upload a devlog.');
      }
    }
  }, [contractID, userID]);

  const getJobTypeSubtypes = useCallback(async () => {
    try {
      const jobTypeSubtypes =
        await JobTypeSubtypeClientService.loadJobTypeSubtypes();
      dispatch({ type: ACTIONS.SET_JOB_TYPE_SUBTYPES, data: jobTypeSubtypes });
    } catch (err) {
      console.error(
        `An error occurred while getting job type subtypes: ${contractID}`,
      );
      dispatch({
        type: ACTIONS.SET_ERROR,
        data: `Job type subtypes failed to load: ${err}`,
      });
      try {
        let devlog = new Devlog();
        devlog.setUserId(userID);
        devlog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        devlog.setIsError(1);
        devlog.setDescription(
          `An error occurred while getting job type subtypes: ${contractID}`,
        );
        await DevlogClientService.Create(devlog);
      } catch (err) {
        console.error('Failed to upload a devlog.');
      }
    }
  }, [contractID, userID]);

  const doesInvoiceExistAlready = useCallback(async () => {
    try {
      let req = new Invoice();
      req.setContractId(contractID);
      const res = await InvoiceClientService.BatchGet(req);
      if (res.getTotalCount() === 0) {
        return -1;
      } else if (res.getTotalCount() === 1) {
        return res.getResultsList()[0].getId();
      } else {
        console.error(
          'More than one invoice associated with this contract - using the first in the array.',
        );
        return res.getResultsList()[0].getId();
      }
    } catch (err) {
      console.error(`An error occurred while batch getting invoices: ${err}`);
      return -1; // return false to be safe
    }
  }, [contractID]);

  const load = useCallback(async () => {
    let res = await getContract(); // contract res

    if (!res) {
      console.error(
        `Cannot continue with property request without the contract result. Returning.`,
      );
      dispatch({ type: ACTIONS.SET_FATAL_ERROR, data: true });
      return;
    }

    await getContractEvents();

    await getProperties(res);

    await getJobTypes();

    await getJobSubtypes();

    await getJobTypeSubtypes();

    dispatch({
      type: ACTIONS.SET_INVOICE_ID,
      data: await doesInvoiceExistAlready(),
    });

    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [
    doesInvoiceExistAlready,
    getContract,
    getContractEvents,
    getJobSubtypes,
    getJobTypeSubtypes,
    getJobTypes,
    getProperties,
  ]);

  const saveContract = useCallback(async () => {
    if (onSaveStarted)
      onSaveStarted({
        contractData: state.contractData,
        propertiesSelected: state.propertiesSelected,
        invoiceData: state.invoiceData,
      } as Output);
    let contractRes: Contract | undefined;
    let error: string = '';
    let reqContract = state.contractData;
    try {
      reqContract.setId(contractID);
      if (state.propertiesSelected !== undefined) {
        reqContract.setProperties(
          state.propertiesSelected
            .map(property => `${property.getId()}`)
            .join(','),
        );
      } else {
        reqContract.setProperties('');
      }
      reqContract.setGroupBilling(
        // Casting to any because it is set in the form as a string
        (reqContract.getGroupBilling() as any) === 'Group' ? 1 : 0,
      );
      reqContract.setFieldMaskList(['Properties', 'GroupBilling']);

      switch (reqContract.getFrequency()) {
        // @ts-expect-error
        case FREQUENCIES.MONTHLY:
          reqContract.setFrequency(30);
          break;
        // @ts-expect-error
        case FREQUENCIES.BIMONTHLY:
          reqContract.setFrequency(60);
          break;
        // @ts-expect-error
        case FREQUENCIES.QUARTERLY:
          reqContract.setFrequency(90);
          break;
        // @ts-expect-error
        case FREQUENCIES.SEMIANNUAL:
          reqContract.setFrequency(182);
          break;
        // @ts-expect-error
        case FREQUENCIES.ANNUAL:
          reqContract.setFrequency(365);
          break;
      }
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

    return contractRes;
  }, [
    contractID,
    onSaveStarted,
    state.contractData,
    state.invoiceData,
    state.propertiesSelected,
    userID,
  ]);

  const saveInvoice = useCallback(
    async (contract: Contract) => {
      try {
        let reqInvoice = new Invoice();
        reqInvoice.setLogPaymentType(contract.getPaymentType());
        reqInvoice.setLogPaymentStatus(contract.getPaymentStatus());
        reqInvoice.setProperties(contract.getProperties());
        reqInvoice.setContractId(contract.getId());
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
        if (state.invoiceId === -1) {
          await InvoiceClientService.Create(reqInvoice);
        } else {
          reqInvoice.setId(state.invoiceId);
          await InvoiceClientService.Update(reqInvoice);
        }
      } catch (err) {
        console.error(`An error occurred while upserting an invoice: ${err}`);
        try {
          let devlog = new Devlog();
          devlog.setUserId(userID);
          devlog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          devlog.setIsError(1);
          devlog.setDescription(
            `Failed to upsert an invoice with error: ${err}`,
          );
          await DevlogClientService.Create(devlog);
        } catch (err) {
          console.error(`Failed to upload a devlog: ${err}`);
        }
      }
    },
    [state.invoiceData, state.invoiceId, userID],
  );

  const saveEvents = useCallback(async () => {
    state.contractEvents.forEach(async event => {
      try {
        let req = event;

        req.setFieldMaskList(
          state.initiatedSchema
            .map(value => value.replace('get', ''))
            .filter(value => value !== 'Id'),
        );

        await EventClientService.Update(req);
      } catch (err) {
        console.error(
          `An error occurred while updating an event with id ${event.getId()}: ${err}`,
        );
        try {
          let devlog = new Devlog();
          devlog.setUserId(userID);
          devlog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          devlog.setIsError(1);
          devlog.setDescription(
            `Failed to update event with id ${event.getId()} with error: ${err}`,
          );
          await DevlogClientService.Create(devlog);
        } catch (err) {
          console.error(`Failed to upload a devlog: ${err}`);
        }
      }
    });
  }, [state.contractEvents, state.initiatedSchema, userID]);

  const save = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_SAVING, data: true });

    const contractResult = await saveContract();

    if (!contractResult) return;

    saveInvoice(contractResult);

    saveEvents();

    dispatch({ type: ACTIONS.SET_SAVING, data: false });
    if (onSaveFinished)
      onSaveFinished({
        contractData: state.contractData,
        propertiesSelected: state.propertiesSelected
          ? state.propertiesSelected
          : [],
        invoiceData: state.invoiceData,
      });
  }, [
    onSaveFinished,
    saveContract,
    saveEvents,
    saveInvoice,
    state.contractData,
    state.invoiceData,
    state.propertiesSelected,
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

  return (
    <>
      {state.isSaving || !state.isLoaded ? <Loader /> : undefined}
      {state.error && (
        <Alert
          title={ERROR_LABEL}
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
          title={CONFIRM_SAVE_LABEL}
          open={true}
          onClose={() =>
            dispatch({ type: ACTIONS.SET_VALIDATING, data: false })
          }
          onConfirm={() => {
            save();
            dispatch({ type: ACTIONS.SET_VALIDATING, data: false });
          }}
        >
          {CONFIRM_SAVE_DIALOG}
        </Confirm>
      )}
      <SectionBar
        title={CONTRACT_SECTION_NAME}
        actions={[
          { label: CANCEL_LABEL, onClick: () => onClose() },
          { label: SAVE_LABEL, onClick: () => validateForSave() },
        ]}
      >
        <div style={{ width: '75%', display: 'inline-block' }}>
          <Form<Contract>
            error={state.fatalError}
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
          {
            <PropertyDropdown
              key={state.isLoaded.toString()}
              loading={!state.isLoaded}
              initialPropertiesSelected={state.propertiesSelected}
              userId={userID}
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
          }
        </div>
      </SectionBar>
      <SectionBar
        title={INVOICE_SECTION_NAME}
        actions={[{ label: CANCEL_LABEL, onClick: () => onClose() }]}
      >
        <EditInvoiceData
          userId={userID}
          contractId={contractID}
          onClose={() => onClose()}
          onSave={savedInvoice => {
            dispatch({
              type: ACTIONS.SET_INVOICE_DATA,
              data: makeSafeFormObject(savedInvoice, new Invoice()),
            });
            validateForSave();
          }}
          onLoad={loadedData => {
            dispatch({
              type: ACTIONS.SET_INVOICE_DATA,
              data: loadedData,
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
      <SectionBar
        title={SERVICE_CALL_SECTION_NAME}
        subtitle={SERVICE_CALL_SUBTITLE}
        actions={[{ label: CANCEL_LABEL, onClick: () => onClose() }]}
        pagination={{
          count: state.contractEvents.length,
          rowsPerPage: 1,
          page: state.eventPage,
          onPageChange: page =>
            dispatch({ type: ACTIONS.SET_EVENT_PAGE, data: page }),
        }}
      >
        {/* The property events are not going to be needed as it is not a callback */}
        {state.isLoaded && state.contractEvents.length > 0 && (
          <Request
            key={state.eventPage.toString()}
            loading={!state.isLoaded}
            disabled={false}
            serviceItem={state.contractEvents[state.eventPage]}
            propertyEvents={[]}
            jobTypeOptions={state.jobTypes.map(id => ({
              label: id.getName(),
              value: id.getId(),
            }))}
            jobSubtypeOptions={[
              { label: OPTION_BLANK, value: 0 },
              ...state.jobTypeSubtypes
                .filter(
                  jobTypeId =>
                    jobTypeId.getJobTypeId() ===
                    state.contractEvents[state.eventPage].getJobTypeId(),
                )
                .map(jobSubtypeId => ({
                  value: jobSubtypeId.getJobSubtypeId(),
                  label:
                    state.jobSubtypes
                      .find(id => id.getId() === jobSubtypeId.getJobSubtypeId())
                      ?.getName() || '',
                })),
            ]}
            onChange={changed => {
              let contractEvents = state.contractEvents;
              contractEvents[state.eventPage] = changed;
              dispatch({
                type: ACTIONS.SET_CONTRACT_EVENTS,
                data: contractEvents,
              });
            }}
            onValid={valid => console.log('Valid: ', valid)}
            onInitSchema={initSchema =>
              dispatch({ type: ACTIONS.SET_INITIATED_SCHEMA, data: initSchema })
            }
          />
        )}
      </SectionBar>
    </>
  );
};
