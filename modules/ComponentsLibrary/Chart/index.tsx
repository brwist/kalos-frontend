import React, { FC, useCallback, useState, useRef, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { makeStyles } from '@material-ui/core/styles';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  ResponsiveContainerProps,
} from 'recharts';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PlainForm, Schema, Option } from '../PlainForm';

const PRINT_WIDTH = 1200;
const CHART_ASPECT_RATIO = 16 / 9;

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
  container: {
    position: 'relative',
    width: '100%',
    '&:before': {
      content: "' '",
      display: 'block',
      paddingTop: `${100 / CHART_ASPECT_RATIO}%`,
    },
  },
  responsive: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  chart: {
    ...theme.typography.body1,
  },
  print: {
    display: 'none',
    '@media print': {
      display: 'block',
    },
  },
  printHeader: {
    marginBottom: theme.spacing(),
  },
  printBody: {
    width: PRINT_WIDTH,
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
  const [width, setWidth] = useState<number>(0);
  const wrapperRef = useCallback(
    node => {
      if (node !== null) {
        setWidth(node.getBoundingClientRect().width);
      }
    },
    [setWidth],
  );
  const printRef = useRef<HTMLDivElement>(null);
  const resize = useCallback(() => wrapperRef(printRef.current), [
    wrapperRef,
    printRef,
  ]);
  useEffect(() => {
    window.addEventListener('resize', resize); // TODO removeEventListener
  }, []);
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
      const element = aggr.find(el => el[groupBy] === item[groupBy]);
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
  const ChartContent = ({
    print = false,
    width,
    height,
  }: {
    print?: boolean;
    width?: number;
    height?: number;
  }) => (
    <BarChart
      key={barChartKey}
      width={print ? PRINT_WIDTH : width}
      height={print ? PRINT_WIDTH / CHART_ASPECT_RATIO : height}
      data={barCharData}
      className={classes.chart}
      stackOffset="expand"
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={groupBy} />
      <YAxis tickFormatter={ratio ? toPercent : undefined} />
      <Tooltip />
      <Legend verticalAlign="top" height={36} iconType="circle" iconSize={16} />
      {[
        bars.find(({ dataKey }) => dataKey === orderBy)!,
        ...bars.filter(({ dataKey }) => dataKey !== orderBy),
      ].map(props => (
        <Bar
          key={props.dataKey}
          {...props}
          name={`${props.name}${ratio ? ' %' : ''}`}
          stackId={ratio ? '1' : undefined}
        />
      ))}
    </BarChart>
  );
  const CustomResponsiveContainer = (props: ResponsiveContainerProps) => (
    <div className={classes.container}>
      <div className={classes.responsive}>
        <ResponsiveContainer {...props} />
      </div>
    </div>
  );
  return (
    <div ref={wrapperRef}>
      <SectionBar
        title={title}
        asideContent={
          <ReactToPrint
            trigger={() => <Button label="Print" />}
            content={() => printRef.current}
            bodyClass={classes.printBody}
          />
        }
      />
      <PlainForm
        schema={SCHEMA}
        data={chartFormData}
        onChange={setChartFormData}
      />
      <CustomResponsiveContainer aspect={CHART_ASPECT_RATIO}>
        <ChartContent />
      </CustomResponsiveContainer>
      <div ref={printRef}>
        <div className={classes.print}>
          <SectionBar title={title} className={classes.printHeader} />
          <ChartContent print />
        </div>
      </div>
    </div>
  );
};
