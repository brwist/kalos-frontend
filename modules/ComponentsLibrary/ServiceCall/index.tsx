import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
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
import { ENDPOINT, OPTION_BLANK } from '../../../constants';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { Tabs } from '../Tabs';
import { Option } from '../Field';
import { Form, Schema } from '../Form';
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
import { format } from 'date-fns';

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
  const requestRef = useRef(null);
  const [requestFields, setRequestfields] = useState<string[]>([]);
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [tabKey, setTabKey] = useState<number>(0);
  const [pendingSave, setPendingSave] = useState<boolean>(false);
  const [saveInvoice, setSaveInvoice] = useState<boolean>(false);
  const [requestValid, setRequestValid] = useState<boolean>(false);
  const [serviceCallId, setServiceCallId] = useState<number>(eventId || 0);
  const [entry, setEntry] = useState<Event>(new Event());
  const [property, setProperty] = useState<Property>(new Property());
  const [customer, setCustomer] = useState<User>(new User());
  const [propertyEvents, setPropertyEvents] = useState<Event[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [jobSubtypes, setJobSubtype] = useState<JobSubtype[]>([]);
  const [jobTypeSubtypes, setJobTypeSubtypes] = useState<JobTypeSubtype[]>([]);
  const [jobSubTypeOptions, setJobSubTypeOptions] = useState<Option[]>([]);
  const [servicesRendered, setServicesRendered] = useState<ServicesRendered[]>(
    [],
  );
  const [loggedUser, setLoggedUser] = useState<User>();
  const [notificationEditing, setNotificationEditing] = useState<boolean>(
    false,
  );
  const [notificationViewing, setNotificationViewing] = useState<boolean>(
    false,
  );
  const [projects, setProjects] = useState<Event[]>([]);
  const [parentId, setParentId] = useState<number | null>(null);
  const [confirmedParentId, setConfirmedParentId] = useState<number | null>(
    null,
  );
  const [projectData, setProjectData] = useState<Event>(new Event());
  const loadEntry = useCallback(
    async (_serviceCallId = serviceCallId) => {
      if (_serviceCallId) {
        const req = new Event();
        req.setId(_serviceCallId);
        const entry = await EventClientService.Get(req);
        setEntry(entry);
      }
    },
    [setEntry, serviceCallId],
  );
  const loadServicesRenderedData = useCallback(
    async (_serviceCallId = serviceCallId, passLoading?: boolean) => {
      if (_serviceCallId) {
        setLoading(true);
        const req = new ServicesRendered();
        req.setIsActive(1);
        req.setEventId(_serviceCallId);
        const servicesRendered = (
          await ServicesRenderedClientService.BatchGet(req)
        ).getResultsList();
        //const servicesRendered = await ServicesRenderedClientService.loadServicesRenderedByEventID(
        //  _serviceCallId,
        //);
        setServicesRendered(servicesRendered);
        console.log(servicesRendered);
        console.log('we are here getting sr data');
      }
    },
    [setServicesRendered, serviceCallId],
  );
  const loadServicesRenderedDataForProp = useCallback(
    async (_serviceCallId = serviceCallId, passLoading?: boolean) => {
      if (_serviceCallId) {
        setLoading(true);
        const req = new ServicesRendered();
        req.setIsActive(1);
        req.setEventId(_serviceCallId);
        const servicesRendered = (
          await ServicesRenderedClientService.BatchGet(req)
        ).getResultsList();
        //const servicesRendered = await ServicesRenderedClientService.loadServicesRenderedByEventID(
        //  _serviceCallId,
        //);
        setServicesRendered(servicesRendered);
        console.log(servicesRendered);
        console.log('we are here getting sr data');
      }
      setLoading(false);
    },
    [setServicesRendered, serviceCallId],
  );

  const handleSetError = useCallback((error: boolean) => setError(error), [
    setError,
  ]);

  const load = useCallback(async () => {
    setLoading(true);
    let newProjectData = projectData;
    newProjectData.setPropertyId(propertyId);
    setProjectData(newProjectData);
    try {
      let promises = [];

      promises.push(
        new Promise<void>(async resolve => {
          const property = await PropertyClientService.loadPropertyByID(
            propertyId,
          );
          setProperty(property);
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          const customer = await UserClientService.loadUserById(userID);
          setCustomer(customer);
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          const propertyEvents = await EventClientService.loadEventsByPropertyId(
            propertyId,
          );
          setPropertyEvents(propertyEvents);
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          const jobTypes = await JobTypeClientService.loadJobTypes();
          setJobTypes(jobTypes);
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          const jobSubtypes = await JobSubtypeClientService.loadJobSubtypes();
          setJobSubtype(jobSubtypes);
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          const jobTypeSubtypes = await JobTypeSubtypeClientService.loadJobTypeSubtypes();
          setJobTypeSubtypes(jobTypeSubtypes);
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          const loggedUser = await UserClientService.loadUserById(loggedUserId);
          setLoggedUser(loggedUser);
          resolve();
        }),
      );

      if (serviceCallId) {
        promises.push(
          new Promise<void>(async resolve => {
            const req = new Event();
            req.setId(serviceCallId);
            const entry = await EventClientService.Get(req);
            console.log('entry', entry);
            setEntry(entry);
            resolve();
          }),
        );
      } else {
        promises.push(
          new Promise<void>(async resolve => {
            const req = new Event();
            req.setIsResidential(1);
            req.setDateStarted(format(new Date(), 'yyyy-MM-dd'));
            req.setDateEnded(format(new Date(), 'yyyy-MM-dd'));
            const property = await PropertyClientService.loadPropertyByID(
              propertyId,
            );
            req.setName(`${property.getAddress()} ${property.getCity()}, ${property.getState()} ${property.getZip()}`);
            setEntry(req);
            resolve();
          }),
        );
      }

      promises.push(
        new Promise<void>(async resolve => {
          await loadServicesRenderedData();
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          const projects = await loadProjects();
          setProjects(projects);
          resolve();
        }),
      );

      Promise.all(promises).then(() => {
        console.log('all processes complete');
        setLoaded(true);
        setLoading(false);
      });
    } catch (e) {
      handleSetError(e);
      setLoaded(true);
      setLoading(false);
    }
  }, [
    projectData,
    propertyId,
    userID,
    serviceCallId,
    loggedUserId,
    loadServicesRenderedData,
    handleSetError,
  ]);

  const handleSetParentId = useCallback(
    id => {
      setParentId(id);
    },
    [setParentId],
  );

  const handleSetConfirmedIsChild = useCallback(
    id => {
      setConfirmedParentId(id);
    },
    [setConfirmedParentId],
  );
const handleSaveInvoice = useCallback(async() => {
  setPendingSave(true);
  setRequestValid(true);
  setSaveInvoice(true);
},[setPendingSave, setRequestValid]);
  const handleSave = useCallback(async () => {
    setPendingSave(true);
    if (tabIdx !== 0) {
      setTabIdx(0);
      setTabKey(tabKey + 1);
    }
  }, [setPendingSave, setTabKey, setTabIdx, tabKey, tabIdx]);
  const saveServiceCall = useCallback(async () => {
    setSaving(true);
    setLoading(true);
    const temp = entry;
    let res = new Event();
    try {
      if (serviceCallId){
        console.log('saving existing ID');
        let activityName = `${temp.getLogJobNumber()} Edited Service Call`;
        if(saveInvoice) {
          console.log('saving invoice');
          temp.setIsGeneratedInvoice(saveInvoice);
          temp.addFieldMask('IsGeneratedInvoice');
          await EventClientService.Update(temp);
          activityName = activityName.concat(` and Invoice`);
        }
        else {
          await EventClientService.Update(temp);
        }
        const newActivity = new ActivityLog();
        if (property.getGeolocationLat() && property.getGeolocationLng()) {
          newActivity.setGeolocationLat(property.getGeolocationLat());
          newActivity.setGeolocationLng(property.getGeolocationLng());
        } else {
          activityName = activityName.concat(` (location services disabled)`);
          newActivity.setPropertyId(propertyId);
          newActivity.setActivityDate(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
          newActivity.setUserId(userID);
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
        newEvent.setFieldMaskList(['Id', 'LogJobNumber']);
        await EventClientService.Update(newEvent);
        const newActivity = new ActivityLog();
        let activityName = `${logNumber} Added Service Call`;
        if (property.getGeolocationLat() && property.getGeolocationLng()) {
          newActivity.setGeolocationLat(property.getGeolocationLat());
          newActivity.setGeolocationLng(property.getGeolocationLng());
        } else {
          activityName = activityName.concat(` (location services disabled)`);
        }
        newActivity.setPropertyId(propertyId);
        newActivity.setActivityDate(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
        newActivity.setUserId(userID);
        newActivity.setActivityName(activityName);
        await ActivityLogClientService.Create(newActivity);
      }
    } catch (err) {
      console.error(err);
    }
    console.log('finished Update');
    if (!serviceCallId) {
      console.log('no service call Id');
      setServiceCallId(res.getId());
      await loadEntry(res.getId());
      await loadServicesRenderedData(res.getId());
    }
    if (onSave) {
      onSave();
    }
    if (onClose) {
      onClose();
    } else {
      setSaving(false);
      setLoading(false);
    }
  }, [
    entry,
    serviceCallId,
    propertyId,
    saveInvoice,
    setSaving,
    setLoading,
    onSave,
    onClose,
    loadEntry,
    loadServicesRenderedData,
  ]);

  const saveProject = useCallback(
    async (data: Event) => {
      setSaving(true);
      if (confirmedParentId) {
        data.setParentId(confirmedParentId);
      }
      const temp = makeSafeFormObject(data, new Event());
      await EventClientService.upsertEvent(data);
      setSaving(false);
      if (onSave) {
        onSave();
      }
      if (onClose) {
        onClose();
      }
    },
    [onSave, onClose, confirmedParentId],
  );
  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
    }
    if (
      entry &&
      entry.getCustomer() &&
      entry.getCustomer()!.getNotification() !== ''
    ) {
      setNotificationViewing(true);
    }
    if (pendingSave && requestValid) {
      setPendingSave(false);
      saveServiceCall();
    }
    if (pendingSave && tabIdx === 0 && requestRef.current) {
      //@ts-ignore
      requestRef.current.click();
    }
  }, [
    entry,
    loaded,
    load,
    setLoaded,
    setNotificationViewing,
    pendingSave,
    requestValid,
    setPendingSave,
    saveServiceCall,
    tabIdx,
    requestRef,
  ]);

  const handleSetRequestfields = useCallback(
    fields => {
      setRequestfields([...requestFields, ...fields]);
    },
    [requestFields, setRequestfields],
  );

  const handleChangeEntry = useCallback(
    (data: Event) => {
      //const temp = makeSafeFormObject(data, new Event());
      //const tempObject = Object.assign(entry, temp);
      setEntry(data);
      setPendingSave(false);
    },
    [setEntry, setPendingSave],
  );

  const handleSetNotificationEditing = useCallback(
    (notificationEditing: boolean) => () =>
      setNotificationEditing(notificationEditing),
    [setNotificationEditing],
  );

  const handleSetNotificationViewing = useCallback(
    (notificationViewing: boolean) => () =>
      setNotificationViewing(notificationViewing),
    [setNotificationViewing],
  );

  const handleSaveCustomer = useCallback(
    async (data: User) => {
      setSaving(true);
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
      //await UserClientService.Update(entry);
      await loadEntry();
      setSaving(false);
      handleSetNotificationEditing(false)();
    },
    [userID, loadEntry, handleSetNotificationEditing],
  );

  const handleOnAddMaterials = useCallback(
    async (materialUsed, materialTotal) => {
      await EventClientService.updateMaterialUsed(
        serviceCallId,
        materialUsed + entry.getMaterialUsed(),
        materialTotal + entry.getMaterialTotal(),
      );
      await loadEntry();
    },
    [serviceCallId, entry, loadEntry],
  );

  const jobTypeOptions: Option[] = jobTypes.map(id => ({
    label: id.getName(),
    value: id.getId(),
  }));

  const jobSubtypeOptions: Option[] = [
    { label: OPTION_BLANK, value: 0 },
    ...jobTypeSubtypes
      .filter(jobTypeId => jobTypeId.getJobTypeId() === entry.getJobTypeId())
      .map(jobSubtypeId => ({
        value: jobSubtypeId.getJobSubtypeId(),
        label:
          jobSubtypes
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
  const id = entry.getId();
  const logJobNumber = entry.getLogJobNumber();
  const contractNumber = entry.getContractNumber();
  const firstname = customer.getFirstname();
  const lastname = customer.getLastname();
  const businessname = customer.getBusinessname();
  const phone = customer.getPhone();
  const altphone = customer.getAltphone();
  const cellphone = customer.getCellphone();
  const fax = customer.getFax();
  const email = customer.getEmail();
  const billingTerms = customer.getBillingTerms();
  const notification = customer.getNotification();
  const address = property.getAddress();
  const city = property.getCity();
  const state = property.getState();
  const zip = property.getZip();
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
      { label: 'City, State, Zip', value: `${city}, ${state} ${zip}` },
    ],
    ...(serviceCallId
      ? [
          [
            { label: 'Job Number', value: logJobNumber },
            { label: 'Contract Number', value: contractNumber },
          ],
        ]
      : []),
  ];
  const SCHEMA_PROJECT: Schema<EventType> = [
    [
      {
        name: 'getDateStarted',
        label: 'Start Date',
        type: 'date',
        required: true,
      },
      {
        name: 'getDateEnded',
        label: 'End Date',
        type: 'date',
        required: true,
      },
      {
        name: 'getTimeStarted',
        label: 'Time Started',
        type: 'time',
        required: true,
      },
      {
        name: 'getTimeEnded',
        label: 'Time Ended',
        type: 'time',
        required: true,
      },
    ],
    [
      {
        name: 'getDepartmentId',
        label: 'Department',
        type: 'department',
        required: true,
      },
      {
        name: 'getDescription',
        label: 'Description',
        multiline: true,
      },
    ],
    [
      {
        name: 'getIsAllDay',
        label: 'Is all-day?',
        type: 'checkbox',
      },
      {
        name: 'getIsLmpc',
        label: 'Is LMPC?',
        type: 'checkbox',
      },
      {
        name: 'getHighPriority',
        label: 'High priority?',
        type: 'checkbox',
      },
      {
        name: 'getIsResidential',
        label: 'Is residential?',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'getColor',
        label: 'Color',
        type: 'color',
      },
    ],
    [
      {
        name: 'getPropertyId',
        type: 'hidden',
      },
    ],
  ];
  return (
    <>
      <SectionBar
        key={loading.toString()}
        title={asProject ? 'Project Details' : 'Service Call Details'}
        actions={
          serviceCallId
            ? [
                {
                  label: 'Spiff Apply',
                  url: cfURL(
                    [
                      'tasks.addtask',
                      'type=Spiff',
                      `job_no=${logJobNumber}`,
                    ].join('&'),
                  ),
                  target: '_blank',
                },
                {
                  label: 'Job Activity',
                  url: cfURL(['service.viewlogs', `id=${id}`].join('&')),
                },
                {
                  label: notification ? 'Notification' : 'Add Notification',
                  onClick: notification
                    ? handleSetNotificationViewing(true)
                    : handleSetNotificationEditing(true),
                },
                {
                  label: 'Service Call Search',
                  url: cfURL('service.calls'),
                },
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
        <InfoTable data={data} error={error} />
      </SectionBar>
      {asProject ? (
        <>
          <Form
            title="Project Data"
            schema={SCHEMA_PROJECT}
            data={projectData}
            onClose={onClose || (() => {})}
            onSave={(data: Event) => {
              let newData = makeSafeFormObject(data, new Event());
              newData.setDepartmentId(Number(newData.getDepartmentId()));
              saveProject(newData);
            }}
          />
          {parentId != confirmedParentId && parentId != null && (
            <Confirm
              title="Confirm Parent"
              open={true}
              onClose={() => handleSetParentId(null)}
              onConfirm={() => handleSetConfirmedIsChild(parentId)}
            >
              Are you sure you want to set this project as the parent to the new
              project?
            </Confirm>
          )}
          {confirmedParentId && (
            <Typography variant="h5">Parent ID: {confirmedParentId}</Typography>
          )}
          {loaded && projects.length > 0 ? (
            <GanttChart
              events={projects.map(task => {
                const id = task.getId();
                const description = task.getDescription();
                const dateStart = task.getDateStarted();
                const dateEnd = task.getDateEnded();
                const logJobStatus = task.getLogJobNumber();
                const color = task.getColor();
                const [startDate, startHour] = dateStart.split(' ');
                const [endDate, endHour] = dateEnd.split(' ');
                return {
                  id,
                  startDate,
                  endDate,
                  startHour,
                  endHour,
                  notes: description,
                  statusColor: '#' + color,
                  onClick: () => {
                    handleSetParentId(id);
                  },
                };
              })}
              startDate={projects[0].getDateStarted().substr(0, 10)}
              endDate={projects[projects.length - 1]
                .getDateEnded()
                .substr(0, 10)}
              loading={loading}
            />
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <>
          <SectionBar
            title="Service Call Data"
            actions={[
              {
                label: 'Save Service Call Only',
                onClick: handleSave,
                disabled: loading || saving,
              },
              {
                label: 'Save and Invoice',
                onClick: handleSaveInvoice,
                disabled: loading || saving,
              },
              {
                label: 'Cancel',
                url: [
                  '/index.cfm?action=admin:properties.details',
                  `property_id=${propertyId}`,
                  `user_id=${userID}`,
                ].join('&'),
                disabled: loading || saving,
              },
            ]}
          />
          <Tabs
            key={tabKey + loading.toString()}
            defaultOpenIdx={tabIdx}
            onChange={setTabIdx}
            tabs={[
              {
                label: 'Request',
                content: (
                  <Request
                    key={loading.toString()}
                    //@ts-ignore
                    ref={requestRef}
                    serviceItem={entry}
                    propertyEvents={propertyEvents}
                    loading={loading}
                    jobTypeOptions={jobTypeOptions}
                    jobSubtypeOptions={jobSubtypeOptions}
                    jobTypeSubtypes={jobTypeSubtypes}
                    onChange={handleChangeEntry}
                    disabled={saving}
                    onValid={setRequestValid}
                    onInitSchema={handleSetRequestfields}
                  />
                ),
              },
              {
                label: 'Equipment',
                content: loading ? (
                  <InfoTable data={makeFakeRows(4, 4)} loading />
                ) : (
                  <Equipment
                    {...props}
                    serviceItem={entry}
                    customer={customer}
                    property={property}
                  />
                ),
              },
              ...(serviceCallId
                ? [
                    {
                      label: 'Services',
                      content: loggedUser ? (
                        <Services
                          serviceCallId={serviceCallId}
                          servicesRendered={servicesRendered}
                          loggedUser={loggedUser}
                          loadServicesRendered={loadServicesRenderedDataForProp}
                          loading={loading}
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
                content: loading ? (
                  <InfoTable data={makeFakeRows(4, 5)} loading />
                ) : (
                  <Invoice
                    serviceItem={entry}
                    onChange={handleChangeEntry}
                    disabled={saving}
                    servicesRendered={servicesRendered}
                    onInitSchema={handleSetRequestfields}
                  />
                ),
              },
              ...(serviceCallId
                ? [
                    {
                      label: 'Proposal',
                      content: loading ? (
                        <InfoTable data={makeFakeRows(2, 5)} loading />
                      ) : (
                        <Proposal
                          serviceItem={entry}
                          customer={customer}
                          property={property}
                        />
                      ),
                    },
                  ]
                : []),
              ...(serviceCallId
                ? [
                    {
                      label: 'Spiffs',
                      content: loading ? (
                        <InfoTable data={makeFakeRows(8, 5)} loading />
                      ) : (
                        <Spiffs
                          serviceItem={entry}
                          loggedUserId={loggedUserId}
                          loggedUserName={UserClientService.getCustomerName(
                            loggedUser!,
                          )}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </>
      )}
      {customer && serviceCallId > 0 && (
        <Modal
          open={notificationEditing || notificationViewing}
          onClose={() => {
            handleSetNotificationViewing(false)();
            handleSetNotificationEditing(false)();
          }}
        >
          <Form<User>
            title={
              notificationViewing
                ? 'Customer Notification'
                : `${
                    notification === '' ? 'Add' : 'Edit'
                  } Customer Notification`
            }
            schema={SCHEMA_PROPERTY_NOTIFICATION}
            data={customer}
            onSave={handleSaveCustomer}
            onClose={() => {
              handleSetNotificationViewing(false)();
              handleSetNotificationEditing(false)();
            }}
            disabled={saving}
            readOnly={notificationViewing}
            actions={
              notificationViewing
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
    </>
  );
};
