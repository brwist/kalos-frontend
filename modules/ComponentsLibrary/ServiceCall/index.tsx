import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { JobSubtype } from '@kalos-core/kalos-rpc/JobSubtype';
import { JobTypeSubtype } from '@kalos-core/kalos-rpc/JobTypeSubtype';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  loadJobTypes,
  loadJobSubtypes,
  loadJobTypeSubtypes,
  getRPCFields,
  loadEventsByPropertyId,
  makeFakeRows,
  loadUserById,
  loadServicesRendered,
  loadPropertyById,
  UserType,
  PropertyType,
  getCustomerName,
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

const EventClientService = new EventClient(ENDPOINT);
const UserClientService = new UserClient(ENDPOINT);

export type EventType = Event.AsObject;
type JobTypeType = JobType.AsObject;
type JobSubtypeType = JobSubtype.AsObject;
export type JobTypeSubtypeType = JobTypeSubtype.AsObject;
export type ServicesRenderedType = ServicesRendered.AsObject;

export interface Props {
  userID: number;
  propertyId: number;
  serviceCallId?: number;
  loggedUserId: number;
  onClose?: () => void;
  onSave?: () => void;
}

const SCHEMA_PROPERTY_NOTIFICATION: Schema<UserType> = [
  [
    {
      label: 'Notification',
      name: 'notification',
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
  } = props;
  const requestRef = useRef(null);
  const [requestFields, setRequestfields] = useState<string[]>([]);
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [tabKey, setTabKey] = useState<number>(0);
  const [pendingSave, setPendingSave] = useState<boolean>(false);
  const [requestValid, setRequestValid] = useState<boolean>(false);
  const [serviceCallId, setServiceCallId] = useState<number>(eventId || 0);
  const [entry, setEntry] = useState<EventType>(new Event().toObject());
  const [property, setProperty] = useState<PropertyType>(
    new Property().toObject(),
  );
  const [customer, setCustomer] = useState<UserType>(new User().toObject());
  const [propertyEvents, setPropertyEvents] = useState<EventType[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [jobTypes, setJobTypes] = useState<JobTypeType[]>([]);
  const [jobSubtypes, setJobSubtype] = useState<JobSubtypeType[]>([]);
  const [jobTypeSubtypes, setJobTypeSubtypes] = useState<JobTypeSubtypeType[]>(
    [],
  );
  const [servicesRendered, setServicesRendered] = useState<
    ServicesRenderedType[]
  >([]);
  const [loggedUser, setLoggedUser] = useState<UserType>();
  const [notificationEditing, setNotificationEditing] = useState<boolean>(
    false,
  );
  const [notificationViewing, setNotificationViewing] = useState<boolean>(
    false,
  );
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
    async (_serviceCallId = serviceCallId) => {
      if (_serviceCallId) {
        setLoading(true);
        const servicesRendered = await loadServicesRendered(_serviceCallId);
        setServicesRendered(servicesRendered);
        setLoading(false);
      }
    },
    [setServicesRendered, serviceCallId],
  );
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const property = await loadPropertyById(propertyId);
      setProperty(property);
      const customer = await loadUserById(userID);
      setCustomer(customer);
      const propertyEvents = await loadEventsByPropertyId(propertyId);
      setPropertyEvents(propertyEvents);
      const jobTypes = await loadJobTypes();
      setJobTypes(jobTypes);
      const jobSubtypes = await loadJobSubtypes();
      setJobSubtype(jobSubtypes);
      const jobTypeSubtypes = await loadJobTypeSubtypes();
      setJobTypeSubtypes(jobTypeSubtypes);
      const loggedUser = await loadUserById(loggedUserId);
      setLoggedUser(loggedUser);
      await loadEntry();
      await loadServicesRenderedData();
      setLoading(false);
    } catch (e) {
      setError(true);
    }
  }, [
    setLoading,
    setError,
    setLoaded,
    setJobTypes,
    userID,
    propertyId,
    setPropertyEvents,
    loggedUserId,
    setLoggedUser,
    setProperty,
    setCustomer,
  ]);

  const handleSave = useCallback(async () => {
    setPendingSave(true);
    if (tabIdx !== 0) {
      setTabIdx(0);
      setTabKey(tabKey + 1);
    }
  }, [setPendingSave, setTabKey, setTabIdx, tabKey, tabIdx]);
  const save = useCallback(async () => {
    setSaving(true);
    const req = new Event();
    req.setIsActive(1);
    const fieldMaskList: string[] = ['IsActive'];
    if (serviceCallId) {
      req.setId(serviceCallId);
    } else {
      setLoading(true);
    }
    requestFields.forEach(fieldName => {
      //@ts-ignore
      if (fieldName === 'id' || typeof entry[fieldName] === 'object') return;
      const { upperCaseProp, methodName } = getRPCFields(fieldName);
      //@ts-ignore
      req[methodName](entry[fieldName]);
      fieldMaskList.push(upperCaseProp);
    });
    req.setFieldMaskList(fieldMaskList);
    const res = await EventClientService[serviceCallId ? 'Update' : 'Create'](
      req,
    );
    setEntry(res);
    setSaving(false);
    if (!serviceCallId) {
      setServiceCallId(res.id);
      await loadEntry(res.id);
      await loadServicesRenderedData(res.id);
    }
    if (onSave) {
      onSave();
    }
  }, [
    entry,
    serviceCallId,
    setEntry,
    setSaving,
    setLoading,
    requestFields,
    onSave,
  ]);

  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
    }
    if (entry && entry.customer && entry.customer.notification !== '') {
      setNotificationViewing(true);
    }
    if (pendingSave && requestValid) {
      setPendingSave(false);
      save();
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
    save,
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
    (data: EventType) => {
      setEntry({ ...entry, ...data });
      setPendingSave(false);
    },
    [entry, setEntry, setPendingSave],
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
    async (data: UserType) => {
      setSaving(true);
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
      await UserClientService.Update(entry);
      await loadEntry();
      setSaving(false);
      handleSetNotificationEditing(false)();
    },
    [setSaving, userID, handleSetNotificationEditing],
  );

  const jobTypeOptions: Option[] = jobTypes.map(
    ({ id: value, name: label }) => ({ label, value }),
  );

  const jobSubtypeOptions: Option[] = [
    { label: OPTION_BLANK, value: 0 },
    ...jobTypeSubtypes
      .filter(({ jobTypeId }) => jobTypeId === entry.jobTypeId)
      .map(({ jobSubtypeId }) => ({
        value: jobSubtypeId,
        label: jobSubtypes.find(({ id }) => id === jobSubtypeId)?.name || '',
      })),
  ];

  const { id, logJobNumber, contractNumber } = entry;
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
  const data: Data = [
    [
      { label: 'Customer', value: `${firstname} ${lastname}` },
      { label: 'Business Name', value: businessname },
    ],
    [
      { label: 'Primary Phone', value: phone },
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
  return (
    <div>
      <SectionBar
        title="Service Call Details"
        actions={
          serviceCallId
            ? [
                {
                  label: 'Spiff Apply',
                  url: [
                    '/index.cfm?action=admin:tasks.addtask',
                    'type=Spiff',
                    `job_no=${logJobNumber}`,
                  ].join('&'),
                },
                {
                  label: 'Job Activity',
                  url: [
                    '/index.cfm?action=admin:service.viewlogs',
                    `id=${id}`,
                  ].join('&'),
                },
                {
                  label: notification ? 'Notification' : 'Add Notification',
                  onClick: notification
                    ? handleSetNotificationViewing(true)
                    : handleSetNotificationEditing(true),
                },
                {
                  label: 'Service Call Search',
                  url: '/index.cfm?action=admin:service.calls',
                },
                {
                  label: 'Close',
                  ...(onClose
                    ? { onClick: onClose }
                    : {
                        url: [
                          '/index.cfm?action=admin:properties.details',
                          `property_id=${propertyId}`,
                          `user_id=${userID}`,
                        ].join('&'),
                      }),
                },
              ]
            : []
        }
      >
        <InfoTable data={data} loading={loading} error={error} />
      </SectionBar>
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
            // onClick: // TODO
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
        key={tabKey}
        defaultOpenIdx={tabIdx}
        onChange={setTabIdx}
        tabs={[
          {
            label: 'Request',
            content: (
              <Request
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
              <Equipment {...props} serviceItem={entry} customer={customer} />
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
                      loadServicesRendered={loadServicesRenderedData}
                      loading={loading}
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
                      loggedUserName={getCustomerName(loggedUser)}
                    />
                  ),
                },
              ]
            : []),
        ]}
      />
      {customer && serviceCallId > 0 && (
        <Modal
          open={notificationEditing || notificationViewing}
          onClose={() => {
            handleSetNotificationViewing(false)();
            handleSetNotificationEditing(false)();
          }}
        >
          <Form<UserType>
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
                        handleSaveCustomer({ notification: '' } as UserType);
                      },
                    },
                  ]
                : []
            }
          />
        </Modal>
      )}
    </div>
  );
};
