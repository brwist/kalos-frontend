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
import MenuBookIcon from '@material-ui/icons/MenuBookSharp';
import CalendarTodaySharp from '@material-ui/icons/CalendarTodaySharp';
import PersonSharp from '@material-ui/icons/PersonSharp';
import PictureAsPdfSharpIcon from '@material-ui/icons/PictureAsPdfSharp';
import ReceiptIcon from '@material-ui/icons/ReceiptSharp';
import MenuSharp from '@material-ui/icons/MenuSharp';
import EventSharp from '@material-ui/icons/EventSharp';
import LocationOnIcon from '@material-ui/icons/LocationOnSharp';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AccountCircleIcon from '@material-ui/icons/AccountCircleSharp';
import ExitToAppIcon from '@material-ui/icons/ExitToAppSharp';
import RoomServiceIcon from '@material-ui/icons/RoomServiceSharp';
import BarChartSharp from '@material-ui/icons/BarChartSharp';
import CssBaseline from '@material-ui/core/CssBaseline';
import { cfURL } from '../../helpers';
import {
  TimesheetDepartmentClient,
  TimesheetDepartment,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';

interface props {
  userID: number;
  imgURL: string;
}

interface state {
  isManager: boolean;
  isOpen: boolean;
  user: User.AsObject;
}

export class SideMenu extends React.PureComponent<props, state> {
  DeptClient: TimesheetDepartmentClient;
  UserClient: UserClient;
  constructor(props: props) {
    super(props);
    this.state = {
      isManager: false,
      user: new User().toObject(),
      isOpen: false,
    };
    const endpoint = 'https://core-dev.kalosflorida.com:8443';
    this.UserClient = new UserClient(endpoint);
    this.DeptClient = new TimesheetDepartmentClient(endpoint);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.getIdentity = this.getIdentity.bind(this);
    this.userManagerCheck = this.userManagerCheck.bind(this);
  }

  toggleMenu() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  async getIdentity() {
    try {
      const req = new User();
      req.setId(this.props.userID);
      const user = await this.UserClient.Get(req);
      this.setState({ user }, this.userManagerCheck);
    } catch (err) {
      console.log(err);
    }
  }

  async userManagerCheck() {
    try {
      if (this.state.user.isSu) {
        this.setState({
          isManager: true,
        });
      } else {
        const dpt = new TimesheetDepartment();
        dpt.setManagerId(this.props.userID);
        const res = await this.DeptClient.Get(dpt);
        if (res.id !== 0) {
          this.setState({
            isManager: true,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidMount() {
    const href = window.location.href;
    if (href.includes('http://')) {
      window.location.href = window.location.href.replace(
        'http://',
        'https://',
      );
    }
    await this.getIdentity();
  }
  render() {
    const spiffLog = cfURL(
      'tasks.spiff_tool_logs',
      `&rt=all&type=spiff&reportUserId=${this.props.userID}`,
    );
    const toolLog = cfURL(
      'tasks.spiff_tool_logs',
      `&rt=all&type=tool&reportUserId=${this.props.userID}`,
    );
    const timesheet = cfURL(
      'timesheet.timesheetview',
      `&user_id=${this.props.userID}&timesheetAction=cardview`,
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

    return (
      <>
        <CssBaseline />
        <Hidden mdDown>
          <Button onClick={this.toggleMenu}>
            <img
              src={this.props.imgURL}
              alt="no img"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Button>
        </Hidden>
        <Hidden lgUp>
          <IconButton onClick={this.toggleMenu} style={{ color: 'white' }}>
            <MenuSharp />
          </IconButton>
        </Hidden>
        <Drawer open={this.state.isOpen} onClose={this.toggleMenu}>
          <List>
            <ListItem
              button
              href="https://app.kalosflorida.com/index.cfm"
              component="a"
            >
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
                <AccessTimeIcon />
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
            {this.state.user.isAdmin === 1 && (
              <>
                <ListItem button href={reports} component="a">
                  <ListItemIcon>
                    <MenuBookIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                </ListItem>
                <ListItem button href={dispatch} component="a">
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dispatch" />
                </ListItem>
                <ListItem button href={documents} component="a">
                  <ListItemIcon>
                    <PictureAsPdfSharpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Kalos Documents" />
                </ListItem>
                <ListItem button href={productivity} component="a">
                  <ListItemIcon>
                    <BarChartSharp />
                  </ListItemIcon>
                  <ListItemText primary="Productivity / Metrics" />
                </ListItem>
                <ListItem button href={serviceBilling} component="a">
                  <ListItemIcon>
                    <RoomServiceIcon />
                  </ListItemIcon>
                  <ListItemText primary="Service Billing" />
                </ListItem>
              </>
            )}
            {this.state.isManager && (
              <ListItem button href={txnAdmin} component="a">
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Receipt Review" />
              </ListItem>
            )}
            <Divider />
            <ListItem button href={profile} component="a">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Account Info" />
            </ListItem>
            <ListItem
              button
              href="https://app.kalosflorida.com/index.cfm?action=account.logout"
              component="a"
            >
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
}
