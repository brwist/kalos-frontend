import PerDiemIcon from '@material-ui/icons/MonetizationOn';
import HomeSharp from '@material-ui/icons/HomeSharp';
import MoneySharp from '@material-ui/icons/MoneySharp';
import AttachMoneySharp from '@material-ui/icons/AttachMoneySharp';
import SearchSharp from '@material-ui/icons/SearchSharp';
import MenuBookIcon from '@material-ui/icons/MenuBookSharp';
import CalendarTodaySharp from '@material-ui/icons/CalendarTodaySharp';
import PersonSharp from '@material-ui/icons/PersonSharp';
import PictureAsPdfSharpIcon from '@material-ui/icons/PictureAsPdfSharp';
import ReceiptIcon from '@material-ui/icons/ReceiptSharp';
import EventSharp from '@material-ui/icons/EventSharp';
import LocationOnIcon from '@material-ui/icons/LocationOnSharp';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AccountCircleIcon from '@material-ui/icons/AccountCircleSharp';
import ExitToAppIcon from '@material-ui/icons/ExitToAppSharp';
import RoomServiceIcon from '@material-ui/icons/RoomServiceSharp';
import BarChartSharp from '@material-ui/icons/BarChartSharp';
import BugReportIcon from '@material-ui/icons/BugReport';
import { cfURL } from '../../helpers';
import React from 'react';

const spiffLog = (userId: number) =>
  cfURL('tasks.spiff_tool_logs', `&rt=all&type=spiff&reportUserId=${userId}`);
const toolLog = (userId: number) =>
  cfURL('tasks.spiff_tool_logs', `&rt=all&type=tool&reportUserId=${userId}`);
const timesheet = (userId: number) =>
  cfURL(
    'timesheet.timesheetview',
    `&user_id=${userId}&timesheetAction=cardview`,
  );
const employees = cfURL('user.employee');
const search = cfURL('search.index');
const calendar = cfURL('service.calendar');
const reports = cfURL('reports');
const documents = cfURL('document');
const serviceCalls = cfURL('service.calls');
const dispatch = cfURL('dispatch.newdash');
const productivity = cfURL('service.newmetrics');
const serviceBilling = cfURL('service.callsPending');
const profile = cfURL('account.editinformation');
const txnAdmin = cfURL('reports.transaction_admin');
const txnUser = cfURL('reports.transactions');
const perdiem = cfURL('reports.perdiem');

export const employeeItems = [
  {
    title: 'Dashboard',
    href: 'https://app.kalosflorida.com/index.cfm',
    icon: <HomeSharp />,
  },
  {
    title: 'Service Calendar',
    href: calendar,
    icon: <CalendarTodaySharp />,
  },
  {
    title: 'Service Call Search',
    href: serviceCalls,
    icon: <EventSharp />,
  },
  {
    title: 'Spiff Log',
    href: (userId: number) => spiffLog(userId),
    icon: <MoneySharp />,
  },
  {
    title: 'Tool Log',
    href: (userId: number) => toolLog(userId),
    icon: <AttachMoneySharp />,
  },
  {
    title: 'Per Diem',
    href: perdiem,
    icon: <PerDiemIcon />,
  },
  {
    title: 'Timesheet',
    href: (userId: number) => timesheet(userId),
    icon: <AccessTimeIcon />,
  },
  {
    title: 'Receipts',
    href: txnUser,
    icon: <ReceiptIcon />,
  },
  {
    type: 'divider',
  },
  {
    title: 'Employee Directory',
    href: employees,
    icon: <PersonSharp />,
  },
  {
    title: 'Customer Directory',
    href: search,
    icon: <SearchSharp />,
  },
];

export const adminItems = [
  {
    title: 'Reports',
    href: reports,
    icon: <MenuBookIcon />,
  },
  {
    title: 'Dispatch',
    href: dispatch,
    icon: <LocationOnIcon />,
  },
  {
    title: 'Kalos Documents',
    href: documents,
    icon: <PictureAsPdfSharpIcon />,
  },
  {
    title: 'Productivity / Metrics',
    href: productivity,
    icon: <BarChartSharp />,
  },
  {
    title: 'Service Billing',
    href: serviceBilling,
    icon: <RoomServiceIcon />,
  },
];

export const managerItems = [
  {
    title: 'Receipt Review',
    href: txnAdmin,
    icon: <ReceiptIcon />,
  },
];

export const commonItems = [
  {
    type: 'divider',
  },
  {
    title: 'Account Info',
    href: profile,
    icon: <AccountCircleIcon />,
  },
  {
    button: true,
    title: 'Report a Bug',
    icon: <BugReportIcon />,
  },
  {
    title: 'Logout',
    href: 'https://app.kalosflorida.com/index.cfm?action=account.logout',
    icon: <ExitToAppIcon />,
  },
];
