import React from 'react';
import { PageWrapper } from '../../PageWrapper/main';
import { Vehicle } from '../../../@kalos-core/kalos-rpc/compiled-protos/user_pb';
import {
  UserClientService,
  makeSafeFormObject,
  TimesheetLineClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { Form, Schema } from '../Form';
import { reducer, ACTIONS, assignmentData } from './reducer';
import { InfoTable, Columns } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import { useCallback, useReducer } from 'react';
import { Modal } from '../Modal';
import { TimesheetDepartment } from '../../../@kalos-core/kalos-rpc/TimesheetDepartment';
import IconButton from '@material-ui/core/IconButton';
import PersonAdd from '@material-ui/icons/PersonAdd';
import { ROWS_PER_PAGE } from '../../../constants';
import { Confirm } from '../Confirm';
import Delete from '@material-ui/icons/Delete';
import { Int32 } from '../../../@kalos-core/kalos-rpc/compiled-protos/common_pb';
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

const SCHEMA_ASSIGNMENT: Schema<assignmentData> = [
  [
    { name: 'userId', label: 'Assigned Employee', type: 'technician' },
    { name: 'departmentId', label: 'Assigned Department', type: 'department' },
  ],
];
export const VehicleView: React.FC<props> = function VehicleView({ userID }) {
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    orderBy: 'id',
    page: 0,
    loaded: false,
    creatingVehicle: false,
    changingPage: false,
    vehicles: [],
    assigningVehicle: undefined,
    vehicleCount: 0,
    activeVehicle: undefined,
    departments: [],
    users: [],
    deletingVehicle: undefined,
  });
  const fetchVehicles = useCallback(async () => {
    const req = new Vehicle();
    req.setPageNumber(state.page);
    req.setIsActive(1);
    const results = await UserClientService.BatchGetVehicles(req);
    const users = await UserClientService.loadTechnicians();
    const departmentReq = new TimesheetDepartment();
    departmentReq.setIsActive(1);
    const departments = (
      await TimesheetDepartmentClientService.BatchGet(departmentReq)
    ).getResultsList();
    dispatch({ type: ACTIONS.SET_USERS, data: users });
    dispatch({ type: ACTIONS.SET_DEPARTMENTS, data: departments });
    dispatch({ type: ACTIONS.SET_VEHICLES, data: results.getResultsList() });
    dispatch({
      type: ACTIONS.SET_VEHICLES_COUNT,
      data: results.getTotalCount(),
    });
  }, [state.page]);

  const openCreateVehicle = () => {
    dispatch({ type: ACTIONS.SET_CREATING_VEHICLE, data: true });
  };
  const createVehicle = async function createVehicle(v: Vehicle) {
    const temp = makeSafeFormObject(v, new Vehicle());
    temp.setIsActive(1);
    temp.setOwnerId(103285);

    try {
      console.log(temp);
      const id = await UserClientService.CreateVehicle(temp);
      console.log({ id });
    } catch (err) {
      console.log(err);
    }
    dispatch({ type: ACTIONS.SET_CREATING_VEHICLE, data: false });
    await fetchVehicles();
  };
  React.useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const makeSetActiveVehicle = function handleSetActiveVehicle(v: Vehicle) {
    return () => dispatch({ type: ACTIONS.SET_ACTIVE_VEHICLE, data: v });
  };

  const closeForm = function closeForm() {
    dispatch({ type: ACTIONS.SET_ACTIVE_VEHICLE, data: new Vehicle() });
  };
  const assignUserAndDepartment = async (data: assignmentData) => {
    const req = new Vehicle();
    req.setOwnerId(data.userId);
    req.setDepartmentId(data.departmentId);
    req.setId(data.vehicleId);
    req.setFieldMaskList(['OwnerId', 'DepartmentId']);
    console.log('updating assigned', req);

    try {
      await UserClientService.UpdateVehicle(req);
    } catch (err) {
      console.log('There was an error with updating the vehicle owner', err);
    }
    dispatch({ type: ACTIONS.SET_ASSIGNING_VEHICLE, data: undefined });

    await fetchVehicles();
  };
  const DeleteVehicle = async (data: Vehicle) => {
    const temp = new Int32();
    temp.setValue(data.getId());
    try {
      await UserClientService.DeleteVehicle(temp);
    } catch (err) {
      console.log('There was an error with deleting the vehicle', err);
    }
    dispatch({ type: ACTIONS.SET_DELETING_VEHICLE, data: undefined });

    await fetchVehicles();
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
  const handlePageChange = useCallback((page: number) => {
    dispatch({ type: ACTIONS.SET_PAGE, data: page });
    dispatch({ type: ACTIONS.SET_CHANGING_PAGE, data: true });
    dispatch({ type: ACTIONS.SET_CHANGING_PAGE, data: false });
  }, []);
  const vehicleToColumn = function vehicleToColumn(v: Vehicle) {
    const setAsActive = makeSetActiveVehicle(v);
    const department = state.departments.find(
      department => v.getDepartmentId() === department.getId(),
    );
    const departmentString =
      department === undefined ? 'No Department' : department.getDescription();
    const user = state.users.find(user => v.getOwnerId() === user.getId());
    const userString = user
      ? `${user.getFirstname()} ${user.getLastname()} `
      : 'No Employee';

    return [
      { value: v.getMake(), onClick: setAsActive },
      { value: v.getModel(), onClick: setAsActive },
      { value: v.getYear(), onClick: setAsActive },
      { value: v.getEngine(), onClick: setAsActive },
      { value: departmentString, onClick: setAsActive },
      { value: userString, onClick: setAsActive },
      {
        value: v.getIdentificationNumber(),
        onClick: setAsActive,
        actions: [
          <IconButton
            key="assignStuff"
            size="small"
            onClick={() =>
              dispatch({ type: ACTIONS.SET_ASSIGNING_VEHICLE, data: v })
            }
          >
            <PersonAdd />
          </IconButton>,
          <IconButton
            key="deleteVehicle"
            onClick={() =>
              dispatch({ type: ACTIONS.SET_DELETING_VEHICLE, data: v })
            }
          >
            <Delete />
          </IconButton>,
        ],
      },
    ];
  };

  const tableColumns: Columns = [
    { name: 'Make' },
    { name: 'Model' },
    { name: 'Year' },
    { name: 'Engine' },
    { name: 'Department' },
    { name: 'Assigned User' },
    {
      name: 'VIN Number',
      actions: [{ label: 'New Vehicle', onClick: openCreateVehicle }],
    },
  ];

  return (
    <SectionBar
      title={'Vehicles'}
      pagination={{
        count: state.vehicleCount,
        page: state.page,
        onPageChange: handlePageChange,
        rowsPerPage: ROWS_PER_PAGE,
      }}
    >
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
        key="CreateModal"
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
          onSave={v => createVehicle(v)}
          submitLabel="Create"
          cancelLabel="Close"
          title="Create Vehicle"
        />
      </Modal>
      {state.assigningVehicle && state.assigningVehicle.getId() != 0 && (
        <Modal
          key="AssignmentModal"
          onClose={() =>
            dispatch({ type: ACTIONS.SET_ASSIGNING_VEHICLE, data: undefined })
          }
          open
        >
          <Form<assignmentData>
            schema={SCHEMA_ASSIGNMENT}
            onClose={() =>
              dispatch({ type: ACTIONS.SET_ASSIGNING_VEHICLE, data: undefined })
            }
            data={{
              userId: state.assigningVehicle.getOwnerId(),
              departmentId: state.assigningVehicle.getDepartmentId(),
              vehicleId: state.assigningVehicle.getId(),
            }}
            onSave={e =>
              assignUserAndDepartment({
                userId: e.userId,
                departmentId: e.departmentId,
                vehicleId: state.assigningVehicle!.getId(),
              })
            }
            submitLabel="Assign"
            cancelLabel="Close"
            title="Assign Employee/Department to Vehicle"
          />
        </Modal>
      )}
      {state.deletingVehicle != undefined && (
        <Confirm
          onClose={() =>
            dispatch({ type: ACTIONS.SET_DELETING_VEHICLE, data: undefined })
          }
          open={state.deletingVehicle != undefined}
          onConfirm={() => DeleteVehicle(state.deletingVehicle!)}
          submitLabel={'Delete Vehicle'}
        >
          Are you sure you want to delete this Vehicle?
        </Confirm>
      )}
      <InfoTable
        data={state.vehicles.map(vehicleToColumn)}
        columns={tableColumns}
      />
    </SectionBar>
  );
};
