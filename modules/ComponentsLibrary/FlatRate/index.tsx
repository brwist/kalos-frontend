import React, { useReducer, useCallback, useEffect } from 'react';
import { QuoteLine } from '@kalos-core/kalos-rpc/QuoteLine';
import { QuoteLineClientService, usd } from '../../../helpers';
import { InfoTable } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { PlainForm, Schema } from '../PlainForm';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { debounce } from 'lodash';

export interface Props {
  loggedUserId: number;
}

interface FormData {
  description: string;
  cost: string;
  department: TimesheetDepartment[];
}

interface State {
  department: number;
  selectedRowId: number;
  flatRates: QuoteLine[];
  edit: boolean;
  createNew: boolean;
  loaded: boolean;
  formData: FormData;
  pendingSave: FormData;
}

type Action =
  | { type: 'setFlatRates'; data: QuoteLine[] }
  | { type: 'setLoaded'; data: boolean }
  | { type: 'setData'; data: {
    flatRates: QuoteLine[],
    loaded: boolean,
  }}
  | { type: 'setEdit'; data: {
    selectedRowId: number,
    edit: boolean,
    formData: FormData,
  }}
  | { type: 'setCreateNew'; data: boolean }
  | { type: 'setFormData'; data: FormData }
  | { type: 'setPendingSave'; data: FormData }
  | { type: 'cancel'; data: FormData }
;

const reducer = (state : State, action: Action) => {
  switch (action.type) {
    case 'setFlatRates':
      return {
        ...state,
        flatRates: action.data
      }
    case 'setLoaded':
      return {
        ...state,
        loaded: action.data
      }
    case 'setData':
      return {
        ...state,
        flatRates: action.data.flatRates,
        loaded: action.data.loaded,
      }
    case 'setEdit':
      return {
        ...state,
        selectedRowId: action.data.selectedRowId,
        edit: action.data.edit,
        formData: action.data.formData,
        pendingSave: action.data.formData,
      }
    case 'setCreateNew':
      return {
        ...state,
        createNew: action.data,
      }
    case 'setFormData':
      return {
        ...state,
        formData: action.data,
      }
    case 'setPendingSave':
      return {
        ...state,
        pendingSave: action.data,
      }
    case 'cancel':
      return {
        ...state,
        edit: false,
        pendingSave: action.data,
      }
    default:
      return state
  }
}

const initialFormData : FormData = {
  description: "",
  cost: "",
  department: [],
}

const initialState : State = {
  department: 0,
  selectedRowId: 0,
  flatRates: [],
  edit: false,
  loaded: false,
  createNew: false,
  formData: initialFormData,
  pendingSave: initialFormData,
}

