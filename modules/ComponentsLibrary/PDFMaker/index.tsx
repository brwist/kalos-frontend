import React, { FC, useState, useCallback, useReducer } from 'react';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { PrintPage } from '../PrintPage';
import { PrintParagraph } from '../PrintParagraph';
import { PrintTable } from '../PrintTable';
import { Button } from '../Button';
import { timestamp } from '../../../helpers';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';

interface Props {
  dateStr: string;
  name: string;
  title: string;
  amount: string | number;
  vendor?: string;
  icon?: React.ReactNode;
  iconLabel?: string;
  jobNumber?: string;
  onCreate?(file: Uint8Array): void;
  confirmText?: string;
  pdfType: PDFList;
}

type PDFList =
  | 'Missing Receipt'
  | 'Missing Receipt Manager'
  | 'Retrievable Receipt'
  | 'Approved Proposal'
  | 'Pending Proposal';

type FormData = {
  vendor: string;
  purpose: string;
};
type Signature = {
  signature: string;
};
export type State = {
  opened: boolean;
  generateFile: boolean;
  signature: string;
  vendor: string;
  purpose: string;
};

export enum ACTIONS {
  SET_OPENED = 'setOpened',
  SET_GENERATE_FILE = 'setGenerateFile',
  RESET_FORM = 'resetForm',
  SET_SIGNATURE = 'setSignature',
  SET_VENDOR = 'setVendor',
  SET_PURPOSE = 'setPurpose',
}

export type Action =
  | { type: ACTIONS.SET_OPENED; data: boolean }
  | { type: ACTIONS.SET_GENERATE_FILE; data: boolean }
  | { type: ACTIONS.RESET_FORM }
  | { type: ACTIONS.SET_SIGNATURE; data: string }
  | { type: ACTIONS.SET_PURPOSE; data: string }
  | { type: ACTIONS.SET_VENDOR; data: string };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_OPENED: {
      return {
        ...state,
        opened: action.data,
      };
    }
    case ACTIONS.SET_GENERATE_FILE: {
      return {
        ...state,
        generateFile: action.data,
      };
    }
    case ACTIONS.SET_SIGNATURE: {
      return {
        ...state,
        signature: action.data,
      };
    }
    case ACTIONS.SET_PURPOSE: {
      return {
        ...state,
        purpose: action.data,
      };
    }
    case ACTIONS.SET_VENDOR: {
      return {
        ...state,
        vendor: action.data,
      };
    }
    case ACTIONS.RESET_FORM: {
      return {
        ...state,
        signature: '',
        vendor: state.vendor,
        purpose: '',
      };
    }
    default:
      return state;
  }
};

const receiptAffadavitTitle = 'KALOS MISSING RECEIPT AFFADAVIT';
const retrievableAffadavitTitle = 'KALOS RETRIEVABLE RECEIPT AFFADAVIT';
const receiptAffadavitLegal = `By signing this document I attest that I made this purchase and this
transaction is a legitimate business transaction for Kalos business
as stated and was unintentionally and irretrievably lost. I
understand that the business credit card is only for legitimate
expenses incurred to accomplish the business of Kalos Services Inc.`;

const receiptAffadavitLegalManager = `By signing this document I attest that this
transaction is a legitimate business transaction for Kalos business
as stated and was unintentionally and irretrievably lost.`;

const retrievableAffadavitLegal = `By signing this document I attest that I made this purchase and this
transaction is a legitimate business Transaction for Kalos business
as stated, can be retrieved from the vendor immediately upon
request, and is therefore compliant with IRS record keeping
requirements. I understand that the business credit card is only for
legitimate expenses incurred to accomplish the business of Kalos
Services Inc.`;

