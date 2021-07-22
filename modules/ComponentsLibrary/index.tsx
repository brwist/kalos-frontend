import React, { useState, useCallback } from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ReactDOM from 'react-dom';
import { StyledPage } from '../PageWrapper/styled';
import Actions from './Actions/examples';
import ActivityLogReport from './ActivityLogReport/examples';
import AddLog from './AddLog/examples';
import AddNewButton from './AddNewButton/examples';
import AdvancedSearch from './AdvancedSearch/examples';
import Alert from './Alert/examples';
import BillingAuditReport from './BillingAuditReport/examples';
import Button from './Button/examples';
import Calendar from './Calendar/examples';
import CalendarCard from './CalendarCard/examples';
import CalendarColumn from './CalendarColumn/examples';
import CalendarEvents from './CalendarEvents/examples';
import CalendarHeader from './CalendarHeader/examples';
import CallbackReport from './CallbackReport/examples';
import CharityReport from './CharityReport/examples';
import Chart from './Chart/examples';
import CheckInProjectTask from './CheckInProjectTask/examples';
import CompareTransactions from './CompareTransactions/examples';
import Confirm from './Confirm/examples';
import ConfirmDelete from './ConfirmDelete/examples';
import ConfirmService from './ConfirmService/examples';
import CostReport from './CostReport/examples';
import CostReportForEmployee from './CostReportForEmployee/examples';
import CostSummary from './CostSummary/examples';
import CustomControls from './CustomControls/examples';
import CustomerAccountDashboard from './CustomerAccountDashboard/examples';
import CustomerEdit from './CustomerEdit/examples';
import CustomerInformation from './CustomerInformation/examples';
import DeletedServiceCallsReport from './DeletedServiceCallsReport/examples';
import Documents from './Documents/examples';
import EditProject from './EditProject/examples';
import EditTransaction from './EditTransaction/examples';
import EmployeeDepartments from './EmployeeDepartments/examples';
import EventsReport from './EventsReport/examples';
import ExportJSON from './ExportJSON/examples';
import Field from './Field/examples';
import FileGallery from './FileGallery/examples';
import FileTags from './FileTags/examples';
import Form from './Form/examples';
import Gallery from './Gallery/examples';
import GanttChart from './GanttChart/examples';
import ImagePreview from './ImagePreview/examples';
import InfoTable from './InfoTable/examples';
import InternalDocuments from './InternalDocuments/examples';
import Link from './Link/examples';
import LodgingByZipCode from './LodgingByZipCode/examples';
import ManagerTimeoffs from './ManagerTimeoffs/examples';
import MergeTable from './MergeTable/examples';
import Modal from './Modal/examples';
import Payroll from './Payroll/examples';
import PDFInvoice from './PDFInvoice/examples';
import PDFMaker from './PDFMaker/examples';
import PerDiem from './PerDiem/examples';
import PerDiemsNeedsAuditing from './PerDiemsNeedsAuditing/examples';
import PerformanceMetrics from './PerformanceMetrics/examples';
import PlaceAutocompleteAddressForm from './PlaceAutocompleteAddressForm/examples';
import PlainForm from './PlainForm/examples';
import PrintFooter from './PrintFooter/examples';
import PrintHeader from './PrintHeader/examples';
import PrintList from './PrintList/examples';
import PrintPage from './PrintPage/examples';
import PrintPageBreak from './PrintPageBreak/examples';
import PrintParagraph from './PrintParagraph/examples';
import PrintTable from './PrintTable/examples';
import ProjectDetail from './ProjectDetail/examples';
import Projects from './Projects/examples';
import PromptPaymentReport from './PromptPaymentReport/examples';
import PropertyEdit from './PropertyEdit/examples';
import QuoteSelector from './QuoteSelector/examples';
import Reports from './Reports/examples';
import RotatedImage from './RotatedImage/examples';
import Search from './Search/examples';
import SectionBar from './SectionBar/examples';
import ServiceCall from './ServiceCall/examples';
import ServiceCallMetrics from './ServiceCallMetrics/examples';
import ServiceCallMetricsGraph from './ServiceCallMetricsGraph/examples';
import ServiceItemLinks from './ServiceItemLinks/examples';
import ServiceItemReadings from './ServiceItemReadings/examples';
import ServiceItems from './ServiceItems/examples';
import SkeletonCard from './SkeletonCard/examples';
import SlackMessageButton from './SlackMessageButton/examples';
import SpiffReport from './SpiffReport/examples';
import SpiffToolLogEdit from './SpiffToolLogEdit/examples';
import StoredQuotes from './StoredQuotes/examples';
import Tabs from './Tabs/examples';
import Tasks from './Tasks/examples';
import TimeOff from './TimeOff/examples';
import TimeoffSummaryReport from './TimeoffSummaryReport/examples';
import Timesheet from './Timesheet/examples';
import Tooltip from './Tooltip/examples';
import TransactionTable from './TransactionTable/examples';
import TripInfoTable from './TripInfoTable/examples';
import TripSummary from './TripSummary/examples';
import TripSummaryNew from './TripSummaryNew/examples';
import TripViewModal from './TripViewModal/examples';
import UploadPhoto from './UploadPhoto/examples';
import UploadPhotoTransaction from './UploadPhotoTransaction/examples';
import WarrantyReport from './WarrantyReport/examples';
import WeekPicker from './WeekPicker/examples';

import './styles.less';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const DEFAULT_COMPONENT_IDX = 0;

const COMPONENTS = {
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

const ComponentsLibrary = () => {
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
      <div className="ComponentsLibrary">
        {matches ? (
          <select
            className="ComponentsLibrarySelect"
            value={component}
            onChange={handleSelect}
          >
            {Object.keys(COMPONENTS).map(key => (
              <option key={key}>{key}</option>
            ))}
          </select>
        ) : (
          <div className="ComponentsLibraryMenu">
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
        <div className="ComponentsLibraryContent">
          <Component />
        </div>
      </div>
    </StyledPage>
  );
};
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(<ComponentsLibrary />, document.getElementById('root'));
});
