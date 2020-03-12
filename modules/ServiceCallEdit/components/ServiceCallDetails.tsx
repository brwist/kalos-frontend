import React, { FC, useState, useEffect, useCallback } from 'react';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { User } from '@kalos-core/kalos-rpc/User';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { ENDPOINT } from '../../../constants';
import { loadUserById, loadPropertyById } from '../../../helpers';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Tabs } from '../../ComponentsLibrary/Tabs';
import { Request } from './Request';
import { Equipment } from './Equipment';
import { Services } from './Services';
import { Invoice } from './Invoice';
import { Proposal } from './Proposal';

const EventClientService = new EventClient(ENDPOINT);

export type EventType = Event.AsObject;
type CustomerType = User.AsObject;
type PropertyType = Property.AsObject;

export interface Props {
  userID: number;
  propertyId: number;
  serviceCallId: number;
}

export const ServiceCallDetails: FC<Props> = props => {
  const { userID, propertyId, serviceCallId } = props;
  const [entry, setEntry] = useState<EventType>(new Event().toObject());
  const [customer, setCustomer] = useState<CustomerType>(new User().toObject());
  const [property, setProperty] = useState<PropertyType>(
    new Property().toObject(),
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const load = useCallback(async () => {
    setLoading(true);
    const req = new Event();
    req.setId(serviceCallId);
    try {
      const user = await loadUserById(userID);
      setCustomer(user);
      const property = await loadPropertyById(propertyId);
      setProperty(property);
      const entry = await EventClientService.Get(req);
      setEntry(entry);
      setLoading(false);
      setLoaded(true);
    } catch (e) {
      setError(true);
    }
  }, [
    setLoading,
    setError,
    setCustomer,
    setProperty,
    serviceCallId,
    userID,
    propertyId,
  ]);

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);

  const { logJobNumber, contractNumber } = entry;
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
      <SectionBar title="Service Call Details">
        <InfoTable data={data} loading={loading} error={error} />
      </SectionBar>
      <Tabs
        tabs={[
          {
            label: 'Request',
            content: <Request serviceItem={entry} loading={loading} />,
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
