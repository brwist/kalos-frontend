import React, { useState, useCallback } from 'react';
import { CustomerInformation } from './';
import { PlainForm, Schema } from '../PlainForm';
import { LoremIpsumList, ExampleTitle } from '../helpers';

type Entry = {
  userID: number;
  propertyId: string;
  withChildren: boolean;
};

const SCHEMA: Schema<Entry> = [
  [
    { label: 'User ID', name: 'userID' },
    { label: 'Property ID', name: 'propertyId' },
    { label: 'With Children', name: 'withChildren', type: 'checkbox' },
  ],
];

export default () => {
  const [userID, setUserID] = useState<number>(2573);
  const [propertyId, setPropertyId] = useState<string>('6552');
  const [withChildren, setWithChildren] = useState<boolean>(true);
  const data: Entry = { userID, propertyId, withChildren };
  const handleChange = useCallback(
    (data: Entry) => {
      const { userID, propertyId, withChildren } = data;
      setUserID(userID);
      setPropertyId(propertyId);
      setWithChildren(+withChildren === 1);
    },
    [setUserID, setPropertyId, setWithChildren],
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
      >
        {withChildren && <LoremIpsumList />}
      </CustomerInformation>
    </>
  );
};
