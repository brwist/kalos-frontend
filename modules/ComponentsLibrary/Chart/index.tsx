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
};

export interface Props {
  title?: string;
  data: Data;
  config: Config;
  skipOrdering?: boolean;
  skipRatio?: boolean;
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
}) => {
  const classes = useStyles();
  const [chartFormData, setChartFormData] = useState<ChartForm>({
    orderBy: bars[0]!.dataKey,
    ratio: 0,
  });
  const { orderBy, ratio } = chartFormData;
  const SCHEMA: Schema<ChartForm> = [
    [
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
  const barCharData = data.sort(sort(orderBy));
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
        // stackOffset="expand"
        // layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xDataKey} />
        <YAxis tickFormatter={ratio ? toPercent : undefined} />
        {/* <YAxis dataKey={xDataKey} type="category" />
        <XAxis tickFormatter={ratio ? toPercent : undefined} /> */}
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
