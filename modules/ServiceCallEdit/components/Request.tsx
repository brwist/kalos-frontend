import React, { FC } from 'React';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { makeFakeRows } from '../../../helpers';
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
    {
      label: 'Technician Assigned',
      name: 'logTechnicianAssigned',
      required: true,
    },
  ],
  [
    { label: 'Begin Time', name: 'timeStarted', required: true },
    { label: 'Payment Type', name: 'logPaymentType', required: true },
  ],
  [
    { label: 'End Date', name: 'dateEnded', type: 'date', required: true },
    { label: 'Diagnostic Quoted', name: 'diagnosticQuoted', type: 'checkbox' },
  ],
  [
    { label: 'End Time', name: 'timeEnded', required: true },
    { label: 'Is LMPC?', name: 'isLmpc', type: 'checkbox' },
  ],
  [
    { label: 'Sector', name: 'id', required: true },
    { label: 'Is Callback?', name: 'isCallback', type: 'checkbox' },
  ],
  [
    { label: 'Job Type', name: 'jobType', required: true },
    { label: 'Amount Quoted', name: 'amountQuoted' },
  ],
  [
    { label: 'Sub Type', name: 'jobSubtype' },
    {
      label: 'Brief Description',
      name: 'description',
      required: true,
      description: 'Used on calendar',
    },
  ],
  [
    { label: 'Job Status', name: 'logJobStatus', required: true },
    {
      label: 'Priority',
      name: 'highPriority',
      required: true,
      type: 'checkbox',
    },
  ],
  [
    { label: 'Service Needed', name: 'services', required: true },
    {
      label: 'Service Call Notes',
      name: 'notes',
      description: 'For internal use',
    },
  ],
];

export const Request: FC<Props> = ({ serviceItem, loading }) => {
  if (loading) return <InfoTable data={makeFakeRows(2, 10)} loading />;
  return (
    <PlainForm
      schema={SCHEMA}
      data={serviceItem}
      onChange={a => console.log(a)}
    />
  );
};
