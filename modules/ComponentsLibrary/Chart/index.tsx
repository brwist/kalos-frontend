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
import { PlainForm, Schema } from '../PlainForm';

export type DataItem = { [key: string]: any };
export type Data = DataItem[];
export type Config = {
  xDataKey: string;
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
  groupByKeys?: string[];
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
  config: { xDataKey, bars },
  skipOrdering = false,
  skipRatio = false,
  groupByKeys = [],
}) => {
  const classes = useStyles();
  const [chartFormData, setChartFormData] = useState<ChartForm>({
    orderBy: bars[0]!.dataKey,
    ratio: 0,
    groupBy: xDataKey,
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
              options: [xDataKey, ...groupByKeys],
            },
          ]),
      ...(skipOrdering
        ? []
        : [
            {
              label: 'Order by',
              name: 'orderBy' as const,
              options: bars.map(({ dataKey, name }) => ({
                label: name,
                value: dataKey,
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
        width={730}
        height={350}
        data={barCharData}
        className={classes.chart}
        stackOffset="expand"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={groupBy} />
        <YAxis tickFormatter={ratio ? toPercent : undefined} />
        <Tooltip />
        <Legend verticalAlign="top" />
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
