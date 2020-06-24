import React, { FC, useState, useCallback } from 'react';
import Alert from '@material-ui/lab/Alert';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema } from '../PlainForm';
import { InfoTable, Data } from '../InfoTable';
import { loadGovPerDiemByZipCode, usd, makeFakeRows } from '../../../helpers';

interface Props {
  onClose?: () => void;
}

type Form = {
  zip: number;
  year: number;
};

const currMonth = +new Date().toISOString().split('-')[1];
const currYear = +new Date().toISOString().split('-')[0];
const initialLodging = {
  state: '',
  city: '',
  county: '',
  month: [],
};

export const LodgingByZipCode: FC<Props> = ({ onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [form, setForm] = useState<Form>({ zip: 0, year: currYear });
  const [lodging, setLodging] = useState<{
    state: string;
    city: string;
    county: string;
    month: {
      value: number;
      number: number;
      long: string;
    }[];
  }>(initialLodging);
  const handleCheckLodging = useCallback(async () => {
    setError(false);
    setLoading(true);
    setInitialized(true);
    const lodging = await loadGovPerDiemByZipCode(form.zip, form.year);
    if (lodging) {
      setLodging(lodging);
    } else {
      setLodging(initialLodging);
      setError(true);
    }
    setLoading(false);
  }, [form, setLodging, setLoading, setInitialized]);
  const handleChangeForm = useCallback(
    (form: Form) => {
      setForm(form);
      if (error) {
        setError(false);
        setInitialized(false);
      }
    },
    [setForm, setError, error, setInitialized],
  );
  const SCHEMA: Schema<Form> = [
    [
      {
        name: 'zip',
        label: 'Zip Code',
        type: 'number',
      },
      {
        name: 'year',
        label: 'Year',
        options: [...Array(11)].map((_, idx) => ({
          label: (currYear - idx).toString(),
          value: currYear - idx,
        })),
        actions: [
          {
            label: 'Check Lodging',
            onClick: handleCheckLodging,
          },
        ],
      },
    ],
  ];
  const data = loading
    ? makeFakeRows(2, 12)
    : lodging.month.map(({ long, number, value }) => [
        {
          value:
            number === currMonth ? (
              <strong>
                <big>{long}</big>
              </strong>
            ) : (
              long
            ),
        },
        {
          value:
            number === currMonth ? (
              <strong>
                <big>{usd(value)}</big>
              </strong>
            ) : (
              usd(value)
            ),
        },
      ]);
  return (
    <div>
      <SectionBar
        title="Check Lodging by Zip Code"
        actions={onClose ? [{ label: 'Close', onClick: onClose }] : undefined}
        fixedActions
      />
      <PlainForm schema={SCHEMA} data={form} onChange={handleChangeForm} />
      {initialized && !error && (
        <>
          <SectionBar
            title={loading ? 'Loading...' : `${lodging.city}, ${lodging.state}`}
            subtitle={loading ? '' : lodging.county}
          />
          <InfoTable
            columns={[{ name: 'Month' }, { name: 'Lodging' }]}
            data={data}
            loading={loading}
          />
        </>
      )}
      {error && (
        <Alert severity="error">
          Cannot find lodging data for zip code {form.zip} and year {form.year}.
        </Alert>
      )}
    </div>
  );
};
