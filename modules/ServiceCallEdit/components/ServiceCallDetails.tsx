import React, { FC, useState, useEffect, useCallback } from 'react';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { User } from '@kalos-core/kalos-rpc/User';
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
} from '../../../helpers';
import { ENDPOINT } from '../../../constants';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Tabs } from '../../ComponentsLibrary/Tabs';
import { Option } from '../../ComponentsLibrary/Field';
import { Request } from './Request';
import { Equipment } from './Equipment';
import { Services } from './Services';
import { Invoice } from './Invoice';
import { Proposal } from './Proposal';

const EventClientService = new EventClient(ENDPOINT);

export type EventType = Event.AsObject;
type JobTypeType = JobType.AsObject;
type JobSubtypeType = JobSubtype.AsObject;
export type JobTypeSubtypeType = JobTypeSubtype.AsObject;

export interface Props {
  userID: number;
  propertyId: number;
  serviceCallId: number;
  loggedUserId: number;
}

export const ServiceCallDetails: FC<Props> = props => {
  const { userID, propertyId, serviceCallId } = props;
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
      const req = new Event();
      req.setId(serviceCallId);
      const entry = await EventClientService.Get(req);
      console.log({ entry });
      setEntry(entry);
      setLoading(false);
      setLoaded(true);
    } catch (e) {
      setError(true);
    }
  }, [
    setLoading,
    setError,
    setEntry,
    setLoaded,
    setJobTypes,
    serviceCallId,
    userID,
    propertyId,
    setPropertyEvents,
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
    }
  }, [loaded, load]);

  const handleChangeEntry = useCallback(
    (data: EventType) => setEntry({ ...entry, ...data }),
    [entry, setEntry],
  );

  const jobTypeOptions: Option[] = jobTypes.map(
    ({ id: value, name: label }) => ({ label, value }),
  );

  const jobSubtypeOptions: Option[] = [
    { label: '-- Select --', value: 0 },
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
            label: 'Add Notification',
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
            content: <Equipment {...props} />,
          },
          {
            label: 'Services',
            content: <Services />,
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
            content: <Proposal />,
          },
        ]}
        defaultOpenIdx={3}
      />
    </div>
  );
};