export const FlatRateSheet: React.FC<Props> = function FlatRateSheet({
  loggedUserId,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleToggleEdit = (type: string, selectedRowId = 0, data: FormData) => {
    if (type === "edit") {
      dispatch({type: 'setEdit', data: {selectedRowId: selectedRowId, edit: true, formData: data}});
    } else if (type === "cancel") {
      dispatch({type: 'cancel', data: {description: "", cost: "", department: []}});
      
    }
  }

  const handleToggleAdd = () => dispatch({ type: 'setCreateNew', data: !state.createNew })

  const handleSave = (id : number, data? : any) => {
    const flatRate = new QuoteLine();
    if (id === 0) {
      const description = data['Description'] ? data['Description'] : "";
      const cost = data['Cost'] ? data['Cost'] : "";
      const department = data['Department'] ? data['Department'].split(',') : [];
      flatRate.setDescription(description);
      flatRate.setAdjustment(cost);
      flatRate.setIsActive(1);

    } else {
      flatRate.setDescription(state.pendingSave.description);
      flatRate.setAdjustment(state.pendingSave.cost);
    }

  }

  const handleDelete = (id : number) => {
    const quoteReq = new QuoteLine();
    quoteReq.setId(id);
    quoteReq.setIsActive(0)
    try {
      QuoteLineClientService.Update(quoteReq);
    } catch (err) {
      console.error('Failed to Update Flat Rate', err);
    }
  }

  const getFlatRates = useCallback(async() => {
    let qlResults: QuoteLine[] = [];
    let startingPage = 0;
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
      console.log('could not fetch results for flat rate', e);
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
    dispatch({type: 'setData', data: {flatRates: qlResults, loaded: true}});
  }, [])

  useEffect( ()=> {
    if (!state.loaded) {
      getFlatRates();
    }
  }, [getFlatRates, state.loaded])

  const DESCRIPTION_SCHEMA : Schema<FormData> = [
    [
      {
        name: "description",
        type: "text",
      }
    ]
  ]

  const COST_SCHEMA : Schema<FormData> = [
    [
      {
        name: "cost",
        type: "text",
      }
    ]
  ]

  const DEPARTMENT_SCHEMA : Schema<FormData> = [
    [
      {
        name: "department",
        type: "department",
      }
    ]
  ]

  return (
    <SectionBar
      title="Flat Rates"
      actions={[
        {
          label: state.createNew ? "Cancel Add" : "Add New Flat Rate",
          onClick: ()=>handleToggleAdd(),
        }
      ]}
    >
      <InfoTable
        onSaveRowButton={result => {
          if (result)
          handleSave(0, result)
        }}
        rowButton={{
          type: new QuoteLine(),
          columnDefinition: {
            columnsToIgnore: [],
            columnTypeOverrides: [
              { columnName: 'Description', columnType: 'text' },
              { columnName: 'Cost', columnType: 'text' },
              { columnName: 'Department', columnType: 'department' },
            ]
          },
          externalButton: true,
          externalButtonClicked: state.createNew,
        }}
        ignoreImage
        ignoreNotify
        columns={[{ name: 'Description', width: window.innerWidth * .5 }, { name: 'Cost', width: window.innerWidth * .1}, { name: 'Department', width: window.innerWidth * .3}, { name: '', width: window.innerWidth * .1 }]}
        data={state.flatRates.map(value => {
          return [
            {
              value: state.edit && state.selectedRowId == value.getId() ? 
              <PlainForm 
                onChange={debounce((result)=>{
                  console.log("Description Change", result)
                  let pendingSave = state.pendingSave;
                  pendingSave.description = result.description;
                  dispatch({type: 'setPendingSave', data: pendingSave});
                }, 500)}
                schema={DESCRIPTION_SCHEMA}
                data={state.formData}
              />
              : value.getDescription(),
            },
            {
              value: state.edit && state.selectedRowId == value.getId() ? 
              <PlainForm 
                onChange={debounce((result)=>{
                  console.log("Cost Change")
                  let pendingSave = state.pendingSave;
                  pendingSave.cost = result.cost;
                  dispatch({type: 'setPendingSave', data: pendingSave});
                }, 500)}
                schema={COST_SCHEMA}
                data={state.formData}
              />
              : usd(parseInt(value.getAdjustment())),
            },
            {
              value: state.edit && state.selectedRowId == value.getId() ? 
              <PlainForm 
                onChange={(result)=>{
                  let pendingSave = state.pendingSave;
                  pendingSave.department = result.department;
                  dispatch({type: 'setPendingSave', data: pendingSave});
                }}
                schema={DEPARTMENT_SCHEMA}
                data={state.formData}
              />
              : "Temporary Department Name"
            },
            {
              value: (
                <div>
                  {(!state.edit || state.selectedRowId !== value.getId()) && (
                    <div>
                      <Tooltip
                        title="Edit"
                      >
                        <IconButton 
                          onClick={()=>handleToggleEdit("edit", value.getId(), {description: value.getDescription(), cost: usd(parseInt(value.getAdjustment())), department: []})}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title="Delete"
                      >
                        <IconButton onClick={()=>handleDelete(value.getId())}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                  {state.edit && state.selectedRowId === value.getId() && (
                    <div>
                      <Tooltip
                        title="Save"
                      >
                        <IconButton
                          onClick={()=>handleSave(value.getId())}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title="Cancel"
                      >
                        <IconButton
                          onClick={()=>handleToggleEdit("cancel", 0, {description: "", cost: "", department: []})}
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
    </SectionBar>
  )
}