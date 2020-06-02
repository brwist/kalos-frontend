import React, { useState, useCallback } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ReactDOM from 'react-dom';
import customTheme from '../Theme/main';
import Actions from './Actions/examples';
import AddNewButton from './AddNewButton/examples';
import AdvancedSearch from './AdvancedSearch/examples';
import Button from './Button/examples';
import Calendar from './Calendar/examples';
import CalendarCard from './CalendarCard/examples';
import CalendarColumn from './CalendarColumn/examples';
import CalendarHeader from './CalendarHeader/examples';
import Chart from './Chart/examples';
import Confirm from './Confirm/examples';
import ConfirmDelete from './ConfirmDelete/examples';
import ConfirmService from './ConfirmService/examples';
import CustomControls from './CustomControls/examples';
import CustomerEdit from './CustomerEdit/examples';
import CustomerInformation from './CustomerInformation/examples';
import Documents from './Documents/examples';
import EmployeeDepartments from './EmployeeDepartments/examples';
import Field from './Field/examples';
import FileTags from './FileTags/examples';
import Form from './Form/examples';
import InfoTable from './InfoTable/examples';
import InternalDocuments from './InternalDocuments/examples';
import JobStatusReport from './JobStatusReport/examples';
import Link from './Link/examples';
import Modal from './Modal/examples';
import PerDiem from './PerDiem/examples';
import PlainForm from './PlainForm/examples';
import PrintHeader from './PrintHeader/examples';
import PrintTable from './PrintTable/examples';
import PropertyEdit from './PropertyEdit/examples';
import QuoteSelector from './QuoteSelector/examples';
import Reports from './Reports/examples';
import Search from './Search/examples';
import SectionBar from './SectionBar/examples';
import ServiceCall from './ServiceCall/examples';
import ServiceItemLinks from './ServiceItemLinks/examples';
import ServiceItemReadings from './ServiceItemReadings/examples';
import ServiceItems from './ServiceItems/examples';
import Tabs from './Tabs/examples';
import Tooltip from './Tooltip/examples';
import WeekPicker from './WeekPicker/examples';

const DEFAULT_COMPONENT_IDX = 0;

const COMPONENTS = {
  Actions,
  AddNewButton,
  AdvancedSearch,
  Button,
  Calendar,
  CalendarCard,
  CalendarColumn,
  CalendarHeader,
  Chart,
  Confirm,
  ConfirmDelete,
  ConfirmService,
  CustomControls,
  CustomerEdit,
  CustomerInformation,
  Documents,
  EmployeeDepartments,
  Field,
  FileTags,
  Form,
  InfoTable,
  InternalDocuments,
  JobStatusReport,
  Link,
  Modal,
  PerDiem,
  PlainForm,
  PrintHeader,
  PrintTable,
  PropertyEdit,
  QuoteSelector,
  Reports,
  Search,
  SectionBar,
  ServiceCall,
  ServiceItemLinks,
  ServiceItemReadings,
  ServiceItems,
  Tabs,
  Tooltip,
  WeekPicker,
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  menu: {
    width: 185,
    padding: theme.spacing(),
    backgroundColor: theme.palette.grey[100],
    flexShrink: 0,
  },
  list: {
    marginLeft: theme.spacing(2.5),
    paddingInlineStart: 0,
    ...theme.typography.body2,
    userSelect: 'none',
  },
  item: {
    cursor: 'pointer',
  },
  itemText: {
    padding: theme.spacing(0.5),
  },
  content: {
    padding: theme.spacing(),
    flexGrow: 1,
  },
  select: {
    margin: theme.spacing(),
    outline: 'none',
    background: 'gold',
    height: 30,
    ...theme.typography.body1,
  },
}));

const ComponentsLibrary = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const [component, setComponent] = useState<keyof typeof COMPONENTS>(
    Object.keys(COMPONENTS)[DEFAULT_COMPONENT_IDX] as keyof typeof COMPONENTS,
  );
  const Component = COMPONENTS[component];
  const handleClickMenuItem = useCallback(v => () => setComponent(v), [
    setComponent,
  ]);
  const handleSelect = useCallback(
    ({ target: { value } }) => setComponent(value),
    [setComponent],
  );
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <div className={classes.wrapper}>
        {matches ? (
          <select
            className={classes.select}
            value={component}
            onChange={handleSelect}
          >
            {Object.keys(COMPONENTS).map(key => (
              <option key={key}>{key}</option>
            ))}
          </select>
        ) : (
          <div className={classes.menu}>
            <Typography variant="h6">Components Library</Typography>
            <ol className={classes.list}>
              {Object.keys(COMPONENTS).map(key => (
                <li
                  key={key}
                  className={classes.item}
                  onClick={handleClickMenuItem(key)}
                >
                  <div
                    className={classes.itemText}
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
        <div className={classes.content}>
          <Component />
        </div>
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<ComponentsLibrary />, document.getElementById('root'));
