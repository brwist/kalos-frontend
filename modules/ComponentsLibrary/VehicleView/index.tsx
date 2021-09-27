import React from 'react';
import { PageWrapper } from '../../PageWrapper/main';
import { Vehicle } from '@kalos-core/kalos-rpc/compiled-protos/user_pb';
import { UserClientService, makeSafeFormObject } from '../../../helpers';
import { Form, Schema } from '../Form';
import { reducer, ACTIONS } from './reducer';
import { InfoTable, Columns } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import { useReducer } from 'react';
import { Modal } from '../Modal';
// add any prop types here
interface props {
  userID: number;
  disableWrapper?: boolean;
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
  const fetchVehicles = async function fetchVehicles() {
    const results = (
      await UserClientService.BatchGetVehicles(new Vehicle())
    ).getResultsList();
    dispatch({ type: ACTIONS.SET_VEHICLES, data: results });
  };
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    orderBy: 'id',
    page: 0,
    loaded: false,
    creatingVehicle: false,
    changingPage: false,
    vehicles: [],
    activeVehicle: undefined,
  });
  // TODO turn this into a form instead of a canned onClick function
  const openCreateVehicle = async function createVehicle() {
    /*
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
    */
    dispatch({ type: ACTIONS.SET_CREATING_VEHICLE, data: true });
  };
  const createVehicle = async function createVehicle() {
    /*
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
    */
    dispatch({ type: ACTIONS.SET_CREATING_VEHICLE, data: true });
  };
  React.useEffect(() => {
    fetchVehicles();
  }, []);

  const makeSetActiveVehicle = function handleSetActiveVehicle(v: Vehicle) {
    return () => dispatch({ type: ACTIONS.SET_ACTIVE_VEHICLE, data: v });
  };

  const closeForm = function closeForm() {
    dispatch({ type: ACTIONS.SET_ACTIVE_VEHICLE, data: new Vehicle() });
  };

  const updateVehicle = async function updateVehicle(data: Vehicle) {
    try {
      await UserClientService.UpdateVehicle(
        makeSafeFormObject(data, state.activeVehicle!),
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
      actions: [{ label: 'New Vehicle', onClick: openCreateVehicle }],
    },
  ];

  return (
    <SectionBar title={'Vehicles'}>
      {state.activeVehicle && state.activeVehicle.getId() !== 0 && (
        <Form<Vehicle>
          schema={SCHEMA_VEHICLE}
          onClose={closeForm}
          data={state.activeVehicle}
          onSave={updateVehicle}
          submitLabel="Change"
          cancelLabel="Close"
          title="Edit Vehicle"
        />
      )}
      <Modal
        onClose={() =>
          dispatch({ type: ACTIONS.SET_CREATING_VEHICLE, data: false })
        }
        open={state.creatingVehicle}
      >
        <Form<Vehicle>
          schema={SCHEMA_VEHICLE}
          onClose={() =>
            dispatch({ type: ACTIONS.SET_CREATING_VEHICLE, data: false })
          }
          data={new Vehicle()}
          onSave={createVehicle}
          submitLabel="Create"
          cancelLabel="Close"
          title="Create Vehicle"
        />
      </Modal>
      <InfoTable
        data={state.vehicles.map(vehicleToColumn)}
        columns={tableColumns}
      />
    </SectionBar>
  );
};
