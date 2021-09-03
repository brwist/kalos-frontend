/* eslint-disable linebreak-style */
import React, { useState, useCallback } from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ReactDOM from 'react-dom';
import { StyledPage } from './modules/PageWrapper/styled';
import Dashboard from './modules/Dashboard/index';
import LoginForm  from './App';

import Actions from './modules/ComponentsLibrary/Actions/examples';
import ActivityLogReport from './modules/ComponentsLibrary/ActivityLogReport/examples';
import AddLog from './modules/ComponentsLibrary/AddLog/examples';
import AddNewButton from './modules/ComponentsLibrary/AddNewButton/examples';
import AdvancedSearch from './modules/ComponentsLibrary/AdvancedSearch/examples';
import Alert from './modules/ComponentsLibrary/Alert/examples';
import BillingAuditReport from './modules/ComponentsLibrary/BillingAuditReport/examples';
import Button from './modules/ComponentsLibrary/Button/examples';
import Calendar from './modules/ComponentsLibrary/Calendar/examples';
import CalendarCard from './modules/ComponentsLibrary/CalendarCard/examples';
import CalendarColumn from './modules/ComponentsLibrary/CalendarColumn/examples';
import CalendarEvents from './modules/ComponentsLibrary/CalendarEvents/examples';
import CalendarHeader from './modules/ComponentsLibrary/CalendarHeader/examples';
import CallbackReport from './modules/ComponentsLibrary/CallbackReport/examples';
import CharityReport from './modules/ComponentsLibrary/CharityReport/examples';
import Chart from './modules/ComponentsLibrary/Chart/examples';
import CheckInProjectTask from './modules/ComponentsLibrary/CheckInProjectTask/examples';
import CompareTransactions from './modules/ComponentsLibrary/CompareTransactions/examples';
import Confirm from './modules/ComponentsLibrary/Confirm/examples';
import ConfirmDelete from './modules/ComponentsLibrary/ConfirmDelete/examples';
import ConfirmService from './modules/ComponentsLibrary/ConfirmService/examples';
import CostReport from './modules/ComponentsLibrary/CostReport/examples';
import CostReportForEmployee from './modules/ComponentsLibrary/CostReportForEmployee/examples';
import CostSummary from './modules/ComponentsLibrary/CostSummary/examples';
import CustomControls from './modules/ComponentsLibrary/CustomControls/examples';
import CustomerAccountDashboard from './modules/ComponentsLibrary/CustomerAccountDashboard/examples';
import CustomerEdit from './modules/ComponentsLibrary/CustomerEdit/examples';
import CustomerInformation from './modules/ComponentsLibrary/CustomerInformation/examples';
import DeletedServiceCallsReport from './modules/ComponentsLibrary/DeletedServiceCallsReport/examples';
import Documents from './modules/ComponentsLibrary/Documents/examples';
import EditProject from './modules/ComponentsLibrary/EditProject/examples';
import EditTransaction from './modules/ComponentsLibrary/EditTransaction/examples';
import EmployeeDepartments from './modules/ComponentsLibrary/EmployeeDepartments/examples';
import ErrorBoundary from './modules/ComponentsLibrary/ErrorBoundary/examples';
import EventsReport from './modules/ComponentsLibrary/EventsReport/examples';
import ExportJSON from './modules/ComponentsLibrary/ExportJSON/examples';
import Field from './modules/ComponentsLibrary/Field/examples';
import FileGallery from './modules/ComponentsLibrary/FileGallery/examples';
import FileTags from './modules/ComponentsLibrary/FileTags/examples';
import Form from './modules/ComponentsLibrary/Form/examples';
import Gallery from './modules/ComponentsLibrary/Gallery/examples';
import GanttChart from './modules/ComponentsLibrary/GanttChart/examples';
import ImagePreview from './modules/ComponentsLibrary/ImagePreview/examples';
import InfoTable from './modules/ComponentsLibrary/InfoTable/examples';
import InternalDocuments from './modules/ComponentsLibrary/InternalDocuments/examples';
import Link from './modules/ComponentsLibrary/Link/examples';
import LodgingByZipCode from './modules/ComponentsLibrary/LodgingByZipCode/examples';
import ManagerTimeoffs from './modules/ComponentsLibrary/ManagerTimeoffs/examples';
import MergeTable from './modules/ComponentsLibrary/MergeTable/examples';
import Modal from './modules/ComponentsLibrary/Modal/examples';
import Payroll from './modules/ComponentsLibrary/Payroll/examples';
import PDFInvoice from './modules/ComponentsLibrary/PDFInvoice/examples';
import PDFMaker from './modules/ComponentsLibrary/PDFMaker/examples';
import PerDiem from './modules/ComponentsLibrary/PerDiem/examples';
import PerDiemsNeedsAuditing from './modules/ComponentsLibrary/PerDiemsNeedsAuditing/examples';
import PerformanceMetrics from './modules/ComponentsLibrary/PerformanceMetrics/examples';
import PlaceAutocompleteAddressForm from './modules/ComponentsLibrary/PlaceAutocompleteAddressForm/examples';
import PlainForm from './modules/ComponentsLibrary/PlainForm/examples';
import PrintFooter from './modules/ComponentsLibrary/PrintFooter/examples';
import PrintHeader from './modules/ComponentsLibrary/PrintHeader/examples';
import PrintList from './modules/ComponentsLibrary/PrintList/examples';
import PrintPage from './modules/ComponentsLibrary/PrintPage/examples';
import PrintPageBreak from './modules/ComponentsLibrary/PrintPageBreak/examples';
import PrintParagraph from './modules/ComponentsLibrary/PrintParagraph/examples';
import PrintTable from './modules/ComponentsLibrary/PrintTable/examples';
import ProjectDetail from './modules/ComponentsLibrary/ProjectDetail/examples';
import Projects from './modules/ComponentsLibrary/Projects/examples';
import PromptPaymentReport from './modules/ComponentsLibrary/PromptPaymentReport/examples';
import PropertyEdit from './modules/ComponentsLibrary/PropertyEdit/examples';
import QuoteSelector from './modules/ComponentsLibrary/QuoteSelector/examples';
import Reports from './modules/ComponentsLibrary/Reports/examples';
import RotatedImage from './modules/ComponentsLibrary/RotatedImage/examples';
import Search from './modules/ComponentsLibrary/Search/examples';
import SectionBar from './modules/ComponentsLibrary/SectionBar/examples';
import ServiceCall from './modules/ComponentsLibrary/ServiceCall/examples';
import ServiceCallMetrics from './modules/ComponentsLibrary/ServiceCallMetrics/examples';
import ServiceCallMetricsGraph from './modules/ComponentsLibrary/ServiceCallMetricsGraph/examples';
import ServiceItemLinks from './modules/ComponentsLibrary/ServiceItemLinks/examples';
import ServiceItemReadings from './modules/ComponentsLibrary/ServiceItemReadings/examples';
import ServiceItems from './modules/ComponentsLibrary/ServiceItems/examples';
import SkeletonCard from './modules/ComponentsLibrary/SkeletonCard/examples';
import SlackMessageButton from './modules/ComponentsLibrary/SlackMessageButton/examples';
import SpiffReport from './modules/ComponentsLibrary/SpiffReport/examples';
import SpiffToolLogEdit from './modules/ComponentsLibrary/SpiffToolLogEdit/examples';
import StoredQuotes from './modules/ComponentsLibrary/StoredQuotes/examples';
import Tabs from './modules/ComponentsLibrary/Tabs/examples';
import Tasks from './modules/ComponentsLibrary/Tasks/examples';
import Teams from './modules/ComponentsLibrary/Teams/examples';
import Test from './modules/ComponentsLibrary/Test/examples';
import TimeOff from './modules/ComponentsLibrary/TimeOff/examples';
import TimeoffSummaryReport from './modules/ComponentsLibrary/TimeoffSummaryReport/examples';
import Timesheet from './modules/ComponentsLibrary/Timesheet/examples';
import Tooltip from './modules/ComponentsLibrary/Tooltip/examples';
import TransactionTable from './modules/ComponentsLibrary/TransactionTable/examples';
import TripInfoTable from './modules/ComponentsLibrary/TripInfoTable/examples';
import TripSummary from './modules/ComponentsLibrary/TripSummary/examples';
import TripSummaryNew from './modules/ComponentsLibrary/TripSummaryNew/examples';
import TripViewModal from './modules/ComponentsLibrary/TripViewModal/examples';
import UploadPhoto from './modules/ComponentsLibrary/UploadPhoto/examples';
import UploadPhotoTransaction from './modules/ComponentsLibrary/UploadPhotoTransaction/examples';
import WarrantyReport from './modules/ComponentsLibrary/WarrantyReport/examples';
import WeekPicker from './modules/ComponentsLibrary/WeekPicker/examples';

