import React from 'react';
import { PageWrapper } from '../PageWrapper/main';
import { Vehicle } from '@kalos-core/kalos-rpc/compiled-protos/user_pb';
import { UserClientService, makeSafeFormObject } from '../../helpers';
import { Form, Schema } from '../ComponentsLibrary/Form';
import { InfoTable, Columns } from '../ComponentsLibrary/InfoTable';

// add any prop types here
interface props {
  userID: number;
}

const SCHEMA_VEHICLE: Schema<Vehicle> = [
  [
    { name: 'getMake', label: 'Vehicle Make' },
    { name: 'getModel', label: 'Vehicle Model' },
    { name: 'getYear', label: 'Vehicle Year' },
  ],
  [
    { name: 'getEngine', label: 'Engine Type' },
    { name: 'getIdentificationNumber', label: 'VIN' },
  ],
];

export const VehicleView: React.FC<props> = function VehicleView({ userID }) {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [activeVehicle, setActiveVehicle] = React.useState<Vehicle>(
    new Vehicle(),
  );

  const fetchVehicles = async function fetchVehicles() {
    setVehicles(
      (
        await UserClientService.BatchGetVehicles(new Vehicle())
      ).getResultsList(),
    );
  };

  // TODO turn this into a form instead of a canned onClick function
  const createVehicle = async function createVehicle() {
    const v = new Vehicle();
    v.setIsActive(1);
    v.setOwnerId(8418);
    try {
      const id = await UserClientService.CreateVehicle(v);
      console.log({ id });
    } catch (err) {
      console.log(err);
    }
    await fetchVehicles();
  };

  React.useEffect(() => {
    fetchVehicles();
  }, []);

  const makeSetActiveVehicle = function handleSetActiveVehicle(v: Vehicle) {
    return () => setActiveVehicle(v);
  };

  const closeForm = function closeForm() {
    setActiveVehicle(new Vehicle());
  };

  const updateVehicle = async function updateVehicle(data: Vehicle) {
    try {
      await UserClientService.UpdateVehicle(
        makeSafeFormObject(data, activeVehicle),
      );
    } catch (err) {
      console.log(err);
    }
    closeForm();
    await fetchVehicles();
  };

  const vehicleToColumn = function vehicleToColumn(v: Vehicle) {
    const setAsActive = makeSetActiveVehicle(v);
    return [
      { value: v.getMake(), onClick: setAsActive },
      { value: v.getModel(), onClick: setAsActive },
      { value: v.getYear(), onClick: setAsActive },
      { value: v.getEngine(), onClick: setAsActive },
      { value: v.getIdentificationNumber(), onClick: setAsActive },
    ];
  };

  const tableColumns: Columns = [
    { name: 'Make' },
    { name: 'Model' },
    { name: 'Year' },
    { name: 'Engine' },
    {
      name: 'Identification Number',
      actions: [{ label: 'New Vehicle', onClick: createVehicle }],
    },
  ];

  return (
    <PageWrapper userID={userID} withHeader>
      {activeVehicle.getId() !== 0 && (
        <Form<Vehicle>
          schema={SCHEMA_VEHICLE}
          onClose={closeForm}
          data={activeVehicle}
          onSave={updateVehicle}
          submitLabel="Change"
          cancelLabel="Close"
          title="Edit Vehicle"
        />
      )}
      <InfoTable data={vehicles.map(vehicleToColumn)} columns={tableColumns} />
    </PageWrapper>
  );
};
