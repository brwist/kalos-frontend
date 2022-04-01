import React, { useReducer, useCallback, useEffect } from 'react';
import { QuoteLine } from '../../../@kalos-core/kalos-rpc/QuoteLine';
import {
  makeFakeRows,
  QuoteLineClientService,
  TimesheetDepartmentClientService,
  usd,
  UserClientService,
} from '../../../helpers';
import { InfoTable } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/CheckCircle';
import { PlainForm, Schema } from '../PlainForm';
import { TimesheetDepartment } from '../../../@kalos-core/kalos-rpc/TimesheetDepartment';
import { debounce } from 'lodash';
import { PageWrapper } from '../../PageWrapper/main';
import Box from '@material-ui/core/Box';
import { User } from '../../../@kalos-core/kalos-rpc/User';
import { Typography } from '@material-ui/core';

export interface Props {
  loggedUserId: number;
  onClose?: () => void;
}

interface FormData {
  description: string;
  cost: string;
  department: Number[];
}

interface State {
  user: User;
  canEditFlatRates: boolean;
  canEditDepartment: boolean;
  department: number;
  departmentList: TimesheetDepartment[];
  selectedRowId: number;
  flatRates: QuoteLine[];
  filteredFlatRates: QuoteLine[];
  edit: boolean;
  createNew: boolean;
  loaded: boolean;
  formData: FormData;
  pendingSave: FormData;
  searchParams: FormData;
  reload: boolean;
  saving: boolean;
  remove: boolean;
}

type Action =
  | { type: 'setFlatRates'; data: QuoteLine[] }
  | { type: 'setLoaded'; data: boolean }
  | {
      type: 'setData';
      data: {
        flatRates: QuoteLine[];
        filteredFlatRates: QuoteLine[];
        loaded: boolean;
      };
    }
  | {
      type: 'setEdit';
      data: {
        selectedRowId: number;
        edit: boolean;
        formData: FormData;
      };
    }
  | { type: 'setCreateNew'; data: boolean }
  | { type: 'setFormData'; data: FormData }
  | { type: 'setPendingSave'; data: FormData }
  | { type: 'cancel'; data: FormData }
  | { type: 'setDepartmentList'; data: TimesheetDepartment[] }
  | { type: 'setSearchParams'; data: FormData }
  | { type: 'setFilteredData'; data: QuoteLine[] }
  | { type: 'setSaving'; data: boolean }
  | {
      type: 'setUser';
      data: {
        user: User;
        canEditFlatRate: boolean;
        canEditDepartment: boolean;
      };
    }
  | {
      type: 'setPendingDelete';
      data: {
        selectedRowId: number;
        remove: boolean;
      };
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setFlatRates':
      return {
        ...state,
        flatRates: action.data,
      };
    case 'setLoaded':
      return {
        ...state,
        loaded: action.data,
      };
    case 'setData':
      return {
        ...state,
        flatRates: action.data.flatRates,
        filteredFlatRates: action.data.filteredFlatRates,
        loaded: action.data.loaded,
        reload: false,
      };
    case 'setEdit':
      return {
        ...state,
        selectedRowId: action.data.selectedRowId,
        edit: action.data.edit,
        formData: action.data.formData,
        pendingSave: action.data.formData,
      };
    case 'setCreateNew':
      return {
        ...state,
        createNew: action.data,
      };
    case 'setFormData':
      return {
        ...state,
        formData: action.data,
      };
    case 'setPendingSave':
      return {
        ...state,
        pendingSave: action.data,
      };
    case 'cancel':
      return {
        ...state,
        edit: false,
        pendingSave: action.data,
        selectedRowId: 0,
      };
    case 'setDepartmentList':
      return {
        ...state,
        departmentList: action.data,
      };
    case 'setSearchParams':
      return {
        ...state,
        searchParams: action.data,
        reload: true,
      };
    case 'setFilteredData':
      return {
        ...state,
        filteredFlatRates: action.data,
      };
    case 'setSaving':
      return {
        ...state,
        saving: action.data,
      };
    case 'setUser':
      return {
        ...state,
        user: action.data.user,
        canEditFlatRates: action.data.canEditFlatRate,
        canEditDepartment: action.data.canEditDepartment,
      };
    case 'setPendingDelete':
      return {
        ...state,
        selectedRowId: action.data.selectedRowId,
        remove: action.data.remove,
      };
    default:
      return state;
  }
};

