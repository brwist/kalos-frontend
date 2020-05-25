import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SectionBar } from '../SectionBar';
import { Form } from '../Form';
import { Schema } from '../PlainForm';

type FilterForm = {
  status: number;
  startDate: string;
  endDate: string;
  week: string;
  month: string;
  monthlyWeekly: string;
  users: string[];
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

const SCHEMA_JOB_STATUS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'status',
      label: 'Job Status',
      required: true,
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
      label: 'Job Status',
      required: true,
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

const SCHEMA_PERFORMANCE_METRICS_REPORT: Schema<FilterForm> = [
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

export const Reports: FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Form
        title="Job Status Report"
        schema={SCHEMA_JOB_STATUS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Billing Status Report"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Notifications Report"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Performance Metrics"
        schema={SCHEMA_PERFORMANCE_METRICS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Deleted Service Calls"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Callback Report"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Service Call Metrics"
        schema={SCHEMA_PERFORMANCE_METRICS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Stiff Report"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
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
      />
      <SectionBar
        title="Service Call Zip Code"
        actions={[
          {
            label: 'Report',
          },
        ]}
      />
      <SectionBar
        title="Warranty Report"
        actions={[
          {
            label: 'Report',
          },
        ]}
      />
      <Form
        title="Training Metrics"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Charity Report"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Billing Audit"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Prompt Payment Report"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={{} as FilterForm}
        onSave={() => {}}
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
      />
    </div>
  );
};
