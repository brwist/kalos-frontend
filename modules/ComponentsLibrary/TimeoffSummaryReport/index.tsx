import React, { FC, useCallback, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { PlainForm, Schema } from '../PlainForm';
import { loadTimeoffSummaryReport, formatDate } from '../../../helpers';

interface Props {
  onClose?: () => void;
}

type FilterForm = {
  year: number;
  employeeName: string;
};

export const TimeoffSummaryReport: FC<Props> = ({ onClose }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState<FilterForm>({
    year: new Date().getFullYear(),
    employeeName: '',
  });
  const [formKey, setFormKey] = useState<number>(0);
  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadTimeoffSummaryReport(form.year);
    setData(data);
    setLoading(false);
  }, [setLoading, setData, form]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const { year, employeeName } = form;
  const handleYearChange = useCallback(
    (step: number) => () => {
      setForm({ employeeName: '', year: year + step });
      setFormKey(formKey + 1);
      setLoaded(false);
    },
    [setForm, formKey, setFormKey, year],
  );
  const SCHEMA: Schema<FilterForm> = [
    [
      {
        name: 'employeeName',
        label: 'Employee',
        type: 'search',
      },
      {
        name: 'year',
        label: 'Year',
        readOnly: true,
        startAdornment: (
          <IconButton size="small" onClick={handleYearChange(-1)}>
            <ChevronLeftIcon />
          </IconButton>
        ),
        endAdornment: (
          <IconButton size="small" onClick={handleYearChange(1)}>
            <ChevronRightIcon />
          </IconButton>
        ),
      },
    ],
  ];
  const employeeNamePhrase = employeeName.toLowerCase();
  const filteredData = data.filter(({ employeeName }) =>
    employeeName.toLowerCase().includes(employeeNamePhrase),
  );
  return (
    <div>
      <SectionBar
        title={`Timeoff Summary Report for ${year}`}
        asideContent={
          <>
            <PrintPage
              headerProps={{
                title: `Timeoff Summary Report for ${year}`,
                subtitle: employeeName ? (
                  <div>
                    <strong>Employee Name includes: </strong> {employeeName}
                  </div>
                ) : null,
              }}
              buttonProps={{
                label: 'Print',
                disabled: loading,
              }}
            >
              {!loading && (
                <>
                  <PrintTable
                    columns={[
                      'Employee',
                      { title: 'Hire Date', align: 'right' },
                      { title: 'Annual PTO Allowance', align: 'right' },
                      { title: 'PTO', align: 'right' },
                      { title: 'Discretionary', align: 'right' },
                      { title: 'Mandatory', align: 'right' },
                    ]}
                    data={filteredData.map(
                      ({
                        employeeName,
                        hireDate,
                        annualPtoAllowance,
                        pto,
                        discretionary,
                        mandatory,
                      }) => [
                        employeeName,
                        formatDate(hireDate),
                        annualPtoAllowance.toFixed(2),
                        pto.toFixed(2),
                        discretionary.toFixed(2),
                        mandatory.toFixed(2),
                      ],
                    )}
                  />
                </>
              )}
            </PrintPage>
            {onClose && <Button label="Close" onClick={onClose} />}
          </>
        }
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          <PlainForm
            key={formKey}
            schema={SCHEMA}
            data={form}
            onChange={setForm}
          />
          <InfoTable
            columns={[
              { name: 'Employee' },
              { name: 'Hire Date' },
              { name: 'Annual PTO Allowance' },
              { name: 'PTO' },
              { name: 'Discretionary' },
              { name: 'Mandatory' },
            ]}
            data={filteredData.map(
              ({
                employeeName,
                hireDate,
                annualPtoAllowance,
                pto,
                discretionary,
                mandatory,
              }) => [
                { value: employeeName },
                { value: formatDate(hireDate) },
                {
                  value: (
                    <span
                      style={pto > annualPtoAllowance ? { color: 'red' } : {}}
                    >
                      {annualPtoAllowance.toFixed(2)}
                    </span>
                  ),
                },
                { value: pto.toFixed(2) },
                { value: discretionary.toFixed(2) },
                { value: mandatory.toFixed(2) },
              ],
            )}
          />
        </>
      )}
    </div>
  );
};
