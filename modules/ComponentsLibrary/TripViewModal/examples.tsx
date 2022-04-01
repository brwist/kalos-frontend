import React, { FC, useCallback, useState } from 'react';
import { TripInfo, TripViewModal } from './index';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { Schema } from '../Form';
import { ExampleTitle } from '../helpers';
import { PerDiemRow } from '../../../@kalos-core/kalos-rpc/PerDiem';
import { Trip } from '../../../@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';

let Trip1: any = new Trip();
Trip1.setOriginAddress('Origin goes here');
Trip1.setDestinationAddress('Destination goes here');
Trip1 = Trip1.toObject();

const SCHEMA_TRIP_INFO: Schema<TripInfo> = [
  [
    {
      label: 'Origin Address',
      type: 'text',
      name: 'originAddress',
    },
    {
      label: 'Destination Address',
      type: 'text',
      name: 'destinationAddress',
    },
    {
      label: 'Notes',
      type: 'text',
      name: 'notes',
    },
  ],
];

interface Props {}

const TripModal: FC<Props> = ({}) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = useCallback(() => {
    console.log('Closing');
    setOpen(false);
  }, [setOpen]);

  return (
    <>
      {open && (
        <>
          <ExampleTitle>Default</ExampleTitle>
          <TripViewModal
            open={open}
            schema={SCHEMA_TRIP_INFO}
            data={Trip1}
            onClose={() => handleClose()}
            onApprove={(approvedTrip: any) => {
              alert('Approved - see console for the exact approved trip. ');
              console.log(approvedTrip);
            }}
            onProcessPayroll={(processedTrip: any) => {
              alert('Processed - see console for the exact approved trip. ');
              console.log(processedTrip);
            }}
          />{' '}
        </>
      )}
    </>
  );
};

export default () => (
  <>
    <TripModal />
  </>
);
