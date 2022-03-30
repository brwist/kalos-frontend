import React, { FC, useCallback, useState, useReducer, useEffect } from 'react';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { PlainForm, Schema } from '../ComponentsLibrary/PlainForm';
import { InfoTable, Columns } from '../ComponentsLibrary/InfoTable';
import { PendingInvoiceTransaction } from '../../@kalos-core/kalos-rpc/compiled-protos/pending_invoice_transaction_pb';
import { parse } from 'papaparse';
import {
  PendingInvoiceTransactionClientService,
  VendorClientService,
  TransactionClientService,
} from '../../helpers';
import { Transaction } from '../../@kalos-core/kalos-rpc/Transaction';
import { parseISO, format, parse as dateParse } from 'date-fns';
import { Vendor, VendorClient } from '../../@kalos-core/kalos-rpc/Vendor';
import { Select, MenuItem } from '@material-ui/core/';
import { Loader } from '../Loader/main';
import { Tabs } from '../ComponentsLibrary/Tabs';
import { debounce } from 'lodash/';
type FormData = {
  filename: string;
  selectedVendorId: number;
  departmentId: number;
};
type Field = {
  label: string;
  value: number;
};
type Assignment = {
  dropDownValue: number;
  columnIndex: number;
};
export interface Props {
  loggedUserId: number;
}
type InvoiceTransaction = {
  amount: number;
  invoiceNumber: string;
  date: string;
  notes: string;
  vendorId: number;

  departmentId: number;
  selected: number;
  id: number;
};
const initialState: State = {
  formData: { filename: '', selectedVendorId: 0, departmentId: 0 },
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
  vendors: [],
  saving: false,
  loadedInit: false,
  currentPageEntries: [],
  currentToggle: 0,
  pendingInvoices: [],
  loaded: true,
  pendingInvoicePage: 0,
  pendingInvoicesCount: 0,
  error: '',
  data: [],
};

export type State = {
  formData: FormData;
  columns: Columns;
  dropDownFieldList: Field[];
  columnDropDownAssignment: Assignment[];
  pendingInvoices: PendingInvoiceTransaction[];
  pendingInvoicesCount: number;
  loaded: boolean;
  currentToggle: number;
  currentPageEntries: InvoiceTransaction[];
  saving: boolean;
  vendors: Vendor[];
  loadedInit: boolean;
  recordCount: number;
  loading: boolean;
  error: string;
  pendingInvoicePage: number;
  data: string[][];
};

export enum ACTIONS {
  SET_FORM_DATA = 'setFormData',
  SET_COLUMNS = 'setColumns',
  SET_DROP_DOWN_FIELD_LIST = 'setDropDownFieldList',
  SET_COLUMN_DROPDOWN_ASSIGNMENT = 'setColumnDropdownAssigment',
  SET_LOADING = 'setLoading',
  SET_CURRENT_TOGGLE = 'setCurrentToggle',
  SET_CURRENT_PAGE_ENTRIES = 'setCurrentPageEntries',
  UPDATE_SINGLE_ENTRY = 'updateSingleEntry',
  SET_SAVING = 'setSaving',
  SET_VENDORS = 'setVendors',
  SET_PENDING_INVOICES = 'setPendingInvoices',
  SET_PENDING_INVOICES_COUNT = 'setPendingInvoicesCount',
  SET_LOADED = 'setLoaded',
  SET_LOADED_INIT = 'setLoadedInit',

  SET_RECORD_COUNT = 'setRecordCount',
  SET_ERROR = 'setError',
  SET_DATA = 'setData',
  SET_PENDING_INVOICE_PAGE = 'setPendingInvoicePage',
}