export const PDFMaker: FC<Props> = ({
  dateStr,
  name,
  title,
  amount,
  vendor = '',
  pdfType,
  confirmText,
  icon,
  iconLabel,
  jobNumber,
  onCreate,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    opened: false,
    generateFile: false,
    signature: '',
    purpose: '',
    vendor: vendor,
  });

  const toggleOpened = useCallback(
    () => dispatch({ type: ACTIONS.SET_OPENED, data: !state.opened }),
    [state.opened],
  );

  const handleSave = useCallback(() => {
    if (
      state.signature === '' &&
      !confirm(
        'Your PDF will be created without a signature, which will most likely lead to it being rejected. Continue?',
      )
    )
      return;
    dispatch({ type: ACTIONS.SET_GENERATE_FILE, data: true });
    dispatch({ type: ACTIONS.SET_OPENED, data: false });
  }, [state.signature]);

  const handleFileCreated = useCallback(
    (file: Uint8Array) => {
      console.log('file created');
      dispatch({ type: ACTIONS.SET_GENERATE_FILE, data: false });
      dispatch({ type: ACTIONS.RESET_FORM });
      if (onCreate) {
        onCreate(file);
      }
    },
    [onCreate],
  );
  const handleSetFormSignature = useCallback((signature: string) => {
    dispatch({ type: ACTIONS.SET_SIGNATURE, data: signature });
  }, []);
  const handleSetFormVendor = useCallback((vendor: string) => {
    dispatch({ type: ACTIONS.SET_VENDOR, data: vendor });
  }, []);
  const handleSetPurpose = useCallback((purpose: string) => {
    dispatch({ type: ACTIONS.SET_PURPOSE, data: purpose });
  }, []);
  const SCHEMA: Schema<FormData> = [
    [
      {
        name: 'vendor',
        label: 'Vendor',
        onChange: value => handleSetFormVendor(value as string),
      },
    ],
    [
      {
        name: 'purpose',
        label: 'Purpose of Transaction',
        onChange: value => handleSetPurpose(value as string),
      },
    ],
  ];
  const SCHEMA_SIGNATURE: Schema<Signature> = [
    [
      {
        name: 'signature',
        label: 'Sign Below',
        type: 'signature',
        onChange: value => handleSetFormSignature(value as string),
      },
    ],
  ];
  return (
    <>
      {icon ? (
        <Tooltip title={iconLabel ? iconLabel : 'Generate PDF'}>
          <IconButton size="small" onClick={toggleOpened}>
            {icon}
          </IconButton>
        </Tooltip>
      ) : (
        <Button onClick={toggleOpened} label={title} />
      )}

      {state.opened && (
        <Modal open onClose={toggleOpened}>
          <div style={{ width: 300 }}>
            <Form
              title={title}
              schema={SCHEMA}
              data={{
                vendor: state.vendor,
                purpose: state.purpose,
              }}
              onSave={handleSave}
              onClose={toggleOpened}
              submitLabel={confirmText || 'Create PDF'}
            />

            <Form
              schema={SCHEMA_SIGNATURE}
              data={{
                signature: state.signature,
              }}
              onClose={console.log}
              onSave={console.log}
            />
          </div>
        </Modal>
      )}
      {state.generateFile && (
        <PrintPage
          onFileCreated={handleFileCreated}
          downloadPdfFilename={`${title}_${timestamp()}`}
        >
          <PrintParagraph tag="h1" align="center" style={{ fontSize: 30 }}>
            {pdfType === 'Missing Receipt' ||
            pdfType == 'Missing Receipt Manager'
              ? receiptAffadavitTitle
              : retrievableAffadavitTitle}
          </PrintParagraph>
          <PrintTable
            columns={[{ title: '', widthPercentage: 50, align: 'left' }, '']}
            data={[
              [
                <PrintParagraph tag="h2" key={0}>
                  <u>PURCHASE DATE:</u> {dateStr}
                </PrintParagraph>,
                <PrintParagraph tag="h2" key={1}>
                  <u>EMPLOYEE NAME:</u> {name}
                </PrintParagraph>,
              ],
            ]}
            noBorders
            styles={{ fontSize: 'medium' }}
          />
          <PrintTable
            columns={['']}
            data={[
              [
                <PrintParagraph tag="h2" key={0}>
                  <u>PURCHASED FROM (VENDOR):</u> {state.vendor}
                </PrintParagraph>,
              ],
            ]}
            noBorders
            styles={{ fontSize: 'medium' }}
          />
          <PrintTable
            columns={[{ title: '', widthPercentage: 50, align: 'left' }, '']}
            data={[
              [
                <PrintParagraph tag="h2" key={0}>
                  <u>AMOUNT:</u> {amount}
                </PrintParagraph>,
                jobNumber ? (
                  <PrintParagraph tag="h2" key={1}>
                    <u>JOB #:</u> {jobNumber}
                  </PrintParagraph>
                ) : (
                  ''
                ),
              ],
            ]}
            noBorders
            styles={{ fontSize: 'medium' }}
          />
          <PrintTable
            columns={['']}
            data={[
              [
                <PrintParagraph tag="h2" key={0}>
                  <u>PURPOSE OF TRANSACTION:</u> {state.purpose}
                </PrintParagraph>,
              ],
            ]}
            noBorders
            styles={{ fontSize: 'medium' }}
          />
          <PrintParagraph>
            {pdfType === 'Missing Receipt Manager'
              ? receiptAffadavitLegalManager
              : pdfType === 'Missing Receipt'
              ? receiptAffadavitLegal
              : retrievableAffadavitLegal}
          </PrintParagraph>
          <PrintParagraph tag="h2">SIGNATURE:</PrintParagraph>
          <img
            src={state.signature}
            style={{
              width: '100%',
              height: 'auto',
              borderBottomWidth: 2,
              borderBottomColor: '#000',
              borderBottomStyle: 'solid',
            }}
          />
        </PrintPage>
      )}
    </>
  );
};
