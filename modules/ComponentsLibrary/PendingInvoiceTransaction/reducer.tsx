import React, { FC, useCallback, useState, useReducer, useEffect } from 'react';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema } from '../PlainForm';
import { InfoTable, Columns } from '../InfoTable';
import { PendingInvoiceTransaction } from '../../../@kalos-core/kalos-rpc/compiled-protos/pending_invoice_transaction_pb';
import parse from 'papaparse/';
import {
  PendingInvoiceTransactionClientService,
  VendorClientService,
  TransactionClientService,
} from '../../../helpers';

import { Transaction } from '../../../@kalos-core/kalos-rpc/Transaction';
import { parseISO, format, parse as dateParse } from 'date-fns';
import { Vendor, VendorClient } from '../../../@kalos-core/kalos-rpc/Vendor';
import { Select, MenuItem } from '@material-ui/core/';
import { Loader } from '../../Loader/main';
import { Tabs } from '../Tabs';
import { debounce } from 'lodash/';
export type FormData = {
  filename: string;
  selectedVendorId: number;
  departmentId: number;
};
export type Field = {
  label: string;
  value: number;
};
export type Assignment = {
  dropDownValue: number;
  columnIndex: number;
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
  vendors: Vendor[];
  loadedInit: boolean;
  recordCount: number;
  loading: boolean;
  error: string;
  pendingInvoicePage: number;
  data: string[][];
};
export type InvoiceTransaction = {
  amount: number;
  invoiceNumber: string;
  date: string;
  notes: string;
  vendorId: number;
  departmentId: number;
  selected: number;
  id: number;
  jobNumber: number;
  duplicateFlag: boolean;
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
  SET_VENDORS = 'setVendors',
  SET_ON_FILE_LOAD_DATA = 'setOnFileLoadData',
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
  | { type: ACTIONS.UPDATE_SINGLE_ENTRY; data: InvoiceTransaction }
  | { type: ACTIONS.SET_CURRENT_TOGGLE; data: number }
  | { type: ACTIONS.SET_CURRENT_PAGE_ENTRIES; data: InvoiceTransaction[] }
  | { type: ACTIONS.SET_PENDING_INVOICES; data: PendingInvoiceTransaction[] }
  | { type: ACTIONS.SET_PENDING_INVOICES_COUNT; data: number }
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_LOADED_INIT; data: boolean }
  | { type: ACTIONS.SET_ERROR; data: string }
  | {
      type: ACTIONS.SET_ON_FILE_LOAD_DATA;
      data: {
        columns: Columns;
        formData: FormData;
        recordCount: number;
        assignment: Assignment[];
        loading: boolean;
        data: string[][];
      };
    }
  | { type: ACTIONS.SET_DATA; data: string[][] };
