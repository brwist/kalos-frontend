import React, { useState, FC, useCallback } from 'react';
import { PlaceAutocompleteAddressForm } from './index';
import { AddressPair } from './Address';
import { Schema } from '../Form';

const SCHEMA_EXAMPLE: Schema<AddressPair.AsObject> = [
  [
    {
      label: 'Origin',
      headline: true,
    },
  ],
  [
    {
      label: 'Address',
      type: 'text',
      name: 'FullAddressOrigin',
    },
  ],
  [
    {
      label: 'Street Address',
      name: 'StreetAddressOrigin',
      type: 'text',
    },
    {
      label: 'City',
      name: 'CityOrigin',
      type: 'text',
    },
    {
      label: 'State',
      name: 'StateOrigin',
      type: 'text',
    },
  ],
  [
    {
      label: 'Country',
      name: 'CountryOrigin',
      type: 'text',
    },
    {
      label: 'Zip Code',
      name: 'ZipCodeOrigin',
      type: 'text',
    },
  ],
  [
    {
      label: 'Destination',
      headline: true,
    },
  ],
  [
    {
      label: 'Address',
      type: 'text',
      name: 'FullAddressDestination',
    },
  ],
  [
    {
      label: 'Street Address',
      name: 'StreetAddressDestination',
      type: 'text',
    },
    {
      label: 'City',
      name: 'CityDestination',
      type: 'text',
    },
    {
      label: 'State',
      name: 'StateDestination',
      type: 'text',
    },
  ],
  [
    {
      label: 'Country',
      name: 'CountryDestination',
      type: 'text',
    },
    {
      label: 'Zip Code',
      name: 'ZipCodeDestination',
      type: 'text',
    },
  ],
  [
    {
      label: 'Notes',
      headline: true,
    },
  ],
  [
    {
      label: 'Notes',
      name: 'Notes',
      type: 'text',
      multiline: true,
    },
  ],
];

interface Props {}

const PlaceForm: FC<Props> = ({}) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleSave = useCallback((addresses: AddressPair.AddressPair) => {
    console.log('Saving addresses: ', addresses);
    alert(
      'Would save addresses right now (See console for the address values that would be saved).',
    );
  }, []);

  return (
    <>
      {open && (
        <PlaceAutocompleteAddressForm
          onClose={handleClose}
          onSave={(addresses: AddressPair.AddressPair) => {
            handleSave(addresses);
          }}
          addressFields={2} // To be implemented
          schema={SCHEMA_EXAMPLE}
        />
      )}
    </>
  );
};

export default () => (
  <>
    <PlaceForm />
  </>
);
