import React, { FC, useCallback, useState, useReducer } from 'react';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { PlainForm, Schema } from '../ComponentsLibrary/PlainForm';
import { InfoTable, Columns } from '../ComponentsLibrary/InfoTable';
import { PendingInvoiceTransaction } from '../../@kalos-core/kalos-rpc/compiled-protos/pending_invoice_transaction_pb';

import { parse } from 'papaparse';
import { parseISO, format, parse as dateParse } from 'date-fns';
import { Select, MenuItem } from '@material-ui/core/';
type FormData = {
  filename: string;
};
type Field = {
  label: string;
  value: number;
};
type Assignment = {
  dropDownValue: number;
  columnIndex: number;
};
type Selected = {
  value: number;
};
const initialState: State = {
  formData: { filename: '' },
  columns: [],
  dropDownFieldList: [
    { label: 'None', value: 0 },
    { label: 'Invoice Number', value: 1 },
    { label: 'Amount', value: 2 },
    { label: 'Date', value: 3 },
    { label: 'Notes', value: 4 },
  ],
  loading: false,
  recordCount: 0,
  columnDropDownAssignment: [],
  error: '',
  data: [],
};

export type State = {
  formData: FormData;
  columns: Columns;
  dropDownFieldList: Field[];
  //key is column,  so when we pass a dropdown, we assign a new column to it
  columnDropDownAssignment: Assignment[];
  recordCount: number;
  loading: boolean;
  error: string;
  data: string[][];
};

export enum ACTIONS {
  SET_FORM_DATA = 'setFormData',
  SET_COLUMNS = 'setColumns',
  SET_DROP_DOWN_FIELD_LIST = 'setDropDownFieldList',
  SET_COLUMN_DROPDOWN_ASSIGNMENT = 'setColumnDropdownAssigment',
  SET_LOADING = 'setLoading',
  SET_RECORD_COUNT = 'setRecordCount',
  SET_ERROR = 'setError',
  SET_DATA = 'setData',
}

export type Action =
  | { type: ACTIONS.SET_FORM_DATA; data: FormData }
  | { type: ACTIONS.SET_COLUMNS; data: Columns }
  | { type: ACTIONS.SET_RECORD_COUNT; data: number }
  | { type: ACTIONS.SET_DROP_DOWN_FIELD_LIST; data: Field[] }
  | {
      type: ACTIONS.SET_COLUMN_DROPDOWN_ASSIGNMENT;
      data: Assignment[];
    }
  | { type: ACTIONS.SET_LOADING; data: boolean }
  | { type: ACTIONS.SET_LOADING; data: boolean }
  | { type: ACTIONS.SET_ERROR; data: string }
  | { type: ACTIONS.SET_DATA; data: string[][] };

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
    case ACTIONS.SET_COLUMN_DROPDOWN_ASSIGNMENT: {
      return {
        ...state,
        columnDropDownAssignment: action.data,
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
    case ACTIONS.SET_RECORD_COUNT: {
      return {
        ...state,
        recordCount: action.data,
      };
    }
    default:
      return state;
  }
};

