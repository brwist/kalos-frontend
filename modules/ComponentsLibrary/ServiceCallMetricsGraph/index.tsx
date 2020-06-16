import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import getMockedData from './getMockedData';

interface Props {}

export type Data = {
  name: string;
  serviceCalls: number;
  phoneCalls: number;
  activeCustomers: number;
  totalCustomers: number;
  totalContracts: number;
  totalInstallationTypeCalls: number;
}[];

const useStyles = makeStyles(theme => ({
  wrapper: {
    height: 600,
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(),
  },
  chart: {
    ...theme.typography.body1,
  },
}));

const ACTIVE_DOT = { r: 6 };

const COLORS = {
  serviceCalls: '#404040',
  phoneCalls: '#ffd11a',
  activeCustomers: '#4d88ff',
  totalCustomers: '#e65c00',
  totalContracts: '#3fff00',
  totalInstallationTypeCalls: '#990099',
};

const CustomizedAxisTick: FC<{
  x: number;
  y: number;
  payload: {
    value: string;
  };
}> = ({ x, y, payload: { value } }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={-4}
      y={-12}
      dy={16}
      textAnchor="end"
      fill="#000000"
      transform="rotate(-90)"
    >
      {value}
    </text>
  </g>
);

export const ServiceCallMetricsGraph: FC<Props> = () => {
  const classes = useStyles();
  const data = getMockedData();
  return (
    <div className={classes.wrapper}>
      <ResponsiveContainer>
        <AreaChart data={data} className={classes.chart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={props => <CustomizedAxisTick {...props} />}
            height={100}
            interval={0}
          />
          <YAxis />
          <Tooltip />
          <Legend
            verticalAlign="top"
            iconType="circle"
            iconSize={14}
            wrapperStyle={{ top: -5 }}
          />
          <Area
            type="monotone"
            dataKey="serviceCalls"
            name="Service Calls"
            stroke={COLORS.serviceCalls}
            fill={COLORS.serviceCalls}
            dot
            activeDot={ACTIVE_DOT}
          />
          <Area
            type="monotone"
            dataKey="phoneCalls"
            name="Phone Calls"
            stroke={COLORS.phoneCalls}
            fill={COLORS.phoneCalls}
            dot
            activeDot={ACTIVE_DOT}
          />
          <Area
            type="monotone"
            dataKey="activeCustomers"
            name="Active Customers"
            stroke={COLORS.activeCustomers}
            fill={COLORS.activeCustomers}
            dot
            activeDot={ACTIVE_DOT}
          />
          <Area
            type="monotone"
            dataKey="totalCustomers"
            name="Total Customers"
            stroke={COLORS.totalCustomers}
            fill={COLORS.totalCustomers}
            dot
            activeDot={ACTIVE_DOT}
          />
          <Area
            type="monotone"
            dataKey="totalContracts"
            name="Total Contracts"
            stroke={COLORS.totalContracts}
            fill={COLORS.totalContracts}
            dot
            activeDot={ACTIVE_DOT}
          />
          <Area
            type="monotone"
            dataKey="totalInstallationTypeCalls"
            name="Total Installation Type Calls"
            stroke={COLORS.totalInstallationTypeCalls}
            fill={COLORS.totalInstallationTypeCalls}
            dot
            activeDot={ACTIVE_DOT}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
