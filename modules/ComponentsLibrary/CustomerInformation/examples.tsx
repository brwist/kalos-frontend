import React, { useState, useCallback } from 'react';
import { CustomerInformation } from './';
import { PlainForm, Schema } from '../PlainForm';
import { LoremIpsumList, ExampleTitle } from '../helpers';

type Entry = {
  userID: number;
  propertyId: string;
  withChildren: boolean;
  viewedAsCustomer: boolean;
};

const SCHEMA: Schema<Entry> = [
  [
    { label: 'User ID', name: 'userID' },
    { label: 'Property ID', name: 'propertyId' },
    { label: 'With Children', name: 'withChildren', type: 'checkbox' },
    { label: 'Viewed as Customer', name: 'viewedAsCustomer', type: 'checkbox' },
  ],
];

export default () => {
  const [userID, setUserID] = useState<number>(2573);
  const [propertyId, setPropertyId] = useState<string>('6552');
  const [withChildren, setWithChildren] = useState<boolean>(true);
  const [viewedAsCustomer, setViewedAsCustomer] = useState<boolean>(false);
  const data: Entry = { userID, propertyId, withChildren, viewedAsCustomer };
  const handleChange = useCallback(
    (data: Entry) => {
      const { userID, propertyId, withChildren, viewedAsCustomer } = data;
      setUserID(userID);
      setPropertyId(propertyId);
      setWithChildren(+withChildren === 1);
      setViewedAsCustomer(+viewedAsCustomer === 1);
    },
    [setUserID, setPropertyId, setWithChildren, setViewedAsCustomer],
  );
  return (
    <>
      <ExampleTitle>
        <PlainForm schema={SCHEMA} data={data} onChange={handleChange} />
      </ExampleTitle>
      <CustomerInformation
        key={`${userID}-${propertyId}`}
        userID={userID}
        propertyId={+propertyId}
        onClose={() => console.log('CLOSE')}
        viewedAsCustomer={viewedAsCustomer}
      >
        {withChildren && <LoremIpsumList />}
      </CustomerInformation>
    </>
  );
};
