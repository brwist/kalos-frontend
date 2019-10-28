import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import HomeSharp from '@material-ui/icons/HomeSharp';
import MoneySharp from '@material-ui/icons/MoneySharp';
import AttachMoneySharp from '@material-ui/icons/AttachMoneySharp';
import SearchSharp from '@material-ui/icons/SearchSharp';
import CalendarViewDaySharp from '@material-ui/icons/CalendarViewDaySharp';
import CalendarTodaySharp from '@material-ui/icons/CalendarTodaySharp';
import PersonSharp from '@material-ui/icons/PersonSharp';
import ReportSharp from '@material-ui/icons/ReportSharp';
import PagesSharp from '@material-ui/icons/PagesSharp';
import MenuSharp from '@material-ui/icons/MenuSharp';
import EventSharp from '@material-ui/icons/EventSharp';
import LocationSearchingSharp from '@material-ui/icons/LocationSearchingSharp';
import AccountCircleIcon from '@material-ui/icons/AccountCircleSharp';
import ExitToAppIcon from '@material-ui/icons/ExitToAppSharp';
import BarChartSharp from '@material-ui/icons/BarChartSharp';
import CssBaseline from '@material-ui/core/CssBaseline';
import { cfURL, BASE_URL } from '../../helpers';

interface props {
  userID: number;
  isAdmin: boolean;
  imgURL: string;
}

export function SideMenu(props: props) {
  const [state, setState] = React.useState({
    isOpen: false,
  });

  const toggleMenu = () => {
    setState({ isOpen: !state.isOpen });
  };

  const spiffLog = cfURL(
    'tasks.spiff_tool_logs',
    `&rt=all&type=spiff&reportUserId=${props.userID}`,
  );
  const toolLog = cfURL(
    'tasks.spiff_tool_logs',
    `&rt=all&type=tool&reportUserId=${props.userID}`,
  );
  const timesheet = cfURL(
    'timesheet.timesheetview',
    `&user_id=${props.userID}&timesheetAction=cardview`,
  );
  const employees = cfURL('user.employee');
  const search = cfURL('search.index');
  const calendar = cfURL('service.calendar');
  const reports = cfURL('reports');
  const documents = cfURL('document');
  const serviceCalls = cfURL('service.calls');
  const dispatch = cfURL('dispatch.dashboard');
  const productivity = cfURL('service.newmetrics');
  const serviceBilling = cfURL('service.callsPending');
  const logout = cfURL('account.logout');
  const profile = cfURL('account.editinformation');
  return (
    <>
      <CssBaseline />

      <Hidden mdDown>
        <Button onClick={toggleMenu}>
          <img
            src={props.imgURL}
            alt="no img"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Button>
      </Hidden>

      <Hidden lgUp>
        <IconButton onClick={toggleMenu} style={{ color: 'white' }}>
          <MenuSharp />
        </IconButton>
      </Hidden>

      <Drawer open={state.isOpen} onClose={toggleMenu}>
        <List>
          <ListItem button href={BASE_URL} component="a">
            <ListItemIcon>
              <HomeSharp />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button href={calendar} component="a">
            <ListItemIcon>
              <CalendarTodaySharp />
            </ListItemIcon>
            <ListItemText primary="Service Calendar" />
          </ListItem>

          <ListItem button href={serviceCalls} component="a">
            <ListItemIcon>
              <EventSharp />
            </ListItemIcon>
            <ListItemText primary="Service Call Search" />
          </ListItem>

          {props.isAdmin && (
            <ListItem button href={dispatch} component="a">
              <ListItemIcon>
                <LocationSearchingSharp />
              </ListItemIcon>
              <ListItemText primary="Dispatch" />
            </ListItem>
          )}

          <ListItem button href={spiffLog} component="a">
            <ListItemIcon>
              <MoneySharp />
            </ListItemIcon>
            <ListItemText primary="Spiff Log" />
          </ListItem>

          <ListItem button href={toolLog} component="a">
            <ListItemIcon>
              <AttachMoneySharp />
            </ListItemIcon>
            <ListItemText primary="Tool Log" />
          </ListItem>

          <ListItem button href={timesheet} component="a">
            <ListItemIcon>
              <CalendarViewDaySharp />
            </ListItemIcon>
            <ListItemText primary="Timesheet" />
          </ListItem>

          <Divider />

          <ListItem button href={employees} component="a">
            <ListItemIcon>
              <PersonSharp />
            </ListItemIcon>
            <ListItemText primary="Employee Directory" />
          </ListItem>

          <ListItem button href={search} component="a">
            <ListItemIcon>
              <SearchSharp />
            </ListItemIcon>
            <ListItemText primary="Customer Directory" />
          </ListItem>

          {props.isAdmin && (
            <ListItem button href={reports} component="a">
              <ListItemIcon>
                <ReportSharp />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          )}

          {props.isAdmin && (
            <ListItem button href={documents} component="a">
              <ListItemIcon>
                <PagesSharp />
              </ListItemIcon>
              <ListItemText primary="Kalos Documents" />
            </ListItem>
          )}

          {props.isAdmin && (
            <ListItem button href={productivity} component="a">
              <ListItemIcon>
                <BarChartSharp />
              </ListItemIcon>
              <ListItemText primary="Productivity / Metrics" />
            </ListItem>
          )}

          {props.isAdmin && (
            <ListItem button href={serviceBilling} component="a">
              <ListItemIcon>
                <PagesSharp />
              </ListItemIcon>
              <ListItemText primary="Service Billing" />
            </ListItem>
          )}

          <Divider />

          <ListItem button href={profile} component="a">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Account Info" />
          </ListItem>

          <ListItem button href={logout} component="a">
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
