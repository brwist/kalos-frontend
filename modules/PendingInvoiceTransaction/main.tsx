import React, { FC, useCallback, useState, useReducer } from 'react';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { PlainForm, Schema } from '../ComponentsLibrary/PlainForm';
import { InfoTable, Columns } from '../ComponentsLibrary/InfoTable';
import { PendingInvoiceTransaction } from '../../@kalos-core/kalos-rpc/compiled-protos/pending_invoice_transaction_pb';
import { parse } from 'papaparse';
import { PendingInvoiceTransactionClientService } from '../../helpers';
import { parseISO, format, parse as dateParse } from 'date-fns';
import { Select, MenuItem } from '@material-ui/core/';
import { Loader } from '../Loader/main';
import { Tabs } from '../ComponentsLibrary/Tabs';
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
      });
      if (convertedData.length > 0) {
        const header = convertedData[0];
        const columnList: Columns = [];
        const mappedList = [];
        for (let i = 0; i < header.length; i++) {
          const column = { name: header[i] };
          mappedList.push({ dropDownValue: 0, columnIndex: i });
          columnList.push(column);
        }
        dispatch({ type: ACTIONS.SET_COLUMNS, data: columnList });
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
    const header = data[0];
    dispatch({
      type: ACTIONS.SET_LOADING,
      data: true,
    });
    const notesField = state.columnDropDownAssignment.find(
      el => el.dropDownValue == 4,
    );
    const invoiceNumberField = state.columnDropDownAssignment.find(
      el => el.dropDownValue == 1,
    );
    const amountField = state.columnDropDownAssignment.find(
      el => el.dropDownValue == 2,
    );
    const dateField = state.columnDropDownAssignment.find(
      el => el.dropDownValue == 3,
    );
    for (let i = 1; i < data.length; i++) {
      const req = new PendingInvoiceTransaction();
      if (notesField) {
        req.setNotes(data[i][notesField.columnIndex]);
      }
      if (invoiceNumberField) {
        req.setInvoiceNumber(data[i][invoiceNumberField.columnIndex]);
      }
      if (dateField) {
        let dateValue = data[i][dateField.columnIndex];
        try {
          let dateParse = dateValue.split('/');
          const month = dateParse[0];
          const day = dateParse[1];
          let year = dateParse[2];
          const date = new Date();
          date.setMonth(parseInt(month));
          date.setDate(parseInt(day));
          if (year.length <= 2) {
            year = '20' + year;
          }
          date.setFullYear(parseInt(year));
          const finalDateValue = format(date, 'yyyy-MM-dd hh:mm:ss');
          req.setTimestamp(finalDateValue);
        } catch (err) {
          dispatch({
            type: ACTIONS.SET_ERROR,
            data: 'Something went wrong when trying to validate the date, please select another field or contact Webtech',
          });
          dispatch({
            type: ACTIONS.SET_LOADING,
            data: false,
          });
          return;
        }
      }
      if (amountField) {
        let transcribeAmount = 0;
        const amountValue = data[i][amountField.columnIndex];
        const testForLetters = /[a-z]/i.test(amountValue);
        const testForBadCharacters = /[/:-?{-~!"^_`[\]]/.test(amountValue);
        if (testForLetters == false && testForBadCharacters == false) {
          try {
            let amountString = amountValue;
            amountString = replaceAll(amountString, '(', '');
            amountString = replaceAll(amountString, ')', '');
            amountString = replaceAll(amountString, '$', '');
            amountString = replaceAll(amountString, ',', '');
            try {
              transcribeAmount = parseFloat(amountString);
            } catch (err) {
              console.log('could not transcribe the amount,', err);
            }
            req.setAmount(transcribeAmount.toFixed(2));
          } catch (err) {
            console.log('could not transcribe amount:', amountValue);
            dispatch({
              type: ACTIONS.SET_ERROR,
              data: 'Could not transcribe the amount data.',
            });
            dispatch({
              type: ACTIONS.SET_LOADING,
              data: false,
            });
            return;
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
        await PendingInvoiceTransactionClientService.Create(req);
      } else {
        dispatch({
          type: ACTIONS.SET_LOADING,
          data: false,
        });
        dispatch({
          type: ACTIONS.SET_ERROR,
          data: 'We detected no fields were selected',
        });
      }
    }
    dispatch({ type: ACTIONS.SET_LOADING, data: false });
  }, [state.data, state.columnDropDownAssignment]);
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
      const currentAssignment = state.columnDropDownAssignment;
      const findExistingAssignment = currentAssignment.findIndex(
        el => el.dropDownValue == dropDownIndex,
      );
      if (findExistingAssignment != -1 && dropDownIndex != 0) {
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
                          idx,
                          data.target.value as number,
                        )
                      }
                    >
                      {generateDropDown()}
                    </Select>
                  </div>
                ),
              },
            ];
          })}
        />
      ) : undefined}
      {state.loading ? <Loader /> : undefined}
    </div>
  );
};
