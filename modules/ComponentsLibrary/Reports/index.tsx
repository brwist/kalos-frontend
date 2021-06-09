import React, { FC, useState, useCallback } from 'react';
import { SectionBar } from '../SectionBar';
import { Form } from '../Form';
import { Schema } from '../PlainForm';
import { Modal } from '../Modal';
import { EventsReport } from '../EventsReport';
import { ActivityLogReport } from '../ActivityLogReport';
import { PerformanceMetrics } from '../PerformanceMetrics';
import { DeletedServiceCallsReport } from '../DeletedServiceCallsReport';
import { CallbackReport } from '../CallbackReport';
import { ServiceCallMetrics } from '../ServiceCallMetrics';
import { SpiffReport } from '../SpiffReport';
import { CharityReport } from '../CharityReport';
import { WarrantyReport } from '../WarrantyReport';
import { PromptPaymentReport } from '../PromptPaymentReport';
import { TimeoffSummaryReport } from '../TimeoffSummaryReport';
import { BillingAuditReport } from '../BillingAuditReport';
import { format, parseISO } from 'date-fns';

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
import './styles.less';
import { EditProject } from '../EditProject';
import { CostReport } from '../CostReport';

export type FilterForm = {
  status?: string;
  startDate?: string;
  endDate?: string;
  week?: string;
  month?: string;
  monthlyWeekly?: string;
  users?: string;
  blank?: string;
};

type JobReportForm = {
  jobNumber: number;
};

export interface Props {
  loggedUserId: number;
}

const DATES_ERROR = (
  <>
    <strong>Start Date</strong> should be before <strong>End Date</strong>.
  </>
);

const UNDER_CONSTRUCTION = (
  <div style={{ padding: 10, fontFamily: 'arial' }}>Under construction...</div>
);

const WEEK_OPTIONS_0 = getWeekOptions(52, -31).reverse();
const WEEK_OPTIONS_1 = getWeekOptions(52);

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
      options: WEEK_OPTIONS_0,
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
      type: 'technicians',
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

