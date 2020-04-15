import React, { FC, useState, useEffect, useCallback } from 'react';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { JobSubtype } from '@kalos-core/kalos-rpc/JobSubtype';
import { JobTypeSubtype } from '@kalos-core/kalos-rpc/JobTypeSubtype';
import { Property } from '@kalos-core/kalos-rpc/Property';
import {
  loadJobTypes,
  loadJobSubtypes,
  loadJobTypeSubtypes,
  getRPCFields,
  loadEventsByPropertyId,
  makeFakeRows,
  loadUserById,
} from '../../../helpers';
import { ENDPOINT, OPTION_BLANK } from '../../../constants';
import { Modal } from '../../ComponentsLibrary/Modal';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Tabs } from '../../ComponentsLibrary/Tabs';
import { Option } from '../../ComponentsLibrary/Field';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { Request } from './Request';
import { Equipment } from './Equipment';
import { Services } from './Services';
import { Invoice } from './Invoice';
import { Proposal } from './Proposal';

const EventClientService = new EventClient(ENDPOINT);
const UserClientService = new UserClient(ENDPOINT);

type Customer = User.AsObject;
export type EventType = Event.AsObject;
type JobTypeType = JobType.AsObject;
type JobSubtypeType = JobSubtype.AsObject;
export type JobTypeSubtypeType = JobTypeSubtype.AsObject;
export type UserType = User.AsObject;

export interface Props {
  userID: number;
  propertyId: number;
  serviceCallId: number;
  loggedUserId: number;
}

const SCHEMA_PROPERTY_NOTIFICATION: Schema<Customer> = [
  [
    {
      label: 'Notification',
      name: 'notification',
      required: true,
      multiline: true,
    },
  ],
];

export const ServiceCallDetails: FC<Props> = props => {
  const { userID, propertyId, serviceCallId, loggedUserId } = props;
  const [entry, setEntry] = useState<EventType>(new Event().toObject());
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
  const [loggedUser, setLoggedUser] = useState<UserType>();
  const [notificationEditing, setNotificationEditing] = useState<boolean>(
    false,
  );
  const [notificationViewing, setNotificationViewing] = useState<boolean>(
    false,
  );
  const loadEntry = useCallback(async () => {
    const req = new Event();
    req.setId(serviceCallId);
    const entry = await EventClientService.Get(req);
    setEntry(entry);
  }, [setEntry, serviceCallId]);
  const load = useCallback(async () => {
    setLoading(true);
    try {
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
  ]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const req = new Event();
    req.setId(serviceCallId);
    const fieldMaskList = [];
    for (const fieldName in entry) {
      if (['id', 'customer', 'property'].includes(fieldName)) continue;
      const { upperCaseProp, methodName } = getRPCFields(fieldName);
      //@ts-ignore
      req[methodName](entry[fieldName]);
      fieldMaskList.push(upperCaseProp);
    }
    req.setFieldMaskList(fieldMaskList);
    const res = await EventClientService.Update(req);
    setEntry(res);
    setSaving(false);
  }, [entry, serviceCallId, setEntry, setSaving]);

  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
    }
    if (entry && entry.customer && entry.customer.notification !== '') {
      setNotificationViewing(true);
    }
  }, [entry, loaded, load, setLoaded, setNotificationViewing]);

  const handleChangeEntry = useCallback(
    (data: EventType) => setEntry({ ...entry, ...data }),
    [entry, setEntry],
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
    async (data: Customer) => {
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

  const { id, logJobNumber, contractNumber, property, customer } = entry;
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
  } = customer || new User().toObject();
  const { address, city, state, zip } = property || new Property().toObject();
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
      { label: 'Job Number', value: logJobNumber },
      { label: 'Email', value: email, href: 'mailto' },
    ],
    [
      { label: 'Property', value: address },
      { label: 'City, State, Zip', value: `${city}, ${state} ${zip}` },
    ],
    [
      { label: 'Billing Terms', value: billingTerms },
      { label: 'Contract Number', value: contractNumber },
    ],
  ];
  return (
    <div>
      <SectionBar
        title="Service Call Details"
        actions={[
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
            url: ['/index.cfm?action=admin:service.viewlogs', `id=${id}`].join(
              '&',
            ),
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
            url: [
              '/index.cfm?action=admin:properties.details',
              `property_id=${propertyId}`,
              `user_id=${userID}`,
            ].join('&'),
          },
        ]}
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
        tabs={[
          {
            label: 'Request',
            content: (
              <Request
                serviceItem={entry}
                propertyEvents={propertyEvents}
                loading={loading}
                jobTypeOptions={jobTypeOptions}
                jobSubtypeOptions={jobSubtypeOptions}
                jobTypeSubtypes={jobTypeSubtypes}
                onChange={handleChangeEntry}
                disabled={saving}
              />
            ),
          },
          {
            label: 'Equipment',
            content: loading ? (
              <InfoTable data={makeFakeRows(4, 4)} loading />
            ) : (
              <Equipment {...props} serviceItem={entry} />
            ),
          },
          {
            label: 'Services',
            content: loggedUser ? (
              <Services serviceCallId={serviceCallId} loggedUser={loggedUser} />
            ) : (
              <InfoTable data={makeFakeRows(4, 4)} loading />
            ),
          },
          {
            label: 'Invoice',
            content: loading ? (
              <InfoTable data={makeFakeRows(4, 5)} loading />
            ) : (
              <Invoice serviceItem={entry} disabled={saving} />
            ),
          },
          {
            label: 'Proposal',
            content: loading ? (
              <InfoTable data={makeFakeRows(2, 5)} loading />
            ) : (
              <Proposal serviceItem={entry} />
            ),
          },
        ]}
        defaultOpenIdx={0}
      />
      {customer && (
        <Modal
          open={notificationEditing || notificationViewing}
          onClose={() => {
            handleSetNotificationViewing(false)();
            handleSetNotificationEditing(false)();
          }}
        >
          <Form<Customer>
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
                        handleSaveCustomer({ notification: '' } as Customer);
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
