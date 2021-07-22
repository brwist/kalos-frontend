import React from 'react';
import { PageWrapper } from '../PageWrapper/main';
import { User } from '@kalos-core/kalos-rpc/User';
import { Vehicle } from '@kalos-core/kalos-rpc/compiled-protos/user_pb';
import { UserClientService, makeSafeFormObject } from '../../helpers';
import { Form, Schema } from '../ComponentsLibrary/Form';
import { InfoTable } from '../ComponentsLibrary/InfoTable';
import { Button } from '../ComponentsLibrary/Button';
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

    await fetchVehicles();
  };

  return (
    <PageWrapper userID={userID} withHeader>
      {vehicles.map(v => {
        if (v.getIsActive()) {
          return (
            <h1 key={`vehicle_${v.getId()}`}>
              {v.getMake()} {v.getModel()} {v.getYear()}{' '}
              {v.getIdentificationNumber()}
            </h1>
          );
        }
        if (v.getId() === activeVehicle.getId()) {
          return (
            <Form<Vehicle>
              key={`vehicle_${activeVehicle.getId()}`}
              schema={SCHEMA_VEHICLE}
              onClose={closeForm}
              data={activeVehicle}
              onSave={updateVehicle}
              submitLabel="Change"
              cancelLabel="close"
              title="This form component sucks why did I let it exist"
            />
          );
        }
        return (
          <React.Fragment key={`vehicle_${v.getId()}`}>
            <h1>{v.getId()} is not active</h1>
            <Button
              label="set as active vehicle"
              onClick={makeSetActiveVehicle(v)}
            />
          </React.Fragment>
        );
      })}
    </PageWrapper>
  );
};