const initialFormData: FormData = {
  description: '',
  cost: '',
  department: [],
};

const initialState: State = {
  user: new User(),
  canEditFlatRates: false,
  canEditDepartment: false,
  department: 0,
  departmentList: [],
  selectedRowId: 0,
  flatRates: [],
  filteredFlatRates: [],
  edit: false,
  loaded: false,
  createNew: false,
  formData: initialFormData,
  pendingSave: initialFormData,
  searchParams: initialFormData,
  reload: false,
  saving: false,
  remove: false,
};

export const FlatRateSheet: React.FC<Props> = function FlatRateSheet({
  loggedUserId,
  onClose,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleToggleEdit = (
    type: string,
    selectedRowId = 0,
    data: FormData,
  ) => {
    if (type === 'edit') {
      dispatch({
        type: 'setEdit',
        data: { selectedRowId: selectedRowId, edit: true, formData: data },
      });
    } else if (type === 'cancel') {
      dispatch({
        type: 'cancel',
        data: { description: '', cost: '', department: [] },
      });
    }
  };

  const handleTogglePendingDelete = (selectedRow: number, remove: boolean) => {
    dispatch({
      type: 'setPendingDelete',
      data: {
        selectedRowId: selectedRow,
        remove: remove,
      },
    });
  };

  const handleToggleAdd = () =>
    dispatch({ type: 'setCreateNew', data: !state.createNew });

  const getUserData = useCallback(async () => {
    const userObj = new User();
    userObj.setId(loggedUserId);
    const user = await UserClientService.Get(userObj);
    const canEditFlatRate = user
      .getPermissionGroupsList()
      .find(p => p.getName() === 'EditFlatRates');
    const canEditDepartments = user
      .getPermissionGroupsList()
      .find(p => p.getName() === 'EditFlatRateDepartment');
    dispatch({
      type: 'setUser',
      data: {
        user: user,
        canEditFlatRate: canEditFlatRate !== undefined,
        canEditDepartment: canEditDepartments !== undefined,
      },
    });
  }, [loggedUserId]);

  const handleSave = async (id: number, data?: any) => {
    const flatRate = new QuoteLine();
    if (id === 0) {
      if (data && data['Department'][0] === '') {
        data['Department'][0] = '0';
      }
      const description = data['Description'] ? data['Description'] : '';
      const cost = data['Cost'] ? data['Cost'] : '';
      const department = data['Department']
        ? data['Department'].toString()
        : '0';
      flatRate.setDescription(description);
      flatRate.setAdjustment(cost);
      flatRate.setDepartments(department);
      flatRate.setIsActive(1);
      flatRate.setIsFlatrate('1');
      try {
        await QuoteLineClientService.Create(flatRate);
      } catch (err) {
        console.error('Failed to Create Flat Rate', err);
      }
      handleToggleAdd();
    } else {
      flatRate.setId(id);
      flatRate.setDescription(state.pendingSave.description);
      flatRate.setAdjustment(
        state.pendingSave.cost.replace('$', '').replace(' ', ''),
      );
      flatRate.setDepartments(state.pendingSave.department.toString());
      try {
        await QuoteLineClientService.Update(flatRate);
      } catch (err) {
        console.error('Failed to Save Flat Rate', err);
      }
      handleToggleEdit('cancel', 0, initialFormData);
    }
    dispatch({ type: 'setLoaded', data: false });
    dispatch({ type: 'setSaving', data: false });
  };

  const handleDelete = async (id: number) => {
    const quoteReq = new QuoteLine();
    quoteReq.setId(id);
    try {
      await QuoteLineClientService.Delete(quoteReq);
    } catch (err) {
      console.error('Failed to Update Flat Rate', err);
    }
    dispatch({ type: 'setLoaded', data: false });
  };

  const updateSearchParams = async (formData: FormData) => {
    const updatedForm: FormData = {
      description: formData.description,
      cost: formData.cost,
      department: formData.department,
    };
    dispatch({ type: 'setSearchParams', data: updatedForm });
  };

  const getFlatRates = useCallback(
    async (refresh: boolean) => {
      let qlResults: QuoteLine[] = [];
      let filteredQLResults: QuoteLine[] = [];
      let startingPage = 0;
      if (refresh) {
        const quoteReq = new QuoteLine();
        quoteReq.setIsActive(1);
        quoteReq.setIsFlatrate('1');
        quoteReq.setPageNumber(startingPage);
        quoteReq.setWithoutLimit(true);
        try {
          qlResults = (
            await QuoteLineClientService.BatchGet(quoteReq)
          ).getResultsList();
        } catch (e) {
          console.error('could not fetch results for flat rate', e);
        }
        qlResults = qlResults.sort(function (a, b) {
          if (a.getDescription() < b.getDescription()) {
            return -1;
          }
          if (a.getDescription() > b.getDescription()) {
            return 1;
          }
          return 0;
        });
        filteredQLResults = qlResults.filter(rate => {
          if (
            state.searchParams.description !== '' &&
            rate
              .getDescription()
              .search(new RegExp(state.searchParams.description, 'i')) === -1
          ) {
            return false;
          }
          if (
            state.searchParams.cost !== '' &&
            rate.getAdjustment().search(new RegExp(state.searchParams.cost)) ===
              -1
          ) {
            return false;
          }
          if (state.searchParams.department.length > 0) {
            let foundDepartments = state.searchParams.department.filter(dep =>
              rate.getDepartments().split(',').includes(String(dep)),
            );
            if (foundDepartments.length === 0) {
              return false;
            }
          }
          return true;
        });
        dispatch({
          type: 'setData',
          data: {
            flatRates: qlResults,
            filteredFlatRates: filteredQLResults,
            loaded: true,
          },
        });
      } else {
        qlResults = state.flatRates.filter(rate => {
          if (
            state.searchParams.description !== '' &&
            rate
              .getDescription()
              .search(new RegExp(state.searchParams.description, 'i')) === -1
          ) {
            return false;
          }
          if (
            state.searchParams.cost !== '' &&
            rate.getAdjustment().search(new RegExp(state.searchParams.cost)) ===
              -1
          ) {
            return false;
          }
          if (state.searchParams.department.length > 0) {
            let foundDepartments = state.searchParams.department.filter(dep =>
              rate.getDepartments().split(',').includes(String(dep)),
            );
            if (foundDepartments.length === 0) {
              return false;
            }
          }
          return true;
        });
        dispatch({ type: 'setFilteredData', data: qlResults });
      }
    },
    [state.searchParams, state.flatRates],
  );

  const getDepartments = useCallback(async () => {
    const dep = new TimesheetDepartment();
    dep.setIsActive(1);
    try {
      const departmentList = await TimesheetDepartmentClientService.BatchGet(
        dep,
      );
      dispatch({
        type: 'setDepartmentList',
        data: departmentList.getResultsList(),
      });
    } catch (err) {
      console.error('Unable to Retrieve Department List', err);
    }
  }, []);

  useEffect(() => {
    if (!state.loaded) {
      if (state.user.getId() === 0) {
        getUserData();
      } else {
        getFlatRates(true);
        getDepartments();
      }
    }
    if (state.reload) {
      getFlatRates(false);
    }
  }, [
    getFlatRates,
    state.loaded,
    getDepartments,
    state.reload,
    getUserData,
    state.user,
  ]);

  const DESCRIPTION_SCHEMA: Schema<FormData> = [
    [
      {
        name: 'description',
        label: 'Description',
        type: 'text',
      },
    ],
  ];

  const COST_SCHEMA: Schema<FormData> = [
    [
      {
        name: 'cost',
        label: 'Cost',
        type: 'text',
      },
    ],
  ];

  const DEPARTMENT_SCHEMA: Schema<FormData> = [
    [
      {
        name: 'department',
        label: 'Department(s)',
        type: 'multiselect',
        options: state.departmentList.map(dl => ({
          key: dl.getId() + dl.getDescription(),
          label: `${dl.getValue()} - ${dl.getDescription()}`,
          value: dl.getId(),
        })),
      },
    ],
  ];

  const SEARCH_PARAMS: Schema<FormData> = [
    [
      {
        name: 'description',
        label: 'Description',
        type: 'text',
      },
      {
        name: 'cost',
        label: 'Cost',
        startAdornment: '$ ',
        type: 'text',
      },
      {
        name: 'department',
        label: 'Department(s)',
        type: 'multiselect',
        options: state.departmentList.map(dl => ({
          key: dl.getId() + dl.getDescription(),
          label: `${dl.getValue()} - ${dl.getDescription()}`,
          value: dl.getId(),
        })),
      },
    ],
  ];

  return (
    <PageWrapper userID={loggedUserId}>
      <SectionBar
        title="Flat Rates"
        actions={
          onClose
            ? [
                {
                  label: state.createNew ? 'Cancel Add' : 'Add New Flat Rate',
                  onClick: () => handleToggleAdd(),
                  style: { display: state.canEditFlatRates ? '' : 'none' },
                },
                {
                  label: 'Close',
                  onClick: onClose,
                },
              ]
            : [
                {
                  label: state.createNew ? 'Cancel Add' : 'Add New Flat Rate',
                  onClick: () => handleToggleAdd(),
                  style: { display: state.canEditFlatRates ? '' : 'none' },
                },
              ]
        }
        uncollapsable
      />
      {/* @ts-ignore*/}
      <Box
        sx={{
          width: '100%',
          position: 'sticky',
          top: { xs: '35px', md: '48px' },
          zIndex: 3,
          backgroundColor: 'white',
          borderTop: '0px',
          borderLeft: '0px',
          borderRight: '0px',
          border: 'solid',
          borderColor: 'black',
        }}
      >
        <div>
          <PlainForm
            schema={SEARCH_PARAMS}
            data={state.searchParams}
            onChange={debounce(updateSearchParams, 1000)}
          />
        </div>
      </Box>
      {!state.loaded && <InfoTable loading data={makeFakeRows(3, 7)} />}
      {state.loaded && (
        <InfoTable
          compact={!state.canEditFlatRates}
          onSaveRowButton={debounce(result => {
            dispatch({ type: 'setSaving', data: true });
            if (result) handleSave(0, result);
          }, 200)}
          rowButton={{
            type: new QuoteLine(),
            columnDefinition: {
              columnsToIgnore: ['Actions'],
              columnTypeOverrides: [
                { columnName: 'Description', columnType: 'text' },
                { columnName: 'Cost', columnType: 'text' },
                {
                  columnName: 'Department',
                  columnType: 'multiselect',
                  options: state.departmentList.map(dl => ({
                    label: `${dl.getValue()} - ${dl.getDescription()}`,
                    value: dl.getId(),
                  })),
                },
              ],
            },
            externalButton: true,
            externalButtonClicked: state.createNew,
            disable: state.saving,
          }}
          ignoreImage
          ignoreNotify
          columns={[
            { name: 'Description', width: window.innerWidth * 0.5 },
            { name: 'Cost', width: window.innerWidth * 0.1 },
            { name: 'Department', width: window.innerWidth * 0.3 },
            {
              name: 'Actions',
              width: window.innerWidth * 0.1,
              invisible: !state.canEditFlatRates,
            },
          ]}
          data={state.filteredFlatRates.map(value => {
            return [
              {
                value:
                  state.remove && state.selectedRowId === value.getId() ? (
                    <Typography
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bolder',
                        fontSize: '20px',
                      }}
                    >
                      Are you sure you want to delete this record?
                    </Typography>
                  ) : state.edit && state.selectedRowId === value.getId() ? (
                    <PlainForm
                      onChange={debounce(result => {
                        let pendingSave = state.pendingSave;
                        pendingSave.description = result.description;
                        dispatch({ type: 'setPendingSave', data: pendingSave });
                      }, 500)}
                      schema={DESCRIPTION_SCHEMA}
                      data={state.formData}
                    />
                  ) : (
                    value.getDescription()
                  ),
              },
              {
                value:
                  state.remove && state.selectedRowId === value.getId() ? (
                    <div></div>
                  ) : state.edit && state.selectedRowId === value.getId() ? (
                    <PlainForm
                      onChange={debounce(result => {
                        let pendingSave = state.pendingSave;
                        pendingSave.cost = result.cost;
                        dispatch({ type: 'setPendingSave', data: pendingSave });
                      }, 500)}
                      schema={COST_SCHEMA}
                      data={state.formData}
                    />
                  ) : (
                    usd(parseFloat(value.getAdjustment()))
                  ),
              },
              {
                value:
                  state.remove && state.selectedRowId === value.getId() ? (
                    <div></div>
                  ) : state.edit &&
                    state.selectedRowId === value.getId() &&
                    state.canEditDepartment ? (
                    <PlainForm
                      onChange={result => {
                        let pendingSave = state.pendingSave;
                        pendingSave.department = result.department;
                        dispatch({ type: 'setPendingSave', data: pendingSave });
                      }}
                      schema={DEPARTMENT_SCHEMA}
                      data={state.formData}
                    />
                  ) : value.getDepartments() === '0' ? (
                    'All Departments'
                  ) : (
                    state.departmentList
                      .filter(dep =>
                        value
                          .getDepartments()
                          .split(',')
                          .includes(String(dep.getId())),
                      )
                      .map(dep => dep.getValue())
                      .toString()
                  ),
              },
              {
                value: (
                  <div>
                    {state.selectedRowId !== value.getId() &&
                      state.canEditFlatRates && (
                        <div>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() =>
                                handleToggleEdit('edit', value.getId(), {
                                  description: value.getDescription(),
                                  cost: usd(parseFloat(value.getAdjustment())),
                                  department: value
                                    .getDepartments()
                                    .split(',')
                                    .map(dep => Number(dep)),
                                })
                              }
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() =>
                                handleTogglePendingDelete(value.getId(), true)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                    {state.edit &&
                      state.selectedRowId === value.getId() &&
                      state.canEditFlatRates && (
                        <div>
                          <Tooltip title="Save">
                            <IconButton
                              onClick={() => handleSave(value.getId())}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Cancel">
                            <IconButton
                              onClick={() =>
                                handleToggleEdit('cancel', 0, {
                                  description: '',
                                  cost: '',
                                  department: [],
                                })
                              }
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                    {state.remove &&
                      state.selectedRowId === value.getId() &&
                      state.canEditFlatRates && (
                        <div>
                          <Tooltip title="Confirm">
                            <IconButton
                              onClick={() => handleDelete(value.getId())}
                            >
                              <CheckIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton
                              onClick={() =>
                                handleTogglePendingDelete(0, false)
                              }
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                  </div>
                ),
              },
            ];
          })}
        />
      )}
    </PageWrapper>
  );
};
