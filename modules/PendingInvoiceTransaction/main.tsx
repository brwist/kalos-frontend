import React, { FC, useCallback, useState, useReducer } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import DeleteIcon from '@material-ui/icons/Delete';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { PlainForm, Schema } from '../ComponentsLibrary/PlainForm';
import { InfoTable, Columns } from '../ComponentsLibrary/InfoTable';
import {} from '../../helpers';

import { parse } from 'papaparse';
type FormData = {
  filename: string;
};
type Field = {
  name: string;
  columnIndex: number | undefined;
};
/*
  const [formData, setFormData] = useState<FormData>({ filename: '' });
  const [columns, setColumns] = useState<Columns>([]);
  const [drowDownFieldList,setDropDownFieldSet]=useState<Field[]>()
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<string[]>();

*/

const initialState: State = {
  formData: { filename: '' },
  columns: [],
  dropDownFieldList: [
    { name: 'Vendor', columnIndex: undefined },
    { name: 'Invoice Number', columnIndex: undefined },
    { name: 'Amount', columnIndex: undefined },
    { name: 'Date', columnIndex: undefined },
    { name: 'Notes', columnIndex: undefined },
  ],
  loading: false,
  error: '',
  data: [],
};
export type State = {
  formData: FormData;
  columns: Columns;
  dropDownFieldList: Field[];
  loading: boolean;
  error: string;
  data: string[];
};

export enum ACTIONS {
  SET_FORM_DATA = 'setFormData',
  SET_COLUMNS = 'setColumns',
  SET_DROP_DOWN_FIELD_LIST = 'setDropDownFieldList',
  SET_LOADING = 'setLoading',
  SET_ERROR = 'setError',
  SET_DATA = 'setData',
}

export type Action =
  | { type: ACTIONS.SET_FORM_DATA; data: FormData }
  | { type: ACTIONS.SET_COLUMNS; data: Columns }
  | { type: ACTIONS.SET_DROP_DOWN_FIELD_LIST; data: Field[] }
  | { type: ACTIONS.SET_LOADING; data: boolean }
  | { type: ACTIONS.SET_ERROR; data: string }
  | { type: ACTIONS.SET_DATA; data: string[] };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_FORM_DATA: {
      return {
        ...state,
        formData: action.data,
      };
    }
    case ACTIONS.SET_COLUMNS: {
      return {
        ...state,
        columns: action.data,
      };
    }
    case ACTIONS.SET_DROP_DOWN_FIELD_LIST: {
      return {
        ...state,
        dropDownFieldList: action.data,
      };
    }
    case ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.data,
      };
    }
    case ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.data,
      };
    }
    case ACTIONS.SET_DATA: {
      return {
        ...state,
        data: action.data,
      };
    }
    default:
      return state;
  }
};

export const PendingInvoiceTransaction: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFileLoad = useCallback(async (file: string, filename: string) => {
    dispatch({ type: ACTIONS.SET_ERROR, data: '' });
    dispatch({ type: ACTIONS.SET_LOADING, data: true });
    try {
      const fileContent = atob(file.split(';base64,')[1]);
      let convertedData: string[] = [];
      const parseData = parse<string>(fileContent, {
        header: false,
        dynamicTyping: false,
        worker: false,
        complete: function (results) {
          convertedData = results.data;
          dispatch({ type: ACTIONS.SET_DATA, data: results.data });
        },
        // step: actions.step,
        error: console.log,
      });
      if (convertedData.length > 0) {
        const header = convertedData[0];
        const columnList: Columns = [];
        for (let i = 0; i < header.length; i++) {
          const column = { name: header[i] };
          columnList.push(column);

          dispatch({ type: ACTIONS.SET_COLUMNS, data: columnList });
        }
      }
    } catch (err) {
      // @ts-ignore
      dispatch({ type: ACTIONS.SET_ERROR, data: err });
    }
    dispatch({ type: ACTIONS.SET_LOADING, data: false });
  }, []);
  const handleSaveNewRecords = useCallback(async () => {
    // TODO
  }, []);
  const SCHEMA: Schema<FormData> = [
    [
      {
        name: 'filename',
        label: 'Transaction File',
        type: 'file',
        required: true,
        onFileLoad: handleFileLoad,
      },
    ],
  ] as Schema<FormData>;
  return (
    <div>
      <SectionBar
        title="Pending Invoice Transactions"
        actions={[
          {
            label: 'Save new records',
            onClick: handleSaveNewRecords,
            disabled: !state.formData.filename || !!state.error,
          },
        ]}
        fixedActions
      />
      <PlainForm<FormData>
        schema={SCHEMA}
        data={state.formData}
        onChange={data => dispatch({ type: ACTIONS.SET_FORM_DATA, data: data })}
        error={state.error}
      />
      {state.columns.length > 0 ? (
        <InfoTable columns={state.columns} />
      ) : undefined}
    </div>
  );
};