import './modules/ComponentsLibrary/styles.less';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from './constants';

const DEFAULT_COMPONENT_IDX = 0;

const COMPONENTS = {
  Dashboard,
  LoginForm,
  Actions,
  ActivityLogReport,
  AddLog,
  AddNewButton,
  AdvancedSearch,
  Alert,
  BillingAuditReport,
  Button,
  Calendar,
  CalendarCard,
  CalendarColumn,
  CalendarEvents,
  CalendarHeader,
  CallbackReport,
  CharityReport,
  Chart,
  CheckInProjectTask,
  CompareTransactions,
  Confirm,
  ConfirmDelete,
  ConfirmService,
  CostReport,
  CostReportForEmployee,
  CostSummary,
  CustomControls,
  CustomerAccountDashboard,
  CustomerEdit,
  CustomerInformation,
  DeletedServiceCallsReport,
  Documents,
  EditProject,
  EditTransaction,
  EmployeeDepartments,
  ErrorBoundary,
  EventsReport,
  ExportJSON,
  Field,
  FileGallery,
  FileTags,
  Form,
  Gallery,
  GanttChart,
  ImagePreview,
  InfoTable,
  InternalDocuments,
  Link,
  LodgingByZipCode,
  ManagerTimeoffs,
  MergeTable,
  Modal,
  Payroll,
  PDFInvoice,
  PDFMaker,
  PerDiem,
  PerDiemsNeedsAuditing,
  PerformanceMetrics,
  PlaceAutocompleteAddressForm,
  PlainForm,
  PrintFooter,
  PrintHeader,
  PrintList,
  PrintPage,
  PrintPageBreak,
  PrintParagraph,
  PrintTable,
  ProjectDetail,
  Projects,
  PromptPaymentReport,
  PropertyEdit,
  QuoteSelector,
  Reports,
  RotatedImage,
  Search,
  SectionBar,
  ServiceCall,
  ServiceCallMetrics,
  ServiceCallMetricsGraph,
  ServiceItemLinks,
  ServiceItemReadings,
  ServiceItems,
  SkeletonCard,
  SlackMessageButton,
  SpiffReport,
  SpiffToolLogEdit,
  StoredQuotes,
  Tabs,
  Tasks,
  Teams,
  Test,
  TimeOff,
  TimeoffSummaryReport,
  Timesheet,
  Tooltip,
  TransactionTable,
  TripInfoTable,
  TripSummary,
  TripSummaryNew,
  TripViewModal,
  UploadPhoto,
  UploadPhotoTransaction,
  WarrantyReport,
  WeekPicker,
};

