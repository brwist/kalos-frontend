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
} from '../../../helpers';
import { ENDPOINT } from '../../../constants';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Tabs } from '../../ComponentsLibrary/Tabs';
import { Options, Option } from '../../ComponentsLibrary/Field';
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
}

export const ServiceCallDetails: FC<Props> = props => {
  const { userID, propertyId, serviceCallId } = props;
  const [entry, setEntry] = useState<EventType>(new Event().toObject());
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [jobTypes, setJobTypes] = useState<JobTypeType[]>([]);
  const [jobSubtypes, setJobSubtype] = useState<JobSubtypeType[]>([]);
  const [jobTypeSubtypes, setJobTypeSubtypes] = useState<JobTypeSubtypeType[]>(
    [],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const req = new Event();
    req.setId(serviceCallId);
    try {
      const jobTypes = await loadJobTypes();
      setJobTypes(jobTypes);
      const jobSubtypes = await loadJobSubtypes();
      setJobSubtype(jobSubtypes);
      const jobTypeSubtypes = await loadJobTypeSubtypes();
      setJobTypeSubtypes(jobTypeSubtypes);
      const entry = await EventClientService.Get(req);
      setEntry(entry);
      setLoading(false);
      setLoaded(true);
    } catch (e) {
      setError(true);
    }
  }, [setLoading, setError, setJobTypes, serviceCallId, userID, propertyId]);

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

  const jobSubtypeOptions: Option[] = jobTypeSubtypes
    .filter(({ jobTypeId }) => jobTypeId === entry.jobTypeId)
    .map(({ jobSubtypeId }) => ({
      value: jobSubtypeId,
      label: jobSubtypes.find(({ id }) => id === jobSubtypeId)?.name || '',
    }));

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
          },
          {
            label: 'Save and Invoice',
          },
          {
            label: 'Cancel',
            url: [
              '/index.cfm?action=admin:properties.details',
              `property_id=${propertyId}`,
              `user_id=${userID}`,
            ].join('&'),
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
                loading={loading}
                jobTypeOptions={jobTypeOptions}
                jobSubtypeOptions={jobSubtypeOptions}
                jobTypeSubtypes={jobTypeSubtypes}
                onChange={handleChangeEntry}
              />
            ),
          },
          {
            label: 'Equipment',
            content: <Equipment />,
          },
          {
            label: 'Services',
            content: <Services />,
          },
          {
            label: 'Invoice',
            content: <Invoice />,
          },
          {
            label: 'Proposal',
            content: <Proposal />,
          },
        ]}
      />
    </div>
  );
};
