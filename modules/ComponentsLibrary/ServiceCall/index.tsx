import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from 'react';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { JobSubtype } from '@kalos-core/kalos-rpc/JobSubtype';
import { JobTypeSubtype } from '@kalos-core/kalos-rpc/JobTypeSubtype';
import { Property, PropertyClient } from '@kalos-core/kalos-rpc/Property';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  getRPCFields,
  makeFakeRows,
  PropertyClientService,
  JobTypeClientService,
  JobSubtypeClientService,
  cfURL,
  loadProjects,
  JobTypeSubtypeClientService,
  ServicesRenderedClientService,
  makeSafeFormObject,
  ActivityLogClientService,
} from '../../../helpers';
import { PaymentClient, Payment } from '@kalos-core/kalos-rpc/Payment';
import { ENDPOINT, OPTION_BLANK } from '../../../constants';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { Tabs } from '../Tabs';
import { Option } from '../Field';
import { Form, Schema } from '../Form';
import { ServiceItem } from '@kalos-core/kalos-rpc/ServiceItem';
import { SpiffApplyComponent } from '../SpiffApplyComponent';
import { Request } from './components/Request';
import { Equipment } from './components/Equipment';
import { Services } from './components/Services';
import { Invoice } from './components/Invoice';
import { Proposal } from './components/Proposal';
import { Spiffs } from './components/Spiffs';
import { Confirm } from '../Confirm';
import { GanttChart } from '../GanttChart';
import { Loader } from '../../Loader/main';
import Typography from '@material-ui/core/Typography';
import { Alert } from '../Alert';
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import format from 'date-fns/esm/format';
import setHours from 'date-fns/esm/setHours';
import setMinutes from 'date-fns/esm/setMinutes';
import { State, reducer } from './reducer';
import { update } from 'lodash';
import { ServiceCallLogs } from '../ServiceCallLogs';

const EventClientService = new EventClient(ENDPOINT);
const UserClientService = new UserClient(ENDPOINT);

export type EventType = Event;
export type JobTypeSubtypeType = JobTypeSubtype;
export type ServicesRenderedType = ServicesRendered;

export interface Props {
  userID: number;
  propertyId: number;
  serviceCallId?: number;
  loggedUserId: number;
  onClose?: () => void;
  onSave?: () => void;
  asProject?: boolean;
  projectParentId?: number;
}

const SCHEMA_PROPERTY_NOTIFICATION: Schema<User> = [
  [
    {
      label: 'Notification',
      name: 'getNotification',
      required: true,
      multiline: true,
    },
  ],
];

