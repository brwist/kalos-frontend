import React, { FC, useCallback, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import DeleteIcon from '@material-ui/icons/Delete';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { PlainForm, Schema } from '../ComponentsLibrary/PlainForm';
import { InfoTable, Columns } from '../ComponentsLibrary/InfoTable';
import { makeFakeRows, usd } from '../../helpers';
import { processFile, Data } from './helpers';

type FormData = {
  filename: string;
};

const COLUMNS: Columns = [
  { name: 'Owner' },
  { name: 'Card' },
  { name: 'Date' },
  { name: 'Vendor' },
  { name: 'Vendor Category' },
  { name: 'Amount' },
];

export const CreditTransaction: FC = () => {
  const [formData, setFormData] = useState<FormData>({ filename: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<Data[]>([]);
  const handleFileLoad = useCallback(
    async (file: string, filename: string) => {
      setError('');
      setData([]);
      setLoading(true);
      try {
        const data = await processFile(filename, file);
        setData(data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    },
    [setLoading, setError, setData],
  );
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
      <Alert severity="error">Under construction...</Alert>
      <SectionBar
        title="Credit Transaction"
        actions={[
          {
            label: 'Save new records',
            onClick: handleSaveNewRecords,
            disabled: !formData.filename || !!error,
          },
        ]}
        fixedActions
      />
      <PlainForm<FormData>
        schema={SCHEMA}
        data={formData}
        onChange={setFormData}
        error={error}
      />
      {formData.filename && !error && (
        <InfoTable
          columns={COLUMNS}
          data={
            loading
              ? makeFakeRows(6, 5)
              : data.map(item => {
                  const {
                    amount,
                    name,
                    card,
                    timestamp,
                    vendor,
                    vendor_category,
                  } = item;
                  return [
                    { value: name },
                    { value: card },
                    { value: timestamp },
                    { value: vendor },
                    { value: vendor_category },
                    {
                      value: usd(+amount),
                      actions: [
                        <IconButton key="delete" size="small">
                          <DeleteIcon />
                        </IconButton>,
                      ],
                    },
                  ];
                })
          }
          loading={loading}
        />
      )}
    </div>
  );
};
