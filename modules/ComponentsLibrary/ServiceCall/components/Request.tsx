import React, {
  FC,
  useCallback,
  useState,
  useMemo,
  forwardRef,
  useEffect,
} from 'react';
import { PlainForm, Option } from '../../PlainForm';
import { Form, Schema } from '../../Form';
import { InfoTable } from '../../InfoTable';
import { makeFakeRows } from '../../../../helpers';
import {
  RESIDENTIAL_OPTIONS,
  EVENT_STATUS_LIST,
  PAYMENT_TYPE_LIST,
  JOB_STATUS_COLORS,
  OPTION_BLANK,
} from '../../../../constants';
import { EventType, JobTypeSubtypeType } from '../';

const JOB_STATUS_OPTIONS: Option[] = EVENT_STATUS_LIST.map(label => ({
  label,
  value: label,
  color: `#${JOB_STATUS_COLORS[label]}`,
}));

interface Props {
  loading: boolean;
  disabled: boolean;
  serviceItem: EventType;
  propertyEvents: EventType[];
  jobTypeOptions: Option[];
  jobSubtypeOptions: Option[];
  jobTypeSubtypes: JobTypeSubtypeType[];
  onChange: (serviceItem: EventType) => void;
  onValid: (valid: boolean) => void;
  onInitSchema: (fields: string[]) => void;
}

export const Request: FC<Props> = forwardRef(
  (
    {
      serviceItem,
      propertyEvents,
      loading,
      disabled,
      jobTypeOptions,
      jobSubtypeOptions,
      onChange,
      onValid,
      onInitSchema,
    },
    ref,
  ) => {
    const [initSchemaCalled, setInitSchemaCalled] = useState<boolean>(false);
    const [resetId, setResetId] = useState<number>(0);
    const handleChange = useCallback(
      (data: EventType) => {
        const { jobTypeId, jobSubtypeId, logJobStatus } = data;
        const formData = {
          ...data,
          jobType:
            jobTypeOptions.find(({ value }) => value === jobTypeId)?.label ||
            '',
          jobSubtype:
            jobSubtypeOptions.find(({ value }) => value === jobSubtypeId)
              ?.label || '',
          color: JOB_STATUS_COLORS[logJobStatus],
        };
        if (formData.jobTypeId !== serviceItem.jobTypeId) {
          formData.jobSubtypeId = 0;
          formData.jobSubtype = '';
          setResetId(resetId + 1);
        }
        if (!formData.isCallback && serviceItem.isCallback) {
          formData.callbackOriginalId = 0;
          setResetId(resetId + 1);
        }
        onChange(formData);
        onValid(false);
      },
      [
        serviceItem,
        onChange,
        jobTypeOptions,
        jobSubtypeOptions,
        resetId,
        setResetId,
        onValid,
      ],
    );
    const handleSetValid = useCallback(() => onValid(true), [onValid]);
    const callbackOriginalOptions: Option[] = useMemo(
      () => [
        { label: OPTION_BLANK, value: 0 },
        ...propertyEvents.map(({ id, logJobNumber, name }) => ({
          label: `${logJobNumber} - ${name}`,
          value: id,
        })),
      ],
      [propertyEvents],
    );
    const { isCallback } = serviceItem;
    const SCHEMA: Schema<EventType> = useMemo(
      () => [
        [
          {
            label: 'Date of Service',
            name: 'dateStarted',
            type: 'date',
            required: true,
          },
          {
            label: 'Begin Time',
            name: 'timeStarted',
            type: 'time',
            required: true,
          },
          {
            label: 'End Date',
            name: 'dateEnded',
            type: 'date',
            required: true,
          },
          {
            label: 'End Time',
            name: 'timeEnded',
            type: 'time',
            required: true,
          },
        ],
        [
          {
            label: 'Payment Type',
            name: 'logPaymentType',
            required: true,
            options: PAYMENT_TYPE_LIST,
          },
          {
            label: 'Sector',
            name: 'isResidential',
            required: true,
            options: RESIDENTIAL_OPTIONS,
          },
          {
            label: 'Amount Quoted',
            name: 'amountQuoted',
            startAdornment: '$',
          },
          {
            label: 'Diagnostic Quoted',
            name: 'diagnosticQuoted',
            type: 'checkbox',
          },
        ],
        [
          {
            label: 'Job Status',
            name: 'logJobStatus',
            required: true,
            options: JOB_STATUS_OPTIONS,
          },
          {
            label: 'Job Type',
            name: 'jobTypeId',
            required: true,
            options: jobTypeOptions,
          },
          {
            label: 'Sub Type',
            name: 'jobSubtypeId',
            options: jobSubtypeOptions,
          },
          {
            label: 'Priority',
            name: 'highPriority',
            required: true,
            type: 'checkbox',
          },
        ],
        [
          {
            label: 'Is LMPC?',
            name: 'isLmpc',
            type: 'checkbox',
          },
          {
            label: 'Is Callback?',
            name: 'isCallback',
            type: 'checkbox',
          },
          {
            label: 'Callback Regarding Service Call',
            name: 'callbackOriginalId',
            options: callbackOriginalOptions,
            disabled: !isCallback,
          },
          {},
        ],
        [
          {
            label: 'Technician Assigned',
            name: 'logTechnicianAssigned',
            type: 'technicians',
            required: true,
          },
          {
            label: 'Service Needed',
            name: 'description',
            required: true,
            multiline: true,
          },
          {
            label: 'Service Call Notes',
            name: 'logNotes',
            description: 'For internal use',
            multiline: true,
          },
        ],
      ],
      [callbackOriginalOptions, isCallback, jobSubtypeOptions, jobTypeOptions],
    );
    useEffect(() => {
      if (!initSchemaCalled) {
        setInitSchemaCalled(true);
        const fields = SCHEMA.map(item =>
          item.map(({ name }) => name).filter(name => name),
        ).reduce((aggr, item) => [...aggr, ...item], []);
        onInitSchema(fields as string[]);
      }
    }, [initSchemaCalled, setInitSchemaCalled, onInitSchema, SCHEMA]);
    if (loading) return <InfoTable data={makeFakeRows(4, 5)} loading />;
    return (
      <Form<EventType>
        //@ts-ignore
        ref={ref}
        key={resetId}
        schema={SCHEMA}
        data={serviceItem}
        onChange={handleChange}
        onClose={() => {}}
        onSave={handleSetValid}
        disabled={disabled}
      />
    );
  },
);
