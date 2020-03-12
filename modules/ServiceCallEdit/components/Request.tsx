import React, { FC } from 'React';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { makeFakeRows } from '../../../helpers';
import { RESIDENTIAL_OPTIONS } from '../../../constants';
import { EventType } from './ServiceCallDetails';

interface Props {
  loading: boolean;
  serviceItem: EventType;
}

const SCHEMA: Schema<EventType> = [
  [
    {
      label: 'Date of Service',
      name: 'dateStarted',
      type: 'date',
      required: true,
    },
    { label: 'Begin Time', name: 'timeStarted', type: 'time', required: true },
    { label: 'End Date', name: 'dateEnded', type: 'date', required: true },
    { label: 'End Time', name: 'timeEnded', type: 'time', required: true },
  ],
  [
    {
      label: 'Technician Assigned',
      name: 'logTechnicianAssigned',
      required: true,
    },
    { label: 'Payment Type', name: 'logPaymentType', required: true },
    {
      label: 'Sector',
      name: 'isResidential',
      required: true,
      options: RESIDENTIAL_OPTIONS,
    },
    {
      label: 'Brief Description',
      name: 'name',
      required: true,
      description: 'Used on calendar',
    },
  ],
  [
    { label: 'Job Type', name: 'jobType', required: true },
    { label: 'Sub Type', name: 'jobSubtype' },
    { label: 'Job Status', name: 'logJobStatus', required: true },
    { label: 'Amount Quoted', name: 'amountQuoted' },
  ],
  [
    { label: 'Diagnostic Quoted', name: 'diagnosticQuoted', type: 'checkbox' },
    { label: 'Is LMPC?', name: 'isLmpc', type: 'checkbox' },
    { label: 'Is Callback?', name: 'isCallback', type: 'checkbox' },
    {
      label: 'Priority',
      name: 'highPriority',
      required: true,
      type: 'checkbox',
    },
  ],
  [
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
];

export const Request: FC<Props> = ({ serviceItem, loading }) => {
  if (loading) return <InfoTable data={makeFakeRows(2, 10)} loading />;
  console.log({ serviceItem });
  return (
    <PlainForm
      schema={SCHEMA}
      data={serviceItem}
      onChange={a => console.log(a)}
    />
  );
};