export const PendingInvoiceTransactionComponent: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFileLoad = useCallback(async (file: string, filename: string) => {
    dispatch({ type: ACTIONS.SET_ERROR, data: '' });
    dispatch({ type: ACTIONS.SET_LOADING, data: true });
    dispatch({ type: ACTIONS.SET_COLUMN_DROPDOWN_ASSIGNMENT, data: [] });

    try {
      const fileContent = atob(file.split(';base64,')[1]);
      let convertedData: string[][] = [];
      const parseData = parse<string[]>(fileContent, {
        header: false,
        dynamicTyping: false,
        worker: false,
        complete: function (results) {
          convertedData = results.data;
          dispatch({
            type: ACTIONS.SET_DATA,
            data: results.data.filter(el => el.length > 1),
          });
          dispatch({
            type: ACTIONS.SET_RECORD_COUNT,
            data: results.data.filter(el => el.length > 1).length,
          });
        },
        error: console.log,
      });
      if (convertedData.length > 0) {
        const header = convertedData[0];
        const columnList: Columns = [];
        const mappedList = [];
        for (let i = 0; i < header.length; i++) {
          const column = { name: header[i] };
          console.log({ dropDownValue: 0, columnIndex: i });
          mappedList.push({ dropDownValue: 0, columnIndex: i });
          columnList.push(column);
        }
        dispatch({ type: ACTIONS.SET_COLUMNS, data: columnList });
        console.log('mappedList', mappedList);
        dispatch({
          type: ACTIONS.SET_COLUMN_DROPDOWN_ASSIGNMENT,
          data: mappedList,
        });
      }
    } catch (err) {
      // @ts-ignore
      dispatch({ type: ACTIONS.SET_ERROR, data: err });
    }
    dispatch({ type: ACTIONS.SET_LOADING, data: false });
  }, []);
  const getColumnIndex = (columnName: string, headerList: string[]) => {
    const index = headerList.findIndex(el => el == columnName);
    return index;
  };
  const findFieldValue = useCallback(
    (columnName: string, headerList: string[]) => {
      return '';
    },
    [],
  );
  const replaceAll = (string: string, search: string, replace: string) => {
    return string.split(search).join(replace);
  };
  const generateDropDown = () => {
    const elementMap: JSX.Element[] = [];

    state.dropDownFieldList.map((el, idx) => {
      const element = (
        <MenuItem key={idx.toString() + el.label} value={el.value}>
          {el.label}
        </MenuItem>
      );
      elementMap.push(element);
    });
    return elementMap;
  };
  const handleSaveNewRecords = useCallback(async () => {
    let data = state.data;

    console.log(data);
    const header = data[0];
    const notes = findFieldValue('Notes', header);
    const invoiceNumber = findFieldValue('Invoice Number', header);
    const amount = findFieldValue('Amount', header);
    const date = findFieldValue('Date', header);
    console.log(notes);
    for (let i = 1; i < data.length; i++) {
      const req = new PendingInvoiceTransaction();
      if (notes != '') {
        const index = getColumnIndex(notes, header);
        req.setNotes(data[i][index]);
        console.log('got notes', data[i][index]);
      }
      if (invoiceNumber != '') {
        const index = getColumnIndex(invoiceNumber, header);
        req.setInvoiceNumber(data[i][index]);
      }
      if (date != '') {
        const index = getColumnIndex(date, header);
        let dateValue = data[i][index];
        try {
          console.log(dateValue);
          let finalDateValue = format(
            dateParse(dateValue, 'm/d/yyyy', new Date()),
            'yyyy-MM-dd hh:mm:ss',
          );
          req.setTimestamp(finalDateValue);
        } catch (err) {
          console.log('could not transcribe date,', err);
          dispatch({
            type: ACTIONS.SET_ERROR,
            data: 'Something went wrong when trying to validate the date, please select another field or contact Webtech',
          });
        }
      }
      if (amount != '') {
        const index = getColumnIndex(amount, header);
        let transcribeAmount = 0;
        const amountValue = data[i][index];
        const testForLetters = /[a-z]/i.test(amountValue);
        const testForBadCharacters = /[-/:-?{-~!"^_`[\]]/.test(amountValue);
        if (testForLetters == false && testForBadCharacters == false) {
          try {
            let amountString = amountValue;
            amountString = replaceAll(amountString, '(', '');
            amountString = replaceAll(amountString, ')', '');
            amountString = replaceAll(amountString, '$', '');
            amountString = replaceAll(amountString, ',', '');
            try {
              transcribeAmount = parseFloat(amountString);
              console.log('amount fixed', transcribeAmount);
            } catch (err) {
              console.log('could not transcribe the amount,', err);
            }
            req.setAmount(transcribeAmount.toFixed(2));
          } catch (err) {
            console.log(data[i]);
            console.log('could not transcribe amount:', amountValue);
          }
        } else {
          dispatch({
            type: ACTIONS.SET_ERROR,
            data: 'We detected that this contained letters for the Amount value. Amounts should not have letters',
          });
          return;
        }
      }
      if (
        req.getAmount() != '' ||
        req.getInvoiceNumber() != '' ||
        req.getNotes() != '' ||
        req.getTimestamp() != ''
      ) {
        //client.Create(req);
      } else {
        dispatch({
          type: ACTIONS.SET_ERROR,
          data: 'We detected no fields were selected',
        });
      }
    }
  }, [state.data, findFieldValue]);
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

  const handleToggleColumnToField = useCallback(
    (columnIndex: number, dropDownIndex: number) => {
      console.log('starting function');
      const currentAssignment = state.columnDropDownAssignment;
      const findExistingAssignment = currentAssignment.findIndex(
        el => el.dropDownValue == dropDownIndex,
      );
      if (findExistingAssignment > 0) {
        console.log('already assigned, removing from existing');
        currentAssignment[findExistingAssignment].dropDownValue = 0;
      }
      const currentItemIndex = currentAssignment.findIndex(
        el => el.columnIndex == columnIndex,
      );
      const currentItem = currentAssignment[currentItemIndex];
      currentItem.dropDownValue = dropDownIndex;
      currentAssignment[currentItemIndex] = currentItem;
      console.log(currentAssignment);

      dispatch({
        type: ACTIONS.SET_COLUMN_DROPDOWN_ASSIGNMENT,
        data: currentAssignment,
      });
      dispatch({
        type: ACTIONS.SET_ERROR,
        data: '',
      });
    },
    [state.columnDropDownAssignment],
  );

  const SCHEMA_DROPDOWNS: Schema<Assignment> = [
    [
      {
        name: 'dropDownValue',
        label: 'Select Field',
        options: state.dropDownFieldList,
      },
      {
        name: 'columnIndex',
        type: 'hidden',
      },
    ],
  ];
  return (
    <div>
      <SectionBar
        title="Pending Invoice Transactions"
        subtitle={`Record Count:${state.recordCount}`}
        actions={[
          {
            label: 'Save new records',
            onClick: handleSaveNewRecords,
            disabled: !state.formData.filename || !!state.error,
          },
        ]}
        fixedActions
        loading={state.loading}
      />
      <PlainForm<FormData>
        schema={SCHEMA}
        data={state.formData}
        onChange={data => dispatch({ type: ACTIONS.SET_FORM_DATA, data: data })}
        error={state.error}
      />
      {state.columns.length > 0 &&
      state.columnDropDownAssignment.length > 0 &&
      state.dropDownFieldList.length > 0 ? (
        <InfoTable
          key={'TableAssignemnt'}
          columns={[{ name: 'File Header' }, { name: 'Field Select' }]}
          data={state.columns.map((column, idx) => {
            return [
              {
                value: column.name,
              },
              {
                value: (
                  <div
                    key={`${idx}${column.name}${
                      state.columnDropDownAssignment.find(
                        el => el.columnIndex == idx,
                      )?.columnIndex
                    }`}
                  >
                    <Select
                      key={idx}
                      value={
                        state.columnDropDownAssignment.find(
                          el => el.columnIndex == idx,
                        )!.dropDownValue
                      }
                      onChange={data =>
                        handleToggleColumnToField(
                          data.target.value as number,
                          idx,
                        )
                      }
                    >
                      {generateDropDown()}
                    </Select>
                    {/*/        <PlainForm
                    key={`${idx}${column.name}`}
                    schema={SCHEMA_DROPDOWNS}
                    data={
                      state.columnDropDownAssignment.find(
                        el => el.columnIndex == idx,
                      )!
                    }
                    
                  
                  />*/}
                  </div>
                ),
              },
            ];
          })}
        />
      ) : undefined}
    </div>
  );
};
