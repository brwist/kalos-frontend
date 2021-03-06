import React from 'react';
import { Chart, Data } from './';
import { CHART_COLORS } from '../../../constants';

const { blue, red, orange, green, purple } = CHART_COLORS;

const GROUP_BY_LABELS = {
  IT: 'IT',
  technician: 'Technicians',
  office: 'Back Office',
  finance: 'Finance',
};

const GROUP_BY_KEYS = [{ label: 'Role', value: 'role' }];

const data: Data = [
  {
    id: 1,
    name: 'John Doe',
    role: 'technician',
    billable: 4000,
    unbillable: 2400,
    sick: 0,
    withoutPay: 0,
    juryDuty: 0,
    vacationTime: 1,
    other: 0,
    service: 225,
  },
  {
    id: 2,
    name: 'Mark Smith',
    role: 'IT',
    billable: 3000,
    unbillable: 1398,
    sick: 1,
    withoutPay: 8,
    juryDuty: 1,
    vacationTime: 0,
    other: 1,
    service: 135,
  },
  {
    id: 3,
    name: 'Steven Woo',
    role: 'IT',
    billable: 2000,
    unbillable: 9800,
    sick: 3,
    withoutPay: 2,
    juryDuty: 2,
    vacationTime: 3,
    other: 0,
    service: 210,
  },
  {
    id: 4,
    name: 'Adam Sven',
    role: 'technician',
    billable: 2780,
    unbillable: 3908,
    sick: 0,
    withoutPay: 5,
    juryDuty: 0,
    vacationTime: 2,
    other: 2,
    service: 170,
  },
  {
    id: 5,
    name: 'Caren Mirren',
    role: 'office',
    billable: 1890,
    unbillable: 4800,
    sick: 0,
    withoutPay: 7,
    juryDuty: 0,
    vacationTime: 1,
    other: 1,
    service: 23,
  },
  {
    id: 6,
    name: 'Emily Sweel',
    role: 'office',
    billable: 2390,
    unbillable: 3800,
    sick: 1,
    withoutPay: 2,
    juryDuty: 0,
    vacationTime: 4,
    other: 0,
    service: 14,
  },
  {
    id: 7,
    name: 'Linda Camos',
    role: 'technician',
    billable: 390,
    unbillable: 430,
    sick: 2,
    withoutPay: 2,
    juryDuty: 0,
    vacationTime: 1,
    other: 3,
    service: 287,
  },
  {
    id: 8,
    name: 'Kevin Lamis',
    role: 'technician',
    billable: 3490,
    unbillable: 4300,
    sick: 2,
    withoutPay: 2,
    juryDuty: 0,
    vacationTime: 1,
    other: 3,
    service: 187,
  },
  {
    id: 9,
    name: 'Eve Norge',
    role: 'finance',
    billable: 4190,
    unbillable: 3200,
    sick: 2,
    withoutPay: 2,
    juryDuty: 0,
    vacationTime: 1,
    other: 0,
    service: 17,
  },
  {
    id: 10,
    name: 'Ellen Viner',
    role: 'IT',
    billable: 490,
    unbillable: 4300,
    sick: 2,
    withoutPay: 2,
    juryDuty: 0,
    vacationTime: 1,
    other: 1,
    service: 87,
  },
  {
    id: 11,
    name: 'Brad Vuen',
    role: 'office',
    billable: 3490,
    unbillable: 300,
    sick: 2,
    withoutPay: 1,
    juryDuty: 1,
    vacationTime: 10,
    other: 3,
    service: 97,
  },
];

export default () => (
  <>
    <Chart
      title="Hourly Breakdown"
      config={{
        x: {
          dataKey: 'name',
          label: 'Name',
        },
        bars: [
          {
            dataKey: 'billable',
            name: 'Billable',
            fill: blue,
          },
          {
            dataKey: 'unbillable',
            name: 'Unbillable  ',
            fill: red,
          },
        ],
      }}
      data={data}
      groupByKeys={GROUP_BY_KEYS}
      groupByLabels={GROUP_BY_LABELS}
      loggedUserId={2}
    />
    <hr />
    <Chart
      title="Timeoff Requests"
      config={{
        x: {
          dataKey: 'name',
          label: 'Name',
        },
        bars: [
          {
            dataKey: 'sick',
            name: 'Sick',
            fill: blue,
          },
          {
            dataKey: 'withoutPay',
            name: 'Without Pay',
            fill: red,
          },
          {
            dataKey: 'juryDuty',
            name: 'Jury Duty',
            fill: orange,
          },
          {
            dataKey: 'vacationTime',
            name: 'Vacation Time',
            fill: green,
          },
          {
            dataKey: 'other',
            name: 'Other',
            fill: purple,
          },
        ],
      }}
      data={data}
      groupByKeys={GROUP_BY_KEYS}
      groupByLabels={GROUP_BY_LABELS}
    />
    <hr />
    <Chart
      title="Billable Per Hour - Service"
      config={{
        x: {
          dataKey: 'name',
          label: 'Name',
        },
        bars: [
          {
            dataKey: 'service',
            name: 'Service',
            fill: blue,
          },
        ],
      }}
      data={data}
      groupByKeys={GROUP_BY_KEYS}
      groupByLabels={GROUP_BY_LABELS}
    />
    <hr />
    <Chart
      title="Billable Per Hour - Service"
      config={{
        x: {
          dataKey: 'name',
          label: 'Name',
        },
        bars: [
          {
            dataKey: 'service',
            name: 'Service',
            fill: blue,
          },
        ],
      }}
      data={[]}
      groupByKeys={GROUP_BY_KEYS}
      groupByLabels={GROUP_BY_LABELS}
      loading
    />
  </>
);