export type Action =
  | { type: ACTIONS.SET_FORM_DATA; data: FormData }
  | { type: ACTIONS.SET_COLUMNS; data: Columns }
  | { type: ACTIONS.SET_RECORD_COUNT; data: number }
  | { type: ACTIONS.SET_PENDING_INVOICE_PAGE; data: number }
  | { type: ACTIONS.SET_DROP_DOWN_FIELD_LIST; data: Field[] }
  | { type: ACTIONS.SET_VENDORS; data: Vendor[] }
  | {
      type: ACTIONS.SET_COLUMN_DROPDOWN_ASSIGNMENT;
      data: Assignment[];
    }
  | { type: ACTIONS.SET_LOADING; data: boolean }
  | { type: ACTIONS.SET_SAVING; data: boolean }
  | { type: ACTIONS.UPDATE_SINGLE_ENTRY; data: InvoiceTransaction }
  | { type: ACTIONS.SET_CURRENT_TOGGLE; data: number }
  | { type: ACTIONS.SET_CURRENT_PAGE_ENTRIES; data: InvoiceTransaction[] }
  | { type: ACTIONS.SET_PENDING_INVOICES; data: PendingInvoiceTransaction[] }
  | { type: ACTIONS.SET_PENDING_INVOICES_COUNT; data: number }
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_LOADED_INIT; data: boolean }
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
    case ACTIONS.UPDATE_SINGLE_ENTRY: {
      const entries = state.currentPageEntries;
      const entryIndex = entries.findIndex(el => el.id == action.data.id);
      if (entryIndex != -1) {
        entries[entryIndex] = action.data;
        const req = new PendingInvoiceTransaction();
        req.setAmount(action.data.amount.toString());
        req.setId(action.data.id);
        req.setInvoiceNumber(action.data.invoiceNumber);
        req.setVendorId(action.data.vendorId);
        req.setNotes(action.data.notes);
        req.setDepartmentId(action.data.departmentId);
        req.setTimestamp(action.data.date);
        req.setFieldMaskList([
          'Amount',
          'InvoiceNumber',
          'VendorId',
          'DepartmentId',
          'Notes',
          'Timestamp',
        ]);
        PendingInvoiceTransactionClientService.Update(req);
      }
      return {
        ...state,
        currentPageEntries: entries,
      };
    }
    case ACTIONS.SET_COLUMNS: {
      return {
        ...state,
        columns: action.data,
      };
    }
    case ACTIONS.SET_LOADED_INIT: {
      return {
        ...state,
        loadedInit: action.data,
      };
    }
    case ACTIONS.SET_CURRENT_TOGGLE: {
      return {
        ...state,
        currentToggle: action.data,
      };
    }
    case ACTIONS.SET_CURRENT_PAGE_ENTRIES: {
      console.log('we got', action.data);
      return {
        ...state,
        currentPageEntries: action.data,
      };
    }
    case ACTIONS.SET_DROP_DOWN_FIELD_LIST: {
      return {
        ...state,
        dropDownFieldList: action.data,
      };
    }
    case ACTIONS.SET_VENDORS: {
      return {
        ...state,
        vendors: action.data,
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
    case ACTIONS.SET_SAVING: {
      return {
        ...state,
        saving: action.data,
      };
    }
    case ACTIONS.SET_PENDING_INVOICE_PAGE: {
      return {
        ...state,
        pendingInvoicePage: action.data,
        currentToggle: 0,
      };
    }
    case ACTIONS.SET_PENDING_INVOICES: {
      return {
        ...state,
        pendingInvoices: action.data,
      };
    }
    case ACTIONS.SET_PENDING_INVOICES_COUNT: {
      return {
        ...state,
        pendingInvoicesCount: action.data,
      };
    }
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        loaded: action.data,
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

export const PendingInvoiceTransactionComponent: FC<Props> = ({
  loggedUserId,
}) => {
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
  const loadInit = useCallback(async () => {
    const vendorReq = new Vendor();
    vendorReq.setIsActive(1);
    const vendors = await VendorClientService.BatchGet(vendorReq);
    dispatch({ type: ACTIONS.SET_VENDORS, data: vendors.getResultsList() });
  }, []);
  const load = useCallback(async () => {
    const req = new PendingInvoiceTransaction();
    req.setIsCommitted(0);
    req.setFieldMaskList(['IsCommitted']);
    req.setIsActive(1);
    req.setPageNumber(state.pendingInvoicePage);
    const results = await PendingInvoiceTransactionClientService.BatchGet(req);
    dispatch({
      type: ACTIONS.SET_PENDING_INVOICES,
      data: results.getResultsList(),
    });
    const mappedEntries = results.getResultsList().map(el => ({
      notes: el.getNotes(),
      invoiceNumber: el.getInvoiceNumber(),
      id: el.getId(),
      vendorId: el.getVendorId(),
      departmentId: el.getDepartmentId(),
      amount: parseFloat(el.getAmount()),
      date: el.getTimestamp(),
      selected: state.currentToggle,
    }));
    dispatch({
      type: ACTIONS.SET_PENDING_INVOICES_COUNT,
      data: results.getTotalCount(),
    });
    dispatch({
      type: ACTIONS.SET_CURRENT_PAGE_ENTRIES,
      data: mappedEntries,
    });

    dispatch({ type: ACTIONS.SET_LOADING, data: false });
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [state.pendingInvoicePage, state.currentToggle]);

  useEffect(() => {
    if (!state.loaded) {
      dispatch({ type: ACTIONS.SET_LOADING, data: true });
      load();
    }
    if (!state.loadedInit) {
      dispatch({ type: ACTIONS.SET_LOADED_INIT, data: true });
      loadInit();
    }
  }, [state.loaded, loadInit, state.loadedInit, load]);

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
  const handleToggleSelectAll = () => {
    let toggleValue = state.currentToggle == 0 ? 1 : 0;
    let entries = state.currentPageEntries;
    for (let i = 0; i < entries.length; i++) {
      entries[i].selected = toggleValue;
    }
    dispatch({ type: ACTIONS.SET_CURRENT_TOGGLE, data: toggleValue });
    dispatch({ type: ACTIONS.SET_CURRENT_PAGE_ENTRIES, data: entries });
  };
  const deleteSelected = async () => {
    let entries = state.currentPageEntries.filter(el => el.selected == 1);

    for (let i = 0; i < entries.length; i++) {
      const req = new PendingInvoiceTransaction();
      req.setId(entries[i].id);
      await PendingInvoiceTransactionClientService.Delete(req);
    }

    dispatch({ type: ACTIONS.SET_LOADED, data: false });
  };
  const handleDeleteSelected = async () => {
    const ok = confirm('Are you sure you want delete the selected records?.');
    if (ok) {
      dispatch({ type: ACTIONS.SET_LOADING, data: true });
      await deleteSelected();
      dispatch({ type: ACTIONS.SET_LOADED, data: false });
    }
  };

  const createSelected = async () => {
    let entries = state.currentPageEntries.filter(el => el.selected == 1);

    for (let i = 0; i < entries.length; i++) {
      //first, update the pending invoice record to be is committed
      const req = new PendingInvoiceTransaction();
      req.setId(entries[i].id);

      req.setIsCommitted(1);
      req.setFieldMaskList(['IsCommitted']);
      await PendingInvoiceTransactionClientService.Update(req);
      //second, create the transaction record
      const entry = entries[i];
      const txn = new Transaction();
      txn.setAmount(entry.amount);
      txn.setVendorCategory('Invoice');
      txn.setDepartmentId(entry.departmentId);
      txn.setTimestamp(entry.date);
      txn.setNotes(entry.notes);
      txn.setOwnerId(loggedUserId);
      txn.setInvoiceNumber(entry.invoiceNumber);
      txn.setOrderNumber(entry.invoiceNumber);
      txn.setStatusId(2);
      if (entry.vendorId != 0) {
        txn.setVendorId(entry.vendorId);
        txn.setVendor(
          state.vendors
            .find(el => el.getId() === entry.vendorId)!
            .getVendorName(),
        );
      }

      await TransactionClientService.Create(txn);
    }

    dispatch({ type: ACTIONS.SET_LOADED, data: false });
  };

  const handleCreateSelected = async () => {
    const ok = confirm(
      'Are you sure you want to commit the selected records to Accounts Payable?.',
    );
    if (ok) {
      dispatch({ type: ACTIONS.SET_LOADING, data: true });
      await createSelected();
      dispatch({ type: ACTIONS.SET_LOADED, data: false });
    }
  };

  const handleSaveNewRecords = useCallback(async () => {
    let data = state.data;
    dispatch({
      type: ACTIONS.SET_SAVING,
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
          dispatch({
            type: ACTIONS.SET_SAVING,
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
            dispatch({
              type: ACTIONS.SET_SAVING,
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
        req.setVendorId(state.formData.selectedVendorId);
        req.setDepartmentId(state.formData.departmentId);
        await PendingInvoiceTransactionClientService.Create(req);
      } else {
        dispatch({
          type: ACTIONS.SET_SAVING,
          data: false,
        });
        dispatch({ type: ACTIONS.SET_LOADING, data: false });

        dispatch({
          type: ACTIONS.SET_ERROR,
          data: 'We detected no fields were selected',
        });
      }
    }
    dispatch({
      type: ACTIONS.SET_SAVING,
      data: false,
    });
    dispatch({ type: ACTIONS.SET_LOADING, data: false });
  }, [
    state.data,
    state.columnDropDownAssignment,
    state.formData.selectedVendorId,
    state.formData.departmentId,
  ]);

  const SCHEMA: Schema<FormData> = [
    [
      {
        name: 'filename',
        label: 'Transaction File',
        type: 'file',
        required: true,
        onFileLoad: handleFileLoad,
      },
      {
        name: 'selectedVendorId',
        label: 'Select Vendor',
        required: true,
        options: state.vendors.map(el => ({
          label: el.getVendorName(),
          value: el.getId(),
        })),
      },
      {
        name: 'departmentId',
        type: 'department',
        label: 'Select Default Department (*optional*)',
      },
    ],
  ] as Schema<FormData>;

  const INVOICE_TRANSACTION: Schema<InvoiceTransaction> = [
    [
      {
        name: 'invoiceNumber',
      },
      {
        name: 'amount',
        type: 'number',
      },
      {
        name: 'date',
        type: 'date',
      },
      {
        name: 'notes',
      },
      {
        name: 'vendorId',

        options: state.vendors.map(el => ({
          label: el.getVendorName(),
          value: el.getId(),
        })),
      },
      {
        name: 'departmentId',
        type: 'department',
      },
      {
        name: 'selected',
        type: 'checkbox',
        label: 'Select',
        defaultValue: state.currentToggle,
      },
      {
        name: 'id',
        type: 'hidden',
      },
    ],
  ] as Schema<InvoiceTransaction>;

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
        fixedActions={true}
        uncollapsable={true}
        loading={state.loading}
      >
        <Tabs
          onChange={idx => {
            idx == 1
              ? dispatch({
                  type: ACTIONS.SET_LOADED,
                  data: false,
                })
              : undefined;
          }}
          tabs={[
            {
              label: 'Invoice Upload',
              content: (
                <div>
                  <SectionBar
                    title="Upload Records"
                    subtitle={`Record Count:${state.recordCount}`}
                    actions={[
                      {
                        label: state.saving
                          ? 'Saving New Records'
                          : 'Save new records',
                        onClick: handleSaveNewRecords,
                        disabled:
                          !state.formData.filename ||
                          !!state.error ||
                          state.formData.selectedVendorId == 0 ||
                          state.saving,
                      },
                    ]}
                    fixedActions
                    loading={state.loading || state.saving}
                  />
                  <PlainForm<FormData>
                    schema={SCHEMA}
                    data={state.formData}
                    onChange={data =>
                      dispatch({ type: ACTIONS.SET_FORM_DATA, data: data })
                    }
                    error={state.error}
                  />
                  {state.columns.length > 0 &&
                  state.columnDropDownAssignment.length > 0 &&
                  state.dropDownFieldList.length > 0 ? (
                    <InfoTable
                      key={'TableAssignemnt'}
                      columns={[
                        { name: 'File Header' },
                        { name: 'Field Select' },
                      ]}
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
                  {state.saving ? <Loader></Loader> : undefined}
                </div>
              ),
            },
            {
              label: 'Transaction Creation',
              content: state.loading ? (
                <Loader />
              ) : (
                <div>
                  <SectionBar
                    pagination={{
                      page: state.pendingInvoicePage,
                      onPageChange: data => {
                        dispatch({
                          type: ACTIONS.SET_PENDING_INVOICE_PAGE,
                          data: data,
                        });

                        dispatch({
                          type: ACTIONS.SET_LOADED,
                          data: false,
                        });
                      },
                      rowsPerPage: 50,
                      count: state.pendingInvoicesCount,
                    }}
                    title="Commit Transactions"
                    subtitle={`Record Count:${state.pendingInvoicesCount}`}
                    actions={[
                      {
                        label: state.currentToggle
                          ? 'Deselect All'
                          : 'Select All',
                        onClick: () => handleToggleSelectAll(),
                      },
                      {
                        label: 'Commit Selected Records',
                        onClick: handleCreateSelected,
                        disabled:
                          state.currentPageEntries.filter(el => el.selected)
                            .length == 0 || !!state.error,
                      },
                      {
                        label: 'Delete Selected Records',
                        onClick: handleDeleteSelected,
                        disabled:
                          state.currentPageEntries.filter(el => el.selected)
                            .length == 0 || !!state.error,
                      },
                    ]}
                    fixedActions
                    loading={!state.loaded}
                  />
                  <InfoTable
                    columns={[
                      { name: 'Invoice Number' },
                      { name: 'Amount' },
                      { name: 'Date' },
                      { name: 'Notes' },
                      { name: 'Vendor' },
                      { name: 'Department' },
                      { name: 'Selected' },
                    ]}
                  />
                  {state.currentPageEntries.map((el, idx) => {
                    const id = el.id;
                    return (
                      <div key={`${el.invoiceNumber}${el.selected}${idx}`}>
                        <PlainForm
                          key={`${el.invoiceNumber}${idx}`}
                          schema={INVOICE_TRANSACTION}
                          onChange={debounce(
                            data =>
                              dispatch({
                                type: ACTIONS.UPDATE_SINGLE_ENTRY,
                                data: data,
                              }),
                            500,
                          )}
                          data={
                            state.currentPageEntries.find(el => el.id == id)!
                          }
                        ></PlainForm>
                      </div>
                    );
                  })}
                </div>
              ),
            },
          ]}
        ></Tabs>
      </SectionBar>
    </div>
  );
};
