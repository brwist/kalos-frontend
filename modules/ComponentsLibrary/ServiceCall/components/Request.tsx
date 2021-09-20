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
import { makeFakeRows, makeSafeFormObject } from '../../../../helpers';
import {
  RESIDENTIAL_OPTIONS,
  EVENT_STATUS_LIST,
  PAYMENT_TYPE_LIST,
  JOB_STATUS_COLORS,
  OPTION_BLANK,
} from '../../../../constants';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { JobTypeSubtype } from '@kalos-core/kalos-rpc/JobTypeSubtype';

const JOB_STATUS_OPTIONS: Option[] = EVENT_STATUS_LIST.map(label => ({
  label,
  value: label,
  color: `#${JOB_STATUS_COLORS[label]}`,
}));

interface Props {
  loading: boolean;
  disabled: boolean;
  serviceItem: Event;
  propertyEvents: Event[];
  jobTypeOptions: Option[];
  jobSubtypeOptions: Option[];
  jobTypeSubtypes: JobTypeSubtype[];
  onChange: (serviceItem: Event) => void;
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
      (data: Event) => {
        //const { jobTypeId, jobSubtypeId, logJobStatus } = data;
        const tempData = makeSafeFormObject(data, new Event());
        console.log(tempData);

        const jobTypeId = tempData.getJobTypeId();
        const jobSubtypeId = tempData.getJobSubtypeId();
        const logJobStatus = tempData.getLogJobStatus();

        tempData.setJobType(
          jobTypeOptions.find(value => value.value === jobTypeId)?.label || '',
        );
        tempData.setJobSubtype(
          jobSubtypeOptions.find(value => value.value === jobSubtypeId)
            ?.label || '',
        );
        tempData.setColor(JOB_STATUS_COLORS[logJobStatus]);

        const formData = {
          jobTypeId: tempData.getJobTypeId(),
          jobType:
            jobTypeOptions.find(({ value }) => value === jobTypeId)?.label ||
            '',
          jobSubtype:
            jobSubtypeOptions.find(({ value }) => value === jobSubtypeId)
              ?.label || '',
          color: JOB_STATUS_COLORS[logJobStatus],
        };

        if (formData.jobTypeId !== serviceItem.getJobTypeId()) {
          tempData.setJobSubtypeId(0);
          tempData.getJobTypeId;
          tempData.setJobSubtype('');
          setResetId(resetId + 1);
        }
        if (!tempData.getIsCallback() && serviceItem.getIsCallback()) {
          tempData.setCallbackOriginalId(0);
          setResetId(resetId + 1);
        }

        onChange(tempData);
        onValid(false);
      },
      [
        onChange,
        jobSubtypeOptions,
        jobTypeOptions,
        resetId,
        serviceItem,
        onValid,
      ],
    );
    const handleSetValid = useCallback(() => onValid(true), [onValid]);
    const callbackOriginalOptions: Option[] = useMemo(
      () => [
        { label: OPTION_BLANK, value: 0 },
        ...propertyEvents.map(event => ({
          label: `${event.getLogJobNumber()} - ${event.getName()}`,
          value: event.getId(),
        })),
      ],
      [propertyEvents],
    );
    const isCallback = serviceItem.getIsCallback();
    const SCHEMA: Schema<Event> = useMemo(
      () => [
        [
          {
            label: 'Date of Service',
            name: 'getDateStarted',
            type: 'date',
            required: true,
          },
          {
            label: 'Begin Time',
            name: 'getTimeStarted',
            type: 'time',
            required: true,
          },
          {
            label: 'End Date',
            name: 'getDateEnded',
            type: 'date',
            required: true,
          },
          {
            label: 'End Time',
            name: 'getTimeEnded',
            type: 'time',
            required: true,
          },
        ],
        [
          {
            label: 'Payment Type',
            name: 'getLogPaymentType',
            required: true,
            options: PAYMENT_TYPE_LIST,
          },
          {
            label: 'Sector',
            name: 'getIsResidential',
            required: false,
            options: [{label: 'Residential', value: 1}],
            defaultLabel: 'Commercial',
            displayEmpty: true,
            forceShrinkLabel: true,
          },
          {
            label: 'Department',
            name: 'getDepartmentId',
            required: true,
            type: 'department',
          },
          {
            label: 'Amount Quoted',
            name: 'getAmountQuoted',
            startAdornment: '$',
          },
          {
            label: 'Diagnostic Quoted',
            name: 'getDiagnosticQuoted',
            type: 'checkbox',
          },
        ],
        [
          {
            label: 'Job Status',
            name: 'getLogJobStatus',
            required: true,
            options: JOB_STATUS_OPTIONS,
          },
          {
            label: 'Job Type',
            name: 'getJobTypeId',
            required: true,
            options: jobTypeOptions,
          },
          {
            label: 'Sub Type',
            name: 'getJobSubtypeId',
            options: jobSubtypeOptions,
          },
          {
            label: 'Priority',
            name: 'getHighPriority',
            required: true,
            type: 'checkbox',
          },
        ],
        [
          {
            label: 'Is LMPC?',
            name: 'getIsLmpc',
            type: 'checkbox',
          },
          {
            label: 'Is Callback?',
            name: 'getIsCallback',
            type: 'checkbox',
          },
          {
            label: 'Callback Regarding Service Call',
            name: 'getCallbackOriginalId',
            options: callbackOriginalOptions,
            disabled: !isCallback,
          },
          {},
        ],
        [
          {
            label: 'Technician Assigned',
            name: 'getLogTechnicianAssigned',
            type: 'technicians',
            required: true,
          },
          {
            label: 'Service Needed',
            name: 'getDescription',
            required: true,
            multiline: true,
          },
          {
            label: 'Service Call Notes',
            name: 'getLogNotes',
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
        // console.log('test');
        const fields = SCHEMA.map(item =>
          item.map(({ name }) => name).filter(name => name),
        ).reduce((aggr, item) => [...aggr, ...item], []);
        onInitSchema(fields as string[]);
      }
    }, [initSchemaCalled, setInitSchemaCalled, onInitSchema, SCHEMA]);
    if (loading) return <InfoTable data={makeFakeRows(4, 5)} loading />;
    return (
      <Form<Event>
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
