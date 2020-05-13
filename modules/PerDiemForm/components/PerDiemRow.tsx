import React from 'react';
import { PerDiemClient } from '@kalos-core/kalos-rpc/PerDiem';
import { PerDiemRow } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { Form, Schema } from '../../ComponentsLibrary/Form';

interface props {
  saveRow(row: PerDiemRow): void;
  startDate: string;
}

interface state {}

const SCHEMA: Schema<PerDiemRow> = [
  [
    {
      label: 'Date',
      name: 'setDateString',
      type: 'date',
      required: true,
    },
    {
      label: 'Meals Only',
      name: 'setMealsOnly',
      type: 'checkbox',
    },
    {
      label: 'Job Number',
      name: 'setServiceCallId',
      type: 'number',
      required: true,
    },
    {
      label: 'Zip Code',
      name: 'setZipCode',
      type: 'text',
    },
  ],
  [
    {
      label: 'Notes',
      name: 'setNotes',
      type: 'text',
      onChange,
    },
  ],
];
export class PDRow extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {};
    const row = new PerDiemRow();
    row.set;
  }
  render() {
    return (
      <div>
        <span>row</span>
      </div>
    );
  }
}
