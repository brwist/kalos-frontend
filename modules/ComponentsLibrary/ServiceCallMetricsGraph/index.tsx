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

export const ServiceCallMetricsGraph: FC<Props> = () => {
  const classes = useStyles();
  const data = getMockedData();
  return (
    <div className={classes.wrapper}>
      <ResponsiveContainer>
        <AreaChart data={data} className={classes.chart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="serviceCalls"
            stroke={COLORS.serviceCalls}
            fill={COLORS.serviceCalls}
            dot
            activeDot={ACTIVE_DOT}
          />
          <Area
            type="monotone"
            dataKey="phoneCalls"
            stroke={COLORS.phoneCalls}
            fill={COLORS.phoneCalls}
            dot
            activeDot={ACTIVE_DOT}
          />
          <Area
            type="monotone"
            dataKey="activeCustomers"
            stroke={COLORS.activeCustomers}
            fill={COLORS.activeCustomers}
            dot
            activeDot={ACTIVE_DOT}
          />
          <Area
            type="monotone"
            dataKey="totalCustomers"
            stroke={COLORS.totalCustomers}
            fill={COLORS.totalCustomers}
            dot
            activeDot={ACTIVE_DOT}
          />
          <Area
            type="monotone"
            dataKey="totalContracts"
            stroke={COLORS.totalContracts}
            fill={COLORS.totalContracts}
            dot
            activeDot={ACTIVE_DOT}
          />
          <Area
            type="monotone"
            dataKey="totalInstallationTypeCalls"
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
