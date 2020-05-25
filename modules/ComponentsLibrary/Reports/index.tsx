import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SectionBar } from '../SectionBar';
import { Form } from '../Form';
import { Schema } from '../PlainForm';
import {
  makeOptions,
  makeLast12MonthsOptions,
  getWeekOptions,
  trailingZero,
} from '../../../helpers';
import {
  OPTION_ALL,
  JOB_STATUS_LIST,
  BILLING_STATUS_TYPE_LIST,
  NOTIFICATIONS_STATUS_TYPE_LIST,
  SPIFF_KIND_TYPE_LIST,
} from '../../../constants';

export type FilterForm = {
  status?: string;
  startDate?: string;
  endDate?: string;
  week?: string;
  month?: string;
  monthlyWeekly?: string;
  users?: string[];
  blank?: string;
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'grid',
    alignItems: 'flex-start',
    gridGap: theme.spacing(),
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: theme.spacing(2),
    },
  },
}));

const WEEK_OPTIONS = getWeekOptions(52, -31).reverse();
const LAST_12_MONTHS_0 = makeLast12MonthsOptions(false);
const LAST_12_MONTHS_1 = makeLast12MonthsOptions(false, -1);

const SCHEMA_DATES_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
];

const SCHEMA_JOB_STATUS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'status',
      label: 'Status',
      required: true,
      options: makeOptions(JOB_STATUS_LIST, true),
    },
  ],
  [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
];

const SCHEMA_BILLING_STATUS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'status',
      label: 'Status',
      required: true,
      options: makeOptions(BILLING_STATUS_TYPE_LIST, true),
    },
  ],
  [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
];

const SCHEMA_NOTIFICATIONS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'status',
      label: 'Status',
      required: true,
      options: makeOptions(NOTIFICATIONS_STATUS_TYPE_LIST, true),
    },
  ],
  [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
];

const SCHEMA_SERVICE_CALL_METRICS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'week',
      label: 'Select Week',
      options: WEEK_OPTIONS,
      required: true,
    },
  ],
];

const SCHEMA_SPIFF_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'month',
      label: 'Select Report Date',
      options: LAST_12_MONTHS_1,
      required: true,
    },
  ],
  [
    {
      name: 'monthlyWeekly',
      label: 'Type',
      required: true,
      options: makeOptions(SPIFF_KIND_TYPE_LIST),
    },
  ],
  [
    {
      name: 'users',
      label: 'Select Users',
      type: 'technician',
      required: true,
    },
  ],
];

const SCHEMA_TRAINING_METRICS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'users',
      label: 'Select Users',
      type: 'technician',
      required: true,
    },
  ],
];

const SCHEMA_CHARITY_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'month',
      label: 'Month',
      options: LAST_12_MONTHS_0,
      required: true,
    },
  ],
];

const SCHEMA_LAST_12_MONTHS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'month',
      label: 'Month',
      options: LAST_12_MONTHS_1,
      required: true,
    },
  ],
];

export const Reports: FC = () => {
  const classes = useStyles();
  const d = new Date();
  const [jobStatusReport, setJobStatusReport] = useState<FilterForm>({
    status: OPTION_ALL,
  });
  const [billingStatusReport, setBillingStatusReport] = useState<FilterForm>({
    status: OPTION_ALL,
  });
  const [notificationsReport, setNotificationsReport] = useState<FilterForm>({
    status: OPTION_ALL,
  });
  const [performanceMetricsReport, setPerformanceMetricsReport] = useState<
    FilterForm
  >({});
  const [deletedServiceCallsReport, setDeletedServiceCallsReport] = useState<
    FilterForm
  >({});
  const [callbackReport, setCallbackReport] = useState<FilterForm>({});
  const [serviceCallMetricsReport, setServiceCallMetricsReport] = useState<
    FilterForm
  >({
    week: `${d.getFullYear()}-${trailingZero(d.getMonth() + 1)}-${trailingZero(
      d.getDate() - d.getDay(),
    )}`,
  });
  const [spiffReport, setSpiffReport] = useState<FilterForm>({
    month: LAST_12_MONTHS_1[0].value,
    monthlyWeekly: 'Monthly',
    users: [],
  });
  const [trainingMetricsReport, setTrainingMetricsReport] = useState<
    FilterForm
  >({});
  const [charityReport, setCharityReport] = useState<FilterForm>({
    month: LAST_12_MONTHS_0[0].value,
  });
  const [billingAuditReport, setBillingAuditReport] = useState<FilterForm>({
    month: LAST_12_MONTHS_1[0].value,
  });
  const [promptPaymentReport, setPromptPaymentReport] = useState<FilterForm>({
    month: LAST_12_MONTHS_1[0].value,
  });
  return (
    <div className={classes.wrapper}>
      <Form
        title="Job Status Report"
        schema={SCHEMA_JOB_STATUS_REPORT}
        data={jobStatusReport}
        onSave={setJobStatusReport}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Billing Status Report"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={billingStatusReport}
        onSave={setBillingStatusReport}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Notifications Report"
        schema={SCHEMA_NOTIFICATIONS_REPORT}
        data={notificationsReport}
        onSave={setNotificationsReport}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Performance Metrics"
        schema={SCHEMA_DATES_REPORT}
        data={performanceMetricsReport}
        onSave={setPerformanceMetricsReport}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Deleted Service Calls"
        schema={SCHEMA_DATES_REPORT}
        data={deletedServiceCallsReport}
        onSave={setDeletedServiceCallsReport}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Callback Report"
        schema={SCHEMA_DATES_REPORT}
        data={callbackReport}
        onSave={setCallbackReport}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Service Call Metrics"
        schema={SCHEMA_SERVICE_CALL_METRICS_REPORT}
        data={serviceCallMetricsReport}
        onSave={setServiceCallMetricsReport}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Stiff Report"
        schema={SCHEMA_SPIFF_REPORT}
        data={spiffReport}
        onSave={setSpiffReport}
        submitLabel="Report"
        onClose={null}
      />
      <SectionBar
        title="Finalize Approved Spiffs"
        subtitle="Mark all pending Spiffs that are approved as closed out and ready to pay."
        actions={[
          {
            label: 'Report',
          },
        ]}
        fixedActions
      />
      <SectionBar
        title="Service Call Zip Code"
        actions={[
          {
            label: 'Report',
          },
        ]}
        fixedActions
      />
      <SectionBar
        title="Warranty Report"
        actions={[
          {
            label: 'Report',
          },
        ]}
        fixedActions
      />
      <Form
        title="Training Metrics"
        schema={SCHEMA_TRAINING_METRICS_REPORT}
        data={trainingMetricsReport}
        onSave={setTrainingMetricsReport}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Charity Report"
        schema={SCHEMA_CHARITY_REPORT}
        data={charityReport}
        onSave={setCharityReport}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Billing Audit"
        schema={SCHEMA_LAST_12_MONTHS_REPORT}
        data={billingAuditReport}
        onSave={setBillingAuditReport}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Prompt Payment Report"
        schema={SCHEMA_LAST_12_MONTHS_REPORT}
        data={promptPaymentReport}
        onSave={setPromptPaymentReport}
        submitLabel="Report"
        onClose={null}
      />
      <SectionBar
        title="Timeoff Summary"
        actions={[
          {
            label: 'Report',
          },
        ]}
        fixedActions
      />
    </div>
  );
};