const getCurrWeek = () => {
  const d = parseISO(format(new Date(), 'yyyy-MM-dd'));
  return `${d.getFullYear()}-${trailingZero(d.getMonth() + 1)}-${trailingZero(
    d.getDate() - d.getDay(),
  )}`;
};
export const Reports: FC<Props> = ({ loggedUserId }) => {
  const [jobStatusReport, setJobStatusReport] = useState<FilterForm>({
    status: OPTION_ALL,
  });
  const [jobStatusDatesError, setJobStatusDatesError] =
    useState<boolean>(false);
  const [jobStatusReportOpen, setJobStatusReportOpen] =
    useState<boolean>(false);
  const [billingStatusReport, setBillingStatusReport] = useState<FilterForm>({
    status: OPTION_ALL,
  });
  const [billingStatusDatesError, setBillingStatusDatesError] =
    useState<boolean>(false);
  const [billingStatusReportOpen, setBillingStatusReportOpen] =
    useState<boolean>(false);
  const [notificationsReport, setNotificationsReport] = useState<FilterForm>({
    status: OPTION_ALL,
  });
  const [notificationsDatesError, setNotificationsDatesError] =
    useState<boolean>(false);
  const [notificationsReportOpen, setNotificationsReportOpen] =
    useState<boolean>(false);
  const [performanceMetricsReport, setPerformanceMetricsReport] =
    useState<FilterForm>({});
  const [performanceMetricsDatesError, setPerformanceMetricsDatesError] =
    useState<boolean>(false);
  const [performanceMetricsReportOpen, setPerformanceMetricsReportOpen] =
    useState<boolean>(false);
  const [deletedServiceCallsReport, setDeletedServiceCallsReport] =
    useState<FilterForm>({});
  const [deletedServiceCallsDatesError, setDeletedServiceCallsDatesError] =
    useState<boolean>(false);
  const [deletedServiceCallsReportOpen, setDeletedServiceCallsReportOpen] =
    useState<boolean>(false);
  const [callbackReport, setCallbackReport] = useState<FilterForm>({});
  const [callbackDatesError, setCallbackDatesError] = useState<boolean>(false);
  const [callbackReportOpen, setCallbackReportOpen] = useState<boolean>(false);
  const [serviceCallMetricsReport, setServiceCallMetricsReport] =
    useState<FilterForm>({
      week: getCurrWeek(),
    });

  const [serviceCallMetricsReportOpen, setServiceCallMetricsReportOpen] =
    useState<boolean>(false);
  const [spiffReport, setSpiffReport] = useState<FilterForm>({
    month: LAST_12_MONTHS_1[0].value,
    monthlyWeekly: 'Monthly',
    users: '',
  });
  const [spiffReportKey, setSpiffReportKey] = useState<number>(0);
  const [spiffReportOpen, setSpiffReportOpen] = useState<boolean>(false);
  const [finalizeApprovedSpiffsOpen, setFinalizeApprovedSpiffsOpen] =
    useState<boolean>(false);
  const [serviceCallZipCodeReportOpen, setServiceCallZipCodeReportOpen] =
    useState<boolean>(false);
  const [warrantyReportOpen, setWarrantyReportOpen] = useState<boolean>(false);
  const [trainingMetricsReport, setTrainingMetricsReport] =
    useState<FilterForm>({});
  const [trainingMetricsDatesError, setTrainingMetricsDatesError] =
    useState<boolean>(false);
  const [trainingMetricsReportOpen, setTrainingMetricsReportOpen] =
    useState<boolean>(false);
  const [charityReport, setCharityReport] = useState<FilterForm>({
    month: LAST_12_MONTHS_0[0].value,
  });
  const [charityReportOpen, setCharityReportOpen] = useState<boolean>(false);
  const [billingAuditReport, setBillingAuditReport] = useState<FilterForm>({
    month: LAST_12_MONTHS_1[0].value,
  });
  const [billingAuditReportOpen, setBillingAuditReportOpen] =
    useState<boolean>(false);
  const [promptPaymentReport, setPromptPaymentReport] = useState<FilterForm>({
    month: LAST_12_MONTHS_1[0].value,
  });
  const [promptPaymentReportOpen, setPromptPaymentReportOpen] =
    useState<boolean>(false);
  const [timeoffSummaryReportOpen, setTimeoffSummaryReportOpen] =
    useState<boolean>(false);
  const [jobNumberBasedReportOpen, setJobNumberBasedReportOpen] =
    useState<JobReportForm | undefined>();
  const [jobNumberForReport] = useState<JobReportForm>({} as JobReportForm);
  const handleOpenJobStatusReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setJobStatusDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setJobStatusDatesError(true);
        return;
      }
      if (data && data.status) {
        setJobStatusReport(data);
      }
      setJobStatusReportOpen(open);
    },
    [setJobStatusReport, setJobStatusReportOpen, setJobStatusDatesError],
  );
  const handleOpenBillingStatusReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setBillingStatusDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setBillingStatusDatesError(true);
        return;
      }
      if (data && data.status) {
        setBillingStatusReport(data);
      }
      setBillingStatusReportOpen(open);
    },
    [
      setBillingStatusReport,
      setBillingStatusReportOpen,
      setBillingStatusDatesError,
    ],
  );
  const handleOpenNotificationsReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setNotificationsDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setNotificationsDatesError(true);
        return;
      }
      if (data && data.status) {
        setNotificationsReport(data);
      }
      setNotificationsReportOpen(open);
    },
    [
      setNotificationsReport,
      setNotificationsReportOpen,
      setNotificationsDatesError,
    ],
  );
  const handleOpenPerformanceMetricsReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setPerformanceMetricsDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setPerformanceMetricsDatesError(true);
        return;
      }
      if (data && data.startDate) {
        setPerformanceMetricsReport(data);
      }
      setPerformanceMetricsReportOpen(open);
    },
    [setPerformanceMetricsReport, setPerformanceMetricsDatesError],
  );
  const handleOpenDeletedServiceCallsReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      console.log({ data });
      setDeletedServiceCallsDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setDeletedServiceCallsDatesError(true);
        console.log('we had an error');
        return;
      }
      if (data && data.startDate) {
        setDeletedServiceCallsReport(data);
      }
      setDeletedServiceCallsReportOpen(open);
    },
    [
      setDeletedServiceCallsReport,
      setDeletedServiceCallsReportOpen,
      setDeletedServiceCallsDatesError,
    ],
  );
  const handleOpenCallbackReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setCallbackDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setCallbackDatesError(true);
        return;
      }
      if (data && data.startDate) {
        setCallbackReport(data);
      }
      setCallbackReportOpen(open);
    },
    [setCallbackReport, setCallbackReportOpen, setCallbackDatesError],
  );
  const handleOpenServiceCallMetricsReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      if (data && data.week) {
        setServiceCallMetricsReport(data);
      }
      setServiceCallMetricsReportOpen(open);
    },
    [setServiceCallMetricsReport, setServiceCallMetricsReportOpen],
  );
  const handleOpenSpiffReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      if (data && data.monthlyWeekly) {
        setSpiffReport(data);
      }
      setSpiffReportOpen(open);
    },
    [setSpiffReport, setSpiffReportOpen],
  );
  const handleOpenFinalizeApprovedSpiffsToggle = useCallback(
    (open: boolean) => () => setFinalizeApprovedSpiffsOpen(open),
    [setFinalizeApprovedSpiffsOpen],
  );
  const handleOpenServiceCallZipCodeReportToggle = useCallback(
    (open: boolean) => () => setServiceCallZipCodeReportOpen(open),
    [setServiceCallZipCodeReportOpen],
  );
  const handleOpenWarrantyReportToggle = useCallback(
    (open: boolean) => () => setWarrantyReportOpen(open),
    [setWarrantyReportOpen],
  );
  const handleOpenTrainingMetricsReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setTrainingMetricsDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setTrainingMetricsDatesError(true);
        return;
      }
      if (data && data.status) {
        setTrainingMetricsReport(data);
      }
      setTrainingMetricsReportOpen(open);
    },
    [
      setTrainingMetricsReport,
      setTrainingMetricsReportOpen,
      setTrainingMetricsDatesError,
    ],
  );
  const handleOpenCharityReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      if (data && data.month) {
        setCharityReport(data);
      }
      setCharityReportOpen(open);
    },
    [setCharityReport, setCharityReportOpen],
  );
  const handleOpenBillingAuditReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      if (data && data.month) {
        setBillingAuditReport(data);
      }
      setBillingAuditReportOpen(open);
    },
    [setBillingAuditReport, setBillingAuditReportOpen],
  );
  const handleOpenPromptPaymentReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      if (data && data.month) {
        setPromptPaymentReport(data);
      }
      setPromptPaymentReportOpen(open);
    },
    [setPromptPaymentReport, setPromptPaymentReportOpen],
  );
  const handleOpenTimeoffSummaryReportToggle = useCallback(
    (open: boolean) => () => setTimeoffSummaryReportOpen(open),
    [setTimeoffSummaryReportOpen],
  );
  const handleOpenJobNumberBasedReportToggle = useCallback(
    (open: JobReportForm | undefined) => setJobNumberBasedReportOpen(open),
    [setJobNumberBasedReportOpen],
  );
  const handleSpiffReportChange = useCallback(
    (data: FilterForm) => {
      const spiffReportData: FilterForm = { ...data };
      if (data.monthlyWeekly !== spiffReport.monthlyWeekly) {
        setSpiffReportKey(spiffReportKey + 1);
        spiffReportData.month = LAST_12_MONTHS_1[0].value;
        spiffReportData.week = getCurrWeek();
      }
      setSpiffReport(spiffReportData);
    },
    [spiffReport, setSpiffReport, spiffReportKey, setSpiffReportKey],
  );
  const SCHEMA_SPIFF_REPORT: Schema<FilterForm> = [
    spiffReport.monthlyWeekly === 'Monthly'
      ? [
          {
            name: 'month',
            label: 'Select Report Date',
            options: LAST_12_MONTHS_1,
            required: true,
          },
        ]
      : [
          {
            name: 'week',
            label: 'Select Report Date',
            options: WEEK_OPTIONS_1,
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
        type: 'technicians',
        required: true,
      },
    ],
  ];
  const SCHEMA_JOB_REPORTS: Schema<JobReportForm> = [
    [
      {
        name: 'jobNumber',
        label: 'Job Number for Report',
        type: 'number',
      },
    ],
  ];
  return (
    <div className="ReportsWrapper">
      <Form
        title="Job Status Report"
        schema={SCHEMA_JOB_STATUS_REPORT}
        data={jobStatusReport}
        onSave={handleOpenJobStatusReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={jobStatusDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Billing Status Report"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={billingStatusReport}
        onSave={handleOpenBillingStatusReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={billingStatusDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Notifications Report"
        schema={SCHEMA_NOTIFICATIONS_REPORT}
        data={notificationsReport}
        onSave={handleOpenNotificationsReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={notificationsDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Performance Metrics"
        schema={SCHEMA_DATES_REPORT}
        data={performanceMetricsReport}
        onSave={handleOpenPerformanceMetricsReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={performanceMetricsDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Deleted Service Calls"
        schema={SCHEMA_DATES_REPORT}
        data={deletedServiceCallsReport}
        onSave={handleOpenDeletedServiceCallsReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={deletedServiceCallsDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Callback Report"
        schema={SCHEMA_DATES_REPORT}
        data={callbackReport}
        onSave={handleOpenCallbackReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={callbackDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Service Call Metrics"
        schema={SCHEMA_SERVICE_CALL_METRICS_REPORT}
        data={serviceCallMetricsReport}
        onSave={handleOpenServiceCallMetricsReportToggle(true)}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        key={spiffReportKey}
        title="Spiff Report"
        schema={SCHEMA_SPIFF_REPORT}
        data={spiffReport}
        onSave={handleOpenSpiffReportToggle(true)}
        onChange={handleSpiffReportChange}
        submitLabel="Report"
        onClose={null}
      />
      <SectionBar
        title="Finalize Approved Spiffs"
        subtitle="Mark all pending Spiffs that are approved as closed out and ready to pay."
        actions={[
          {
            label: 'Finalize',
            onClick: handleOpenFinalizeApprovedSpiffsToggle(true),
          },
        ]}
        fixedActions
      />
      <SectionBar
        title="Service Call Zip Code"
        actions={[
          {
            label: 'Report',
            onClick: handleOpenServiceCallZipCodeReportToggle(true),
          },
        ]}
        fixedActions
      />
      <SectionBar
        title="Warranty Report"
        actions={[
          {
            label: 'Report',
            onClick: handleOpenWarrantyReportToggle(true),
          },
        ]}
        fixedActions
      />
      <Form
        title="Training Metrics"
        schema={SCHEMA_TRAINING_METRICS_REPORT}
        data={trainingMetricsReport}
        onSave={handleOpenTrainingMetricsReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={trainingMetricsDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Charity Report"
        schema={SCHEMA_CHARITY_REPORT}
        data={charityReport}
        onSave={handleOpenCharityReportToggle(true)}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Billing Audit"
        schema={SCHEMA_LAST_12_MONTHS_REPORT}
        data={billingAuditReport}
        onSave={handleOpenBillingAuditReportToggle(true)}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Prompt Payment Report"
        schema={SCHEMA_LAST_12_MONTHS_REPORT}
        data={promptPaymentReport}
        onSave={handleOpenPromptPaymentReportToggle(true)}
        submitLabel="Report"
        onClose={null}
      />
      <SectionBar
        title="Timeoff Summary"
        actions={[
          {
            label: 'Report',
            onClick: handleOpenTimeoffSummaryReportToggle(true),
          },
        ]}
        fixedActions
      />
      <Form
        title="Job Number Report"
        schema={SCHEMA_JOB_REPORTS}
        data={jobNumberForReport}
        onClose={null}
        onSave={(saved: JobReportForm) =>
          handleOpenJobNumberBasedReportToggle(saved)
        }
        submitLabel="Report"
      />
      {jobStatusReportOpen && (
        <Modal open onClose={handleOpenJobStatusReportToggle(false)} fullScreen>
          <EventsReport
            kind="jobStatus"
            loggedUserId={loggedUserId}
            filter={{
              ...jobStatusReport,
              status:
                jobStatusReport.status === OPTION_ALL
                  ? undefined
                  : jobStatusReport.status,
            }}
            onClose={handleOpenJobStatusReportToggle(false)}
          />
        </Modal>
      )}
      {billingStatusReportOpen && (
        <Modal
          open
          onClose={handleOpenBillingStatusReportToggle(false)}
          fullScreen
        >
          <EventsReport
            kind="paymentStatus"
            loggedUserId={loggedUserId}
            filter={{
              ...billingStatusReport,
              status:
                billingStatusReport.status === OPTION_ALL
                  ? undefined
                  : billingStatusReport.status,
            }}
            onClose={handleOpenBillingStatusReportToggle(false)}
          />
        </Modal>
      )}
      {notificationsReportOpen && (
        <Modal
          open
          onClose={handleOpenNotificationsReportToggle(false)}
          fullScreen
        >
          <ActivityLogReport
            status={
              notificationsReport.status === 'Deletions only' ? 'Deleted' : ''
            }
            activityDateStart={notificationsReport.startDate!}
            activityDateEnd={notificationsReport.endDate!}
            onClose={handleOpenNotificationsReportToggle(false)}
          />
        </Modal>
      )}
      {performanceMetricsReportOpen && (
        <Modal
          open
          onClose={handleOpenPerformanceMetricsReportToggle(false)}
          fullScreen
        >
          <PerformanceMetrics
            onClose={handleOpenPerformanceMetricsReportToggle(false)}
            dateStart={performanceMetricsReport.startDate!}
            dateEnd={performanceMetricsReport.endDate!}
          />
        </Modal>
      )}
      {deletedServiceCallsReportOpen && (
        <Modal
          open
          onClose={handleOpenDeletedServiceCallsReportToggle(false)}
          fullScreen
        >
          <DeletedServiceCallsReport
            loggedUserId={loggedUserId}
            onClose={handleOpenDeletedServiceCallsReportToggle(false)}
            dateStarted={deletedServiceCallsReport.startDate!}
            dateEnded={deletedServiceCallsReport.endDate!}
          />
        </Modal>
      )}
      {callbackReportOpen && (
        <Modal open onClose={handleOpenCallbackReportToggle(false)} fullScreen>
          <CallbackReport
            onClose={handleOpenCallbackReportToggle(false)}
            dateStart={callbackReport.startDate!}
            dateEnd={callbackReport.endDate!}
          />
        </Modal>
      )}
      {serviceCallMetricsReportOpen && (
        <Modal
          open
          onClose={handleOpenServiceCallMetricsReportToggle(false)}
          fullScreen
        >
          <ServiceCallMetrics
            week={serviceCallMetricsReport.week!}
            onClose={handleOpenServiceCallMetricsReportToggle(false)}
          />
        </Modal>
      )}
      {spiffReportOpen && (
        <Modal open onClose={handleOpenSpiffReportToggle(false)} fullScreen>
          <SpiffReport
            onClose={handleOpenSpiffReportToggle(false)}
            date={
              spiffReport.monthlyWeekly! === 'Monthly'
                ? spiffReport.month!
                : spiffReport.week!
            }
            type={spiffReport.monthlyWeekly!}
            users={spiffReport.users!.split(',').map((id: string) => +id)}
          />
        </Modal>
      )}
      {finalizeApprovedSpiffsOpen && (
        <Modal
          open
          onClose={handleOpenFinalizeApprovedSpiffsToggle(false)}
          fullScreen
        >
          <SectionBar
            title="Finalize Approved Spiffs"
            actions={[
              {
                label: 'Close',
                onClick: () => handleOpenFinalizeApprovedSpiffsToggle(false)(),
              },
            ]}
            fixedActions
          />
          {UNDER_CONSTRUCTION}
        </Modal>
      )}
      {serviceCallZipCodeReportOpen && (
        <Modal
          open
          onClose={handleOpenServiceCallZipCodeReportToggle(false)}
          fullScreen
        >
          <SectionBar
            title="Service Call Zip Code"
            actions={[
              {
                label: 'Close',
                onClick: () =>
                  handleOpenServiceCallZipCodeReportToggle(false)(),
              },
            ]}
            fixedActions
          />
          {UNDER_CONSTRUCTION}
        </Modal>
      )}
      {warrantyReportOpen && (
        <Modal open onClose={handleOpenWarrantyReportToggle(false)} fullScreen>
          <WarrantyReport onClose={handleOpenWarrantyReportToggle(false)} />
        </Modal>
      )}
      {trainingMetricsReportOpen && (
        <Modal
          open
          onClose={handleOpenTrainingMetricsReportToggle(false)}
          fullScreen
        >
          <SectionBar
            title="Training Metrics"
            actions={[
              {
                label: 'Close',
                onClick: () => handleOpenTrainingMetricsReportToggle(false)(),
              },
            ]}
            fixedActions
          />
          {UNDER_CONSTRUCTION}
        </Modal>
      )}
      {charityReportOpen && (
        <Modal open onClose={handleOpenCharityReportToggle(false)} fullScreen>
          <CharityReport
            month={charityReport.month!}
            onClose={handleOpenCharityReportToggle(false)}
          />
        </Modal>
      )}
      {billingAuditReportOpen && (
        <Modal
          open
          onClose={handleOpenBillingAuditReportToggle(false)}
          fullScreen
        >
          <BillingAuditReport
            month={billingAuditReport.month!}
            loggedUserId={loggedUserId}
            onClose={handleOpenBillingAuditReportToggle(false)}
          />
        </Modal>
      )}
      {promptPaymentReportOpen && (
        <Modal
          open
          onClose={handleOpenPromptPaymentReportToggle(false)}
          fullScreen
        >
          <PromptPaymentReport
            month={promptPaymentReport.month!}
            onClose={handleOpenPromptPaymentReportToggle(false)}
          />
        </Modal>
      )}
      {timeoffSummaryReportOpen && (
        <Modal
          open
          onClose={handleOpenTimeoffSummaryReportToggle(false)}
          fullScreen
        >
          <TimeoffSummaryReport
            onClose={handleOpenTimeoffSummaryReportToggle(false)}
          />
        </Modal>
      )}
      {jobNumberBasedReportOpen && (
        <Modal
          open
          onClose={() => handleOpenJobNumberBasedReportToggle(undefined)}
        >
          <SectionBar
            title="Job Number Report"
            actions={[
              {
                label: 'Close',
                onClick: () => handleOpenJobNumberBasedReportToggle(undefined),
              },
            ]}
            fixedActions
          />
          <CostReport
            serviceCallId={jobNumberBasedReportOpen.jobNumber}
            loggedUserId={loggedUserId}
          />
        </Modal>
      )}
    </div>
  );
};
