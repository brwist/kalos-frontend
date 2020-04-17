import React, { FC, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema, Option } from '../PlainForm';

export type DataItem = { [key: string]: any };
export type Data = DataItem[];
export type Config = {
  x: {
    dataKey: string;
    label: string;
  };
  bars: {
    dataKey: string;
    name: string;
    fill: string;
  }[];
};

type ChartForm = {
  orderBy: string;
  ratio: number;
  groupBy: string;
};

export interface Props {
  title?: string;
  data: Data;
  config: Config;
  skipOrdering?: boolean;
  skipRatio?: boolean;
  groupByKeys?: Option[];
  groupByLabels?: { [key: string]: string };
}

const useStyles = makeStyles(theme => ({
  chart: {
    ...theme.typography.body1,
  },
}));

const toPercent = (decimal: number, fixed: number = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;

export const Chart: FC<Props> = ({
  title,
  data,
  config: {
    x: { dataKey, label },
    bars,
  },
  skipOrdering = false,
  skipRatio = false,
  groupByKeys = [],
  groupByLabels = {},
}) => {
  const classes = useStyles();
  const [chartFormData, setChartFormData] = useState<ChartForm>({
    orderBy: bars[0]!.dataKey,
    ratio: 0,
    groupBy: dataKey,
  });
  const { orderBy, ratio, groupBy } = chartFormData;
  const SCHEMA: Schema<ChartForm> = [
    [
      ...(groupByKeys.length === 0
        ? []
        : [
            {
              label: 'Group By',
              name: 'groupBy' as const,
              options: [{ label, value: dataKey }, ...groupByKeys],
            },
          ]),
      ...(skipOrdering
        ? []
        : [
            {
              label: 'Order by',
              name: 'orderBy' as const,
              options: bars.map(({ dataKey, name, fill }) => ({
                label: name,
                value: dataKey,
                color: fill,
              })),
            },
          ]),
      ...(skipRatio
        ? []
        : [
            {
              label: 'Show As Ratio',
              name: 'ratio' as const,
              type: 'checkbox' as const,
              disabled: bars.length < 2,
            },
          ]),
    ],
  ];
  const sort = useCallback(
    (key: string) => (a: DataItem, b: DataItem) => {
      const A = ratio
        ? a[key] / bars.reduce((aggr, item) => aggr + a[item.dataKey], 0)
        : a[key];
      const B = ratio
        ? b[key] / bars.reduce((aggr, item) => aggr + b[item.dataKey], 0)
        : b[key];
      if (A > B) return -1;
      if (A < b) return 1;
      return 0;
    },
    [ratio, bars],
  );
  const groupedData = JSON.parse(JSON.stringify(data)).reduce(
    (aggr: Data, item: DataItem) => {
      if (groupBy !== dataKey) {
        item[groupBy] = groupByLabels[item[groupBy]] || item[groupBy];
      }
      const element = aggr.find(aa => aa[groupBy] === item[groupBy]);
      if (element) {
        bars.forEach(({ dataKey }) => (element[dataKey] += item[dataKey]));
      } else {
        aggr.push(item);
      }
      return aggr;
    },
    [],
  );
  const barCharData = groupedData.sort(sort(orderBy));
  const barChartKey = [orderBy].join('|');
  return (
    <div>
      <SectionBar
        title={title}
        actions={[
          {
            label: 'Print',
          },
        ]}
        fixedActions
      />
      <PlainForm
        schema={SCHEMA}
        data={chartFormData}
        onChange={setChartFormData}
      />
      <BarChart
        key={barChartKey}
        width={1200}
        height={500}
        data={barCharData}
        className={classes.chart}
        stackOffset="expand"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={groupBy} />
        <YAxis tickFormatter={ratio ? toPercent : undefined} />
        <Tooltip />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          iconSize={16}
        />
        {bars.map(props => (
          <Bar
            key={props.dataKey}
            {...props}
            name={`${props.name}${ratio ? ' %' : ''}`}
            stackId={ratio ? '1' : undefined}
          />
        ))}
      </BarChart>
    </div>
  );
};
