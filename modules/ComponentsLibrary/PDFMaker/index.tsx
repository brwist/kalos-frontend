import React, { FC, useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { PrintPage } from '../PrintPage';
import { PrintParagraph } from '../PrintParagraph';
import { PrintTable } from '../PrintTable';

interface Props {
  dateStr: string;
  name: string;
  title: string;
  amount: string | number;
  vendor?: string;
  icon?: React.ReactNode;
  jobNumber?: string;
  onCreate?(file: Uint8Array): void;
  confirmText?: string;
  pdfType: PDFList;
}

type PDFList =
  | 'Missing Receipt'
  | 'Retrievable Receipt'
  | 'Approved Proposal'
  | 'Pending Proposal';

type FormData = {
  vendor: string;
  purpose: string;
  signature: string;
};

const receiptAffadavitTitle = 'KALOS MISSING RECEIPT AFFADAVIT';
const retrievableAffadavitTitle = 'KALOS RETRIEVABLE RECEIPT AFFADAVIT';
const receiptAffadavitLegal = `By signing this document I attest that I made this purchase and this
transaction is a legitimate business transaction for Kalos business
as stated and was unintentionally and un‐retrievably lost. I
understand that the business credit card is only for legitimate
expenses incurred to accomplish the business of Kalos Services Inc.`;
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
  jobNumber,
  onCreate,
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>();
  const toggleOpened = useCallback(() => setOpened(!opened), [
    setOpened,
    opened,
  ]);
  const handleSave = useCallback(
    (data: FormData) => {
      if (
        data.signature === '' &&
        !confirm(
          'Your PDF will be created without a signature, which will most likely lead to it being rejected. Continue?',
        )
      )
        return;
      setOpened(false);
      setFormData(data);
    },
    [setFormData, setOpened],
  );
  const handleFileCreated = useCallback(
    (file: Uint8Array) => {
      setFormData(undefined);
      if (onCreate) {
        onCreate(file);
      }
    },
    [onCreate, setFormData],
  );
  const SCHEMA: Schema<FormData> = [
    [
      {
        name: 'vendor',
        label: 'Vendor',
      },
    ],
    [
      {
        name: 'purpose',
        label: 'Purpose of Transaction',
      },
    ],
    [
      {
        name: 'signature',
        label: 'Sign Below',
        type: 'signature',
      },
    ],
  ];
  const data: FormData = {
    vendor,
    purpose: '',
    signature: '',
  };
  return (
    <>
      <Button
        onClick={toggleOpened}
        size="large"
        fullWidth
        style={{ height: 44, marginBottom: 10 }}
        startIcon={icon}
      >
        {title}
      </Button>
      {opened && (
        <Modal open onClose={toggleOpened}>
          <div style={{ width: 300 }}>
            <Form
              title={title}
              schema={SCHEMA}
              data={data}
              onClose={toggleOpened}
              onSave={handleSave}
              submitLabel={confirmText || 'Create PDF'}
            />
          </div>
        </Modal>
      )}
      {formData && (
        <PrintPage onFileCreated={handleFileCreated}>
          <PrintParagraph tag="h1" align="center" style={{ fontSize: 30 }}>
            {pdfType === 'Missing Receipt'
              ? receiptAffadavitTitle
              : retrievableAffadavitTitle}
          </PrintParagraph>
          <PrintTable
            columns={[{ title: '', widthPercentage: 50, align: 'left' }, '']}
            data={[
              [
                <PrintParagraph tag="h2">
                  <u>PURCHASE DATE:</u> {dateStr}
                </PrintParagraph>,
                <PrintParagraph tag="h2">
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
                <PrintParagraph tag="h2">
                  <u>PURCHASED FROM (VENDOR):</u> {formData.vendor}
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
                <PrintParagraph tag="h2">
                  <u>AMOUNT:</u> {amount}
                </PrintParagraph>,
                jobNumber ? (
                  <PrintParagraph tag="h2">
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
                <PrintParagraph tag="h2">
                  <u>PURPOSE OF TRANSACTION:</u> {formData.purpose}
                </PrintParagraph>,
              ],
            ]}
            noBorders
            styles={{ fontSize: 'medium' }}
          />
          <PrintParagraph>
            {pdfType === 'Missing Receipt'
              ? receiptAffadavitLegal
              : retrievableAffadavitLegal}
          </PrintParagraph>
          <PrintParagraph tag="h2">SIGNATURE:</PrintParagraph>
          <img
            src={formData.signature}
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
