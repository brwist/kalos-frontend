import React, { useState, useCallback } from 'react';
import { CustomerInformation } from './';
import { PlainForm, Schema } from '../PlainForm';
import { LoremIpsumList, ExampleTitle } from '../helpers';

type Entry = {
  userID: number;
  propertyId: string;
  withChildren: boolean;
  readOnly: boolean;
};

const SCHEMA: Schema<Entry> = [
  [
    { label: 'User ID', name: 'userID' },
    { label: 'Property ID', name: 'propertyId' },
    { label: 'With Children', name: 'withChildren', type: 'checkbox' },
    { label: 'Read Only', name: 'readOnly', type: 'checkbox' },
  ],
];

export default () => {
  const [userID, setUserID] = useState<number>(2573);
  const [propertyId, setPropertyId] = useState<string>('6552');
  const [withChildren, setWithChildren] = useState<boolean>(true);
  const [readOnly, setReadonly] = useState<boolean>(false);
  const data: Entry = { userID, propertyId, withChildren, readOnly };
  const handleChange = useCallback(
    (data: Entry) => {
      const { userID, propertyId, withChildren, readOnly } = data;
      setUserID(userID);
      setPropertyId(propertyId);
      setWithChildren(+withChildren === 1);
      setReadonly(+readOnly === 1);
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
        readOnly={readOnly}
      >
        {withChildren && <LoremIpsumList />}
      </CustomerInformation>
    </>
  );
};
