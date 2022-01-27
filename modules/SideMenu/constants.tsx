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
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AssignmentIcon from '@material-ui/icons/AssessmentOutlined';
import EventSharp from '@material-ui/icons/EventSharp';
import LocationOnIcon from '@material-ui/icons/LocationOnSharp';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AccountCircleIcon from '@material-ui/icons/AccountCircleSharp';
import ExitToAppIcon from '@material-ui/icons/ExitToAppSharp';
import RoomServiceIcon from '@material-ui/icons/RoomServiceSharp';
import BarChartSharp from '@material-ui/icons/BarChartSharp';
import BugReportIcon from '@material-ui/icons/BugReport';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import AddPhotoIcon from '@material-ui/icons/AddAPhoto';
import { cfURL, CustomEventsHandler } from '../../helpers';
import React from 'react';
import { AssessmentOutlined } from '@material-ui/icons';

export type MenuItem = {
  type?: string;
  title?: string;
  button?: boolean;
  onClick?: () => void;
  href?: string | ((userId: number) => string);
  target?: string;
  icon?: JSX.Element;
};

const spiffLog = (userId: number) =>
  cfURL('tasks.spiff_tool_logs', `&rt=all&type=spiff&reportUserId=${userId}`);
const toolLog = (userId: number) =>
  cfURL('tasks.spiff_tool_logs', `&rt=all&type=tool&reportUserId=${userId}`);
const timesheet = (userId: number) =>
  cfURL('timesheet.timesheetview_new', `&user_id=${userId}`);
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
const payroll = cfURL('reports.payroll');
const accountsPayable = cfURL('reports.transaction_billing');
export const employeeItems = ({
  toggleUploadReceipt,
}: {
  toggleUploadReceipt: () => void;
}): MenuItem[] => [
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
    title: 'Upload Photo',
    icon: <AddPhotoIcon />,
    onClick: toggleUploadReceipt,
    button: true,
  },
  {
    title: 'Receipts',
    href: txnUser,
    icon: <ReceiptIcon />,
  },
  {
    title: 'Accounts Payable',
    href: accountsPayable,
    icon: <AccountBalanceIcon />,
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

export const adminItems: MenuItem[] = [
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
    title: 'Payroll Dashboard',
    href: payroll,
    icon: <AssessmentOutlined />,
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

export const managerItems: MenuItem[] = [
  {
    title: 'Receipt Review',
    href: txnAdmin,
    icon: <ReceiptIcon />,
  },
];

const logoutItem: MenuItem = {
  title: 'Logout',
  href: 'https://app.kalosflorida.com/index.cfm?action=account.logout',
  icon: <ExitToAppIcon />,
};

export const customerItems = (toggleMenu: () => void): MenuItem[] => [
  {
    title: 'Edit Account',
    icon: <AccountCircleIcon />,
    button: true,
    onClick: () => {
      CustomEventsHandler.emit('EditCustomer');
      toggleMenu();
    },
  },
  {
    title: 'Add Property',
    icon: <HomeWorkIcon />,
    button: true,
    onClick: () => {
      CustomEventsHandler.emit('AddProperty');
      toggleMenu();
    },
  },
  {
    title: 'Add Service Call',
    button: true,
    icon: <EventSharp />,
    onClick: () => {
      CustomEventsHandler.emit('AddServiceCall');
      toggleMenu();
    },
  },
  {
    title: 'Documents',
    button: true,
    icon: <ImportContactsIcon />,
    onClick: () => {
      CustomEventsHandler.emit('ShowDocuments');
      toggleMenu();
    },
  },
  {
    title: 'Contact Us',
    icon: <ContactPhoneIcon />,
    href: 'http://www.kalosflorida.com/contact/',
    target: '_blank',
  },
  logoutItem,
];

export const commonItems: MenuItem[] = [
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
  logoutItem,
];