export const ServiceCall: FC<Props> = props => {
  const {
    userID,
    propertyId,
    serviceCallId: eventId,
    loggedUserId,
    onClose,
    onSave,
    asProject = false,
  } = props;

  const initialState: State = {
    requestFields: [],
    tabIdx: 0,
    tabKey: 0,
    pendingSave: false,
    saveInvoice: false,
    requestValid: false,
    serviceCallId: props.serviceCallId ? props.serviceCallId : 0,
    entry: new Event(),
    property: new Property(),
    customer: new User(),
    propertyEvents: [],
    selectedServiceItems: [],
    loaded: false,
    loading: true,
    saving: false,
    paidServices: [],
    loggedUserRole: '',
    openSpiffApply: false,
    error: false,
    errorMessage: '',
    jobTypes: [],
    jobSubtypes: [],
    jobTypeSubtypes: [],
    jobSubTypeOptions: [],
    servicesRendered: [],
    loggedUser: new User(),
    notificationEditing: false,
    notificationViewing: false,
    projects: [],
    parentId: null,
    confirmedParentId: null,
    projectData: new Event(),
    openJobActivity: false,
  };
  const [state, updateServiceCallState] = useReducer(reducer, initialState);
  const requestRef = useRef(null);
  const loadEntry = useCallback(
    async (_serviceCallId = state.serviceCallId) => {
      if (_serviceCallId) {
        const req = new Event();
        req.setId(_serviceCallId);
        const entry = await EventClientService.Get(req);
        updateServiceCallState({ type: 'setEntry', data: entry });
      }
    },
    [state.serviceCallId],
  );
  const handleUpdatePayments = (payments: Payment[]) => {
    updateServiceCallState({
      type: 'setPaidServices',
      data: payments,
    });
  };
  const toggleOpenSpiffApply = () => {
    updateServiceCallState({
      type: 'setOpenSpiffApply',
      data: !state.openSpiffApply,
    });
  };
  const toggleOpenJobActivity = () => {
    updateServiceCallState({
      type: 'setOpenJobActivity',
      data: !state.openJobActivity,
    });
  };
  const setSelectedServiceItems = (data: ServiceItem[]) => {
    updateServiceCallState({
      type: 'setSelectedServiceItems',
      data: data,
    });
  };
  const loadServicesRenderedData = useCallback(
    async (_serviceCallId = state.serviceCallId) => {
      if (_serviceCallId) {
        const req = new ServicesRendered();
        req.setIsActive(1);
        req.setEventId(_serviceCallId);
        const servicesRendered = (
          await ServicesRenderedClientService.BatchGet(req)
        ).getResultsList();

        const pcs = new PaymentClient(ENDPOINT);
        let payments = [];
        for (let i = 0; i < servicesRendered.length; i++) {
          const req = new Payment();
          req.setServicesRenderedId(servicesRendered[i].getId());
          try {
            const result = await pcs.Get(req);
            payments.push(result);
          } catch (e) {
            console.log('failed to get payment data');
          }
        }
        updateServiceCallState({
          type: 'setPaidServices',
          data: payments,
        });
        updateServiceCallState({
          type: 'setServicesRendered',
          data: {
            servicesRendered: servicesRendered,
            loading: true,
          },
        });

        return servicesRendered;
      } else {
        return [];
      }
    },
    [state.serviceCallId],
  );

  const loadServicesRenderedDataForProp = useCallback(
    async (_serviceCallId = state.serviceCallId) => {
      if (_serviceCallId) {
        updateServiceCallState({ type: 'setLoading', data: true });
        const req = new ServicesRendered();
        req.setIsActive(1);
        req.setEventId(_serviceCallId);
        const servicesRendered = (
          await ServicesRenderedClientService.BatchGet(req)
        ).getResultsList();

        updateServiceCallState({
          type: 'setServicesRendered',
          data: { servicesRendered: servicesRendered, loading: false },
        });

        console.log(servicesRendered);
        console.log('we are here getting sr data');
      } else {
        updateServiceCallState({ type: 'setLoading', data: false });
      }
    },
    [state.serviceCallId],
  );

  // const handleSetError = useCallback(
  //   // (value: boolean) => setError(value),
  //   (value: boolean) => updateServiceCallState({type: 'setError', data: value}),
  //   [setError],
  // );

  const load = useCallback(async () => {
    updateServiceCallState({ type: 'setLoading', data: true });
    // let newProjectData = projectData;
    // newProjectData.setPropertyId(propertyId);
    // setProjectData(newProjectData);
    try {
      let entry: Event = new Event();
      const property = PropertyClientService.loadPropertyByID(propertyId);
      const customer = UserClientService.loadUserById(userID);
      const propertyEvents =
        EventClientService.loadEventsByPropertyId(propertyId);
      const jobTypes = JobTypeClientService.loadJobTypes();
      const jobSubtypes = JobSubtypeClientService.loadJobSubtypes();
      const jobTypeSubtypes = JobTypeSubtypeClientService.loadJobTypeSubtypes();
      const loggedUser = UserClientService.loadUserById(loggedUserId);
      const servicesRendered = loadServicesRenderedData();
      const [
        propertyDetails,
        customerDetails,
        propertyEventDetails,
        jobTypeList,
        jobSubTypeList,
        jobTypeSubtypesList,
        loggedUserDetails,
        servicesRenderedList,
      ] = await Promise.all([
        property,
        customer,
        propertyEvents,
        jobTypes,
        jobSubtypes,
        jobTypeSubtypes,
        loggedUser,
        servicesRendered,
      ]);
      if (state.serviceCallId) {
        const req = new Event();
        req.setId(state.serviceCallId);
        entry = await EventClientService.Get(req);
      } else {
        const req = new Event();
        req.setIsResidential(1);
        req.setDateStarted(format(new Date(), 'yyyy-MM-dd'));
        req.setDateEnded(format(new Date(), 'yyyy-MM-dd'));
        req.setTimeStarted(
          format(setMinutes(setHours(new Date(), 8), 0), 'HH:mm'),
        );
        req.setTimeEnded(
          format(setMinutes(setHours(new Date(), 18), 0), 'HH:mm'),
        );

        req.setName(
          `${propertyDetails.getAddress()} ${propertyDetails.getCity()}, ${propertyDetails.getState()} ${propertyDetails.getZip()}`,
        );
        entry = req;
      }
      updateServiceCallState({
        type: 'setData',
        data: {
          property: propertyDetails,
          customer: customerDetails,
          propertyEvents: propertyEventDetails,
          jobTypes: jobTypeList,
          jobSubtypes: jobSubTypeList,
          jobTypeSubtypes: jobTypeSubtypesList,
          loggedUser: loggedUserDetails,
          entry: entry,
          servicesRendered: servicesRenderedList,
          loaded: true,
          loading: false,
        },
      });
      console.log('All Processes are Loaded');
    } catch (err) {
      updateServiceCallState({
        type: 'setError',
        data: {
          error: true,
          msg: err as string,
        },
      });
      updateServiceCallState({
        type: 'setLoadedLoading',
        data: {
          loaded: true,
          loading: false,
        },
      });
    }
    /* Keeping this here as reminder that Projects needs to be Updated and added.
      promises.push(
        new Promise<void>(async resolve => {
          const projects = await loadProjects();
          setProjects(projects);
          resolve();
        }),
      );
    */
  }, [
    propertyId,
    userID,
    state.serviceCallId,
    loggedUserId,
    loadServicesRenderedData,
  ]);

  // const handleSetParentId = useCallback(
  //   id => {
  //     setParentId(id);
  //   },
  //   [setParentId],
  // );

  // const handleSetConfirmedIsChild = useCallback(
  //   id => {
  //     setConfirmedParentId(id);
  //   },
  //   [setConfirmedParentId],
  // );

  const handleSave = useCallback(async () => {
    if (state.tabIdx !== 0) {
      updateServiceCallState({
        type: 'setTabAndPendingSave',
        data: {
          tabIdx: 0,
          tabKey: state.tabKey + 1,
          pendingSave: true,
        },
      });
    } else {
      updateServiceCallState({ type: 'setPendingSave', data: true });
    }
  }, [state.tabKey, state.tabIdx]);

  const saveServiceCall = useCallback(async () => {
    updateServiceCallState({
      type: 'setSavingLoading',
      data: {
        saving: true,
        loading: true,
      },
    });
    const temp = state.entry;
    let res = new Event();
    try {
      if (state.serviceCallId) {
        console.log('saving existing ID');
        let activityName = `${temp.getLogJobNumber()} Edited Service Call`;
        if (state.saveInvoice) {
          console.log('saving invoice');
          temp.setIsGeneratedInvoice(state.saveInvoice);
          temp.addFieldMask('IsGeneratedInvoice');
          await EventClientService.Update(temp);
          activityName = activityName.concat(` and Invoice`);
        } else {
          await EventClientService.Update(temp);
        }
        const newActivity = new ActivityLog();
        if (
          state.property.getGeolocationLat() &&
          state.property.getGeolocationLng()
        ) {
          newActivity.setGeolocationLat(state.property.getGeolocationLat());
          newActivity.setGeolocationLng(state.property.getGeolocationLng());
        } else {
          activityName = activityName.concat(` (location services disabled)`);
          newActivity.setPropertyId(propertyId);
          newActivity.setActivityDate(
            format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          );
          newActivity.setUserId(loggedUserId);
          newActivity.setActivityName(activityName);
          await ActivityLogClientService.Create(newActivity);
        }
      } else {
        console.log('creating new one');
        temp.setPropertyId(propertyId);
        temp.setLogVersion(1);
        res = await EventClientService.Create(temp);
        const logNumber = `${format(new Date(), 'yy')}-${res.getId()}`;
        const newEvent = new Event();
        newEvent.setId(res.getId());
        newEvent.setLogJobNumber(logNumber);
        newEvent.setIsResidential(temp.getIsResidential());
        newEvent.setFieldMaskList(['Id', 'LogJobNumber', 'IsResidential']);
        await EventClientService.Update(newEvent);
        const newActivity = new ActivityLog();
        let activityName = `${logNumber} Added Service Call`;
        if (
          state.property.getGeolocationLat() &&
          state.property.getGeolocationLng()
        ) {
          newActivity.setGeolocationLat(state.property.getGeolocationLat());
          newActivity.setGeolocationLng(state.property.getGeolocationLng());
        } else {
          activityName = activityName.concat(` (location services disabled)`);
        }
        newActivity.setPropertyId(propertyId);
        newActivity.setActivityDate(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        newActivity.setUserId(loggedUserId);
        newActivity.setActivityName(activityName);
        await ActivityLogClientService.Create(newActivity);
      }
    } catch (err) {
      console.error(err);
    }
    console.log('finished Update');
    if (!state.serviceCallId) {
      console.log('no service call Id');
      updateServiceCallState({ type: 'setServiceCallId', data: res.getId() });
      await loadEntry(res.getId());
      await loadServicesRenderedData(res.getId());
    }
    if (onSave) {
      onSave();
    }
    if (onClose) {
      onClose();
    } else {
      updateServiceCallState({
        type: 'setSavingLoading',
        data: {
          saving: false,
          loading: false,
        },
      });
    }
  }, [
    state.entry,
    state.serviceCallId,
    onSave,
    onClose,
    state.saveInvoice,
    state.property,
    propertyId,
    loggedUserId,
    loadEntry,
    loadServicesRenderedData,
  ]);

  // const saveProject = useCallback(
  //   async (data: Event) => {
  //     setSaving(true);
  //     if (confirmedParentId) {
  //       data.setParentId(confirmedParentId);
  //     }
  //     const temp = makeSafeFormObject(data, new Event());
  //     await EventClientService.upsertEvent(data);
  //     setSaving(false);
  //     if (onSave) {
  //       onSave();
  //     }
  //     if (onClose) {
  //       onClose();
  //     }
  //   },
  //   [onSave, onClose, confirmedParentId],
  // );

  useEffect(() => {
    if (eventId !== 0 && true)
      if (!state.loaded) {
        load();
      }
    if (
      state.entry &&
      state.entry.getCustomer() &&
      state.entry.getCustomer()!.getNotification() !== ''
    ) {
      updateServiceCallState({ type: 'setNotificationViewing', data: true });
    }
    if (state.pendingSave && state.requestValid) {
      updateServiceCallState({ type: 'setPendingSave', data: false });
      saveServiceCall();
    }
    if (state.pendingSave && state.tabIdx === 0 && requestRef.current) {
      //@ts-ignore
      requestRef.current.click();
    }
  }, [
    state.entry,
    state.loaded,
    load,
    state.pendingSave,
    state.requestValid,
    saveServiceCall,
    state.tabIdx,
    requestRef,
    eventId,
  ]);

  const handleSetRequestfields = useCallback(
    fields => {
      updateServiceCallState({
        type: 'setRequestFields',
        data: [...state.requestFields, ...fields],
      });
    },
    [state.requestFields],
  );

  const handleChangeEntry = useCallback((data: Event) => {
    updateServiceCallState({
      type: 'setChangeEntry',
      data: {
        entry: data,
        pendingSave: false,
      },
    });
  }, []);

  const handleSetNotificationEditing = useCallback(
    (notificationEditing: boolean) => () =>
      updateServiceCallState({
        type: 'setNotificationEditing',
        data: notificationEditing,
      }),
    [],
  );

  const handleSetNotificationViewing = useCallback(
    (notificationViewing: boolean) => () =>
      updateServiceCallState({
        type: 'setNotificationViewing',
        data: notificationViewing,
      }),
    [],
  );

  const handleSaveCustomer = useCallback(
    async (data: User) => {
      updateServiceCallState({ type: 'setSaving', data: true });
      const temp = makeSafeFormObject(data, new User());
      const entry = new User();
      entry.setId(userID);
      const fieldMaskList = [];
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        entry[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      entry.setFieldMaskList(fieldMaskList);
      await loadEntry();
      updateServiceCallState({
        type: 'setSavingNoteEditing',
        data: {
          saving: false,
          notificationEditing: false,
        },
      });
    },
    [userID, loadEntry],
  );

  const handleOnAddMaterials = useCallback(
    async (materialUsed, materialTotal) => {
      await EventClientService.updateMaterialUsed(
        state.serviceCallId,
        materialUsed + state.entry.getMaterialUsed(),
        materialTotal + state.entry.getMaterialTotal(),
      );
      await loadEntry();
    },
    [state.serviceCallId, state.entry, loadEntry],
  );

  const jobTypeOptions: Option[] = state.jobTypes.map(id => ({
    label: id.getName(),
    value: id.getId(),
  }));

  const jobSubtypeOptions: Option[] = [
    { label: OPTION_BLANK, value: 0 },
    ...state.jobTypeSubtypes
      .filter(
        jobTypeId => jobTypeId.getJobTypeId() === state.entry.getJobTypeId(),
      )
      .map(jobSubtypeId => ({
        value: jobSubtypeId.getJobSubtypeId(),
        label:
          state.jobSubtypes
            .find(id => id.getId() === jobSubtypeId.getJobSubtypeId())
            ?.getName() || '',
      })),
  ];

  //const { id, logJobNumber, contractNumber } = entry;
  /*
  const {
    firstname,
    lastname,
    businessname,
    phone,
    altphone,
    cellphone,
    fax,
    email,
    billingTerms,
    notification,
  } = customer;

  const { address, city, state, zip } = property;
  */
  const id = state.entry.getId();
  const logJobNumber = state.entry.getLogJobNumber();
  const contractNumber = state.entry.getContractNumber();
  const firstname = state.customer.getFirstname();
  const lastname = state.customer.getLastname();
  const businessname = state.customer.getBusinessname();
  const phone = state.customer.getPhone();
  const altphone = state.customer.getAltphone();
  const cellphone = state.customer.getCellphone();
  const fax = state.customer.getFax();
  const email = state.customer.getEmail();
  const billingTerms = state.customer.getBillingTerms();
  const notification = state.customer.getNotification();
  const address = state.property.getAddress();
  const city = state.property.getCity();
  const propertyState = state.property.getState();
  const zip = state.property.getZip();
  const data: Data = [
    [
      { label: 'Customer', value: `${firstname} ${lastname}` },
      { label: 'Business Name', value: businessname },
    ],
    [
      { label: 'Primary Phone', value: phone, href: 'tel' },
      { label: 'Alternate Phone', value: altphone, href: 'tel' },
    ],
    [
      { label: 'Cell Phone', value: cellphone, href: 'tel' },
      { label: 'Fax', value: fax, href: 'tel' },
    ],
    [
      { label: 'Billing Terms', value: billingTerms },
      { label: 'Email', value: email, href: 'mailto' },
    ],
    [
      { label: 'Property', value: address },
      { label: 'City, State, Zip', value: `${city}, ${propertyState} ${zip}` },
    ],
    ...(state.serviceCallId
      ? [
          [
            { label: 'Job Number', value: logJobNumber },
            { label: 'Contract Number', value: contractNumber },
          ],
        ]
      : []),
  ];
  // const SCHEMA_PROJECT: Schema<EventType> = [
  //   [
  //     {
  //       name: 'getDateStarted',
  //       label: 'Start Date',
  //       type: 'date',
  //       required: true,
  //     },
  //     {
  //       name: 'getDateEnded',
  //       label: 'End Date',
  //       type: 'date',
  //       required: true,
  //     },
  //     {
  //       name: 'getTimeStarted',
  //       label: 'Time Started',
  //       type: 'time',
  //       required: true,
  //     },
  //     {
  //       name: 'getTimeEnded',
  //       label: 'Time Ended',
  //       type: 'time',
  //       required: true,
  //     },
  //   ],
  //   [
  //     {
  //       name: 'getDepartmentId',
  //       label: 'Department',
  //       type: 'department',
  //       required: true,
  //     },
  //     {
  //       name: 'getDescription',
  //       label: 'Description',
  //       multiline: true,
  //     },
  //   ],
  //   [
  //     {
  //       name: 'getIsAllDay',
  //       label: 'Is all-day?',
  //       type: 'checkbox',
  //     },
  //     {
  //       name: 'getIsLmpc',
  //       label: 'Is LMPC?',
  //       type: 'checkbox',
  //     },
  //     {
  //       name: 'getHighPriority',
  //       label: 'High priority?',
  //       type: 'checkbox',
  //     },
  //     {
  //       name: 'getIsResidential',
  //       label: 'Is residential?',
  //       type: 'checkbox',
  //     },
  //   ],
  //   [
  //     {
  //       name: 'getColor',
  //       label: 'Color',
  //       type: 'color',
  //     },
  //   ],
  //   [
  //     {
  //       name: 'getPropertyId',
  //       type: 'hidden',
  //     },
  //   ],
  // ];
  return (
    <>
      <SectionBar
        key={state.loading.toString()}
        title={asProject ? 'Project Details' : 'Service Call Details'}
        actions={
          state.serviceCallId
            ? [
                {
                  label: 'Spiff Apply',
                  onClick: () => toggleOpenSpiffApply(),
                },
                {
                  label: 'Job Activity',
                  onClick: () => toggleOpenJobActivity(),
                },
                {
                  label: notification ? 'Notification' : 'Add Notification',
                  onClick: notification
                    ? handleSetNotificationViewing(true)
                    : handleSetNotificationEditing(true),
                },
                // {
                //   label: 'Service Call Search',
                //   url: cfURL('service.calls'),
                // },
                {
                  label: 'Close',
                  ...(onClose
                    ? { onClick: onClose }
                    : {
                        url: cfURL(
                          [
                            'properties.details',
                            `property_id=${propertyId}`,
                            `user_id=${userID}`,
                          ].join('&'),
                        ),
                      }),
                },
              ]
            : []
        }
      >
        <InfoTable data={data} error={state.error} />
      </SectionBar>
      {
        // asProject ? (
        //   <>
        //     <Form
        //       title="Project Data"
        //       schema={SCHEMA_PROJECT}
        //       data={projectData}
        //       onClose={onClose || (() => {})}
        //       onSave={(data: Event) => {
        //         let newData = makeSafeFormObject(data, new Event());
        //         newData.setDepartmentId(Number(newData.getDepartmentId()));
        //         saveProject(newData);
        //       }}
        //     />
        //     {parentId != confirmedParentId && parentId != null && (
        //       <Confirm
        //         title="Confirm Parent"
        //         open={true}
        //         onClose={() => handleSetParentId(null)}
        //         onConfirm={() => handleSetConfirmedIsChild(parentId)}
        //       >
        //         Are you sure you want to set this project as the parent to the new
        //         project?
        //       </Confirm>
        //     )}
        //     {confirmedParentId && (
        //       <Typography variant="h5">Parent ID: {confirmedParentId}</Typography>
        //     )}
        //     {loaded && projects.length > 0 ? (
        //       <GanttChart
        //         events={projects.map(task => {
        //           const id = task.getId();
        //           const description = task.getDescription();
        //           const dateStart = task.getDateStarted();
        //           const dateEnd = task.getDateEnded();
        //           const logJobStatus = task.getLogJobNumber();
        //           const color = task.getColor();
        //           const [startDate, startHour] = dateStart.split(' ');
        //           const [endDate, endHour] = dateEnd.split(' ');
        //           return {
        //             id,
        //             startDate,
        //             endDate,
        //             startHour,
        //             endHour,
        //             notes: description,
        //             statusColor: '#' + color,
        //             onClick: () => {
        //               handleSetParentId(id);
        //             },
        //           };
        //         })}
        //         startDate={projects[0].getDateStarted().substr(0, 10)}
        //         endDate={projects[projects.length - 1]
        //           .getDateEnded()
        //           .substr(0, 10)}
        //         loading={loading}
        //       />
        //     ) : (
        //       <Loader />
        //     )}
        //   </>
        // ) :
        <>
          <SectionBar
            title="Service Call Data"
            actions={[
              {
                label: 'Save Service Call Only',
                onClick: handleSave,
                disabled: state.loading || state.saving,
              },
              {
                label: 'Save and Invoice',
                onClick: () => {
                  updateServiceCallState({
                    type: 'setSaveInvoice',
                    data: {
                      pendingSave: true,
                      requestValid: true,
                      saveInvoice: true,
                    },
                  });
                },
                disabled: state.loading || state.saving,
              },
              /*
              {
                label: 'Cancel',
                url: [
                  '/index.cfm?action=admin:properties.details',
                  `property_id=${propertyId}`,
                  `user_id=${userID}`,
                ].join('&'),
                disabled: state.loading || state.saving,
              },
              */
            ]}
          />
          <Tabs
            key={state.tabKey + state.loading.toString()}
            defaultOpenIdx={state.tabIdx}
            onChange={data => {
              updateServiceCallState({ type: 'setTabId', data: data });
            }}
            tabs={[
              {
                label: 'Request',
                content: (
                  <Request
                    key={state.loading.toString()}
                    //@ts-ignore
                    ref={requestRef}
                    serviceItem={state.entry}
                    propertyEvents={state.propertyEvents}
                    loading={state.loading}
                    jobTypeOptions={jobTypeOptions}
                    jobSubtypeOptions={jobSubtypeOptions}
                    onChange={handleChangeEntry}
                    disabled={state.saving}
                    onValid={data => {
                      updateServiceCallState({
                        type: 'setRequestValid',
                        data: data,
                      });
                    }}
                    onInitSchema={handleSetRequestfields}
                  />
                ),
              },
              {
                label: 'Equipment',
                content: state.loading ? (
                  <InfoTable data={makeFakeRows(4, 4)} loading />
                ) : (
                  <Equipment
                    {...props}
                    event={state.entry}
                    customer={state.customer}
                    property={state.property}
                    onSelectServiceItems={
                      state.loggedUser.getIsEmployee()
                        ? setSelectedServiceItems
                        : undefined
                    }
                    selectedServiceItems={state.selectedServiceItems}
                  />
                ),
              },
              ...(state.serviceCallId
                ? [
                    {
                      label: 'Services',
                      content: state.loggedUser ? (
                        <Services
                          serviceCallId={state.serviceCallId}
                          servicesRendered={state.servicesRendered}
                          loggedUser={state.loggedUser}
                          loadServicesRendered={loadServicesRenderedDataForProp}
                          loading={state.loading}
                          payments={state.paidServices}
                          onUpdatePayments={handleUpdatePayments}
                          onAddMaterials={handleOnAddMaterials}
                        />
                      ) : (
                        <InfoTable data={makeFakeRows(4, 4)} loading />
                      ),
                    },
                  ]
                : []),
              {
                label: 'Invoice',
                content: state.loading ? (
                  <InfoTable data={makeFakeRows(4, 5)} loading />
                ) : (
                  <Invoice
                    event={state.entry}
                    onChange={handleChangeEntry}
                    disabled={state.saving}
                    servicesRendered={state.servicesRendered}
                    onInitSchema={handleSetRequestfields}
                    paidServices={state.paidServices}
                  />
                ),
              },
              ...(state.serviceCallId
                ? [
                    {
                      label: 'Proposal',
                      content: state.loading ? (
                        <InfoTable data={makeFakeRows(2, 5)} loading />
                      ) : (
                        <Proposal
                          serviceItem={state.entry}
                          customer={state.customer}
                          property={state.property}
                        />
                      ),
                    },
                  ]
                : []),
              ...(state.serviceCallId
                ? [
                    {
                      label: 'Spiffs',
                      content: state.loading ? (
                        <InfoTable data={makeFakeRows(8, 5)} loading />
                      ) : (
                        <Spiffs
                          role={state.loggedUserRole}
                          serviceItem={state.entry}
                          loggedUserId={loggedUserId}
                          loggedUserName={UserClientService.getCustomerName(
                            state.loggedUser!,
                          )}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </>
      }
      {state.openJobActivity && eventId != undefined && (
        <Modal
          open={state.openJobActivity}
          onClose={() => toggleOpenJobActivity()}
        >
          <ServiceCallLogs loggedUserId={loggedUserId} eventId={eventId} />
        </Modal>
      )}
      {state.customer && state.serviceCallId > 0 && (
        <Modal
          open={state.notificationEditing || state.notificationViewing}
          onClose={() => {
            handleSetNotificationViewing(false)();
            handleSetNotificationEditing(false)();
          }}
        >
          <Form<User>
            title={
              state.notificationViewing
                ? 'Customer Notification'
                : `${
                    notification === '' ? 'Add' : 'Edit'
                  } Customer Notification`
            }
            schema={SCHEMA_PROPERTY_NOTIFICATION}
            data={state.customer}
            onSave={handleSaveCustomer}
            onClose={() => {
              handleSetNotificationViewing(false)();
              handleSetNotificationEditing(false)();
            }}
            disabled={state.saving}
            readOnly={state.notificationViewing}
            actions={
              state.notificationViewing
                ? [
                    {
                      label: 'Edit',
                      variant: 'outlined',
                      onClick: () => {
                        handleSetNotificationViewing(false)();
                        handleSetNotificationEditing(true)();
                      },
                    },
                    {
                      label: 'Delete',
                      variant: 'outlined',
                      onClick: () => {
                        handleSetNotificationViewing(false)();
                        let newUser = new User();
                        newUser.setNotification('');
                        handleSaveCustomer(newUser);
                      },
                    },
                  ]
                : []
            }
          />
        </Modal>
      )}
      {state.openSpiffApply && state.serviceCallId != 0 && (
        <SpiffApplyComponent
          loggedUserId={loggedUserId}
          serviceCallId={state.serviceCallId}
          onClose={() => toggleOpenSpiffApply()}
        />
      )}
    </>
  );
};