const u = new UserClient(ENDPOINT);

const App = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const [component, setComponent] = useState<keyof typeof COMPONENTS>(
    Object.keys(COMPONENTS)[DEFAULT_COMPONENT_IDX] as keyof typeof COMPONENTS,
  );
  const Component = COMPONENTS[component];
  const handleClickMenuItem = useCallback(
    v => () => setComponent(v),
    [setComponent],
  );
  const handleSelect = useCallback(
    ({ target: { value } }) => setComponent(value),
    [setComponent],
  );
  return (
    <StyledPage>
      <div className="App">
        {matches ? (
          <select
            className="AppSelect"
            value={component}
            onChange={handleSelect}
          >
            {Object.keys(COMPONENTS).map(key => (
              <option key={key}>{key}</option>
            ))}
          </select>
        ) : (
          <div className="AppMenu">
            <div className="h6">Components Library</div>
            <ol className="ComponentsLibraryList">
              {Object.keys(COMPONENTS).map(key => (
                <li
                  key={key}
                  className="ComponentsLibraryItem"
                  onClick={handleClickMenuItem(key)}
                >
                  <div
                    className="ComponentsLibraryItemText"
                    style={{
                      backgroundColor:
                        key === component ? 'gold' : 'transparent',
                    }}
                  >
                    {key}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
        <div className="AppContent">
          <Component />
        </div>
      </div>
    </StyledPage>
  );
};
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
