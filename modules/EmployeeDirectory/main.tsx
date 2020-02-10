import React, { SyntheticEvent, ChangeEvent } from 'react';
import BuildIcon from '@material-ui/icons/BuildSharp';
import ScheduleIcon from '@material-ui/icons/ScheduleSharp';
import EditIcon from '@material-ui/icons/EditSharp';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/CloseSharp';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import ReactPDF from '@react-pdf/renderer';
import { EmployeePDF } from './pdf'; // use ./ for local imports
import Tooltip from '@material-ui/core/Tooltip';
import GroupIcon from '@material-ui/icons/Group';
import AddIcon from '@material-ui/icons/Add';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { DepartmentPicker } from '../Pickers/Department';
import {
  TimesheetDepartment,
  TimesheetDepartmentClient,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';

interface props {
  userId: number;
}

interface state {
  selectedUserId: number;
  users: User.AsObject[];
  user: User.AsObject;
  timeSheetDepartments: TimesheetDepartment.AsObject[];
  totalUsers: number;
  isModalOpen: boolean;
  searchString: string;
  showInactive: boolean;
  departmentID: number;
}

export class EmployeeDirectory extends React.Component<props, state> {
  UserClient: UserClient;
  TimesheetDepartmentClient: TimesheetDepartmentClient;
  constructor(props: props) {
    super(props);
    this.state = {
      selectedUserId: 0,
      users: [],
      user: new User().toObject(),
      totalUsers: 0,
      departmentID: 0,
      isModalOpen: false,
      timeSheetDepartments: [],
      searchString: '',
      showInactive: false,
    };
    this.TimesheetDepartmentClient = new TimesheetDepartmentClient(
      0,
      'https://core-dev.kalosflorida.com:8443',
    );
    this.UserClient = new UserClient(
      0,
      'https://core-dev.kalosflorida.com:8443',
    );
    this.addUser = this.addUser.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.saveAsPDF = this.saveAsPDF.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleshowInactive = this.toggleshowInactive.bind(this);
    this.updateDepartment = this.updateDepartment.bind(this);
  }

  handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const searchString = event.currentTarget.value;
    this.setState(() => ({
      searchString,
    }));
  }; //textfield needs this onchnge handler

  toggleModal(e: SyntheticEvent<HTMLElement>) {
    const selectedUserId = parseInt(e.currentTarget.id.split('-')[0]);
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
      selectedUserId,
    }));
  }
  toggleshowInactive() {
    this.setState(prevState => ({
      showInactive: !prevState.showInactive,
    }));
  }
  addUser(user: User.AsObject) {
    this.setState(prevState => ({
      users: [...prevState.users, user],
    }));
  }
  //timesheet department
  /**
   * Fetches currently logged in user
   */
  async fetchUser() {
    const req = new User();
    req.setId(this.props.userId);
    const user = await this.UserClient.Get(req);
    this.setState({ user });
  }

  async fetchDepartment() {
    const req = new TimesheetDepartment();
    req.setIsActive(1);
    const result = await this.TimesheetDepartmentClient.BatchGet(req);
    this.setState({ timeSheetDepartments: result.toObject().resultsList });
  }

  async fetchUsers() {
    const req = new User();
    req.setIsActive(0);
    req.setIsEmployee(1);
    const count = (await this.UserClient.BatchGet(req)).getTotalCount();
    this.setState({ totalUsers: count }, () => {
      this.UserClient.List(req, this.addUser);
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  async saveAsPDF() {
    const blob = await ReactPDF.pdf(
      <EmployeePDF users={this.state.users} />,
    ).toBlob();
    const el = document.createElement('a');
    el.download = 'employee_directory.pdf';
    el.href = URL.createObjectURL(blob); //'http://app.kalosflorida.com/index.cfm?action=admin:user.contact_list_pdf';
    el.target = '_blank';
    el.click();
    el.remove();
  }

  updateDepartment(ID: number) {
    this.setState({
      departmentID: ID,
    });
  }

  async componentDidMount() {
    await this.UserClient.GetToken('test', 'test');
    await this.fetchUser();
    await this.fetchDepartment();
    this.fetchUsers();
  }

  shouldComponentUpdate(nextProps: props, nextState: state) {
    if (nextState.users.length !== nextState.totalUsers) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const searchUsers = makeSearchUsers(this.state.searchString.toLowerCase());
    let users = this.state.users
      .sort(sortUsers)
      .filter(user => {
        if (this.state.showInactive) {
          return user.isActive === 0;
        } else return user.isActive === 1;
      })
      .filter(searchUsers);
    //if (this.state.searchString.length >= 3) {
    //  users = users.filter(searchUsers);
    //}
    if (this.state.departmentID) {
      users = users.filter(
        user => user.employeeDepartmentId === this.state.departmentID,
      );
    }
    const selectedUser = this.state.users.find(
      user => user.id === this.state.selectedUserId,
    );

    let department:
      | TimesheetDepartment.AsObject
      | undefined = new TimesheetDepartment().toObject();
    if (selectedUser) {
      department = this.state.timeSheetDepartments.find(
        dept => dept.id === selectedUser!.employeeDepartmentId,
      );
    }

    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        <CssBaseline />
        <Grid container direction="column" alignItems="center" justify="center">
          {this.state.users.length === 0 && (
            <CircularProgress style={{ position: 'absolute', top: '50%' }} />
          )}

          <Toolbar
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              width: '90%',
            }}
          >
            <span>
              <Tooltip title="Download as PDF">
                <IconButton
                  onClick={this.saveAsPDF}
                  style={{ marginBottom: '10px' }}
                >
                  <PdfIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Employee Group">
                <IconButton
                  href="https://app.kalosflorida.com/index.cfm?action=admin:user.employeedept"
                  style={{ marginBottom: '10px' }}
                >
                  <GroupIcon />
                </IconButton>
              </Tooltip>

              {this.state.user.isAdmin === 1 && (
                <Tooltip title="Add Employee">
                  <IconButton
                    href="https://app.kalosflorida.com/index.cfm?action=admin:user.edit"
                    style={{ marginBottom: '10px' }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Employee Detail">
                <IconButton
                  href="https://app.kalosflorida.com/index.cfm?action=admin:user.employees_detail"
                  style={{ marginBottom: '10px' }}
                >
                  <ImportContactsIcon />
                </IconButton>
              </Tooltip>
            </span>
            <TextField
              label="Search Employees"
              onChange={this.handleInputChange}
              style={{ marginBottom: '10px' }}
            />

            <DepartmentPicker
              label="Filter by Department"
              onSelect={this.updateDepartment}
              selected={this.state.departmentID}
            />
            {/*<FormControlLabel
              control={
                <Switch
                  checked={this.state.showInactive}
                  onChange={this.toggleshowInactive}
                  value="Inactives"
                  color="primary"
                />
              }
              label={'Show Inactive'}
            />*/}
          </Toolbar>

          {this.state.users.length !== 0 && (
            <Paper style={{ width: '90%' }} elevation={7}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Last Name</TableCell>
                    <TableCell align="center">First Name</TableCell>
                    {this.state.user.isAdmin === 1 && (
                      <TableCell align="center"></TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow hover key={`${user.id}-${user.lastname}-trow`}>
                      <TableCell
                        id={`${user.id}-lastname`}
                        onClick={this.toggleModal}
                        align="center"
                      >
                        {user.lastname}
                      </TableCell>
                      <TableCell
                        id={`${user.id}-firstname`}
                        onClick={this.toggleModal}
                        align="center"
                      >
                        {user.firstname}
                      </TableCell>
                      {this.state.user.isAdmin === 1 && (
                        <TableCell align="center">
                          <Tooltip title="View Spiff Log" placement="top">
                            <IconButton
                              target="_blank"
                              href={`https://app.kalosflorida.com/index.cfm?action=admin:tasks.spiff_tool_logs&type=tool&rt=all&reportUserId=${user.id}`}
                            >
                              <BuildIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Timesheet" placement="top">
                            <IconButton
                              target="_blank"
                              href={`https://app.kalosflorida.com/index.cfm?action=admin:timesheet.timesheetview&timesheetAction=cardview&user_id=${user.id}&search_user_id=${user.id}&timesheetadmin=${this.state.user.isAdmin}`}
                            >
                              <ScheduleIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit User" placement="top">
                            <IconButton
                              target="_blank"
                              href={`https://app.kalosflorida.com/index.cfm?action=admin:user.edit&id=${user.id}`}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
          {selectedUser && (
            <Dialog
              open={this.state.isModalOpen}
              fullScreen
              onClose={this.toggleModal}
            >
              <Grid container direction="column" alignItems="center">
                <IconButton
                  style={{ alignSelf: 'stretch' }}
                  onClick={this.toggleModal}
                >
                  <CloseIcon />
                </IconButton>
                <Avatar src="https://app.kalosflorida.com/app/assets/images/user-icon.png" />
                <List>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Email"
                      primaryTypographyProps={{ variant: 'h6' }}
                      secondaryTypographyProps={{ variant: 'h4' }}
                      secondary={selectedUser.email}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ variant: 'h6' }}
                      secondaryTypographyProps={{ variant: 'h4' }}
                      primary="First Name"
                      secondary={selectedUser.firstname}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ variant: 'h6' }}
                      secondaryTypographyProps={{ variant: 'h4' }}
                      primary="Last Name"
                      secondary={selectedUser.lastname}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ variant: 'h6' }}
                      secondaryTypographyProps={{ variant: 'h4' }}
                      primary="Phone Number"
                      secondary={selectedUser.phone}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Title"
                      primaryTypographyProps={{ variant: 'h6' }}
                      secondaryTypographyProps={{ variant: 'h4' }}
                      secondary={selectedUser.empTitle}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Manager"
                      primaryTypographyProps={{ variant: 'h6' }}
                      secondaryTypographyProps={{ variant: 'h4' }}
                      secondary={department ? department.description : ''}
                    />
                  </ListItem>
                  <Divider />
                </List>
              </Grid>
            </Dialog>
          )}
        </Grid>
      </ThemeProvider>
    );
  }
}

function sortUsers(a: User.AsObject, b: User.AsObject) {
  return `${a.lastname} ${a.firstname}`.localeCompare(
    `${b.lastname} ${b.firstname}`,
  );
}

function makeSearchUsers(searchString: string) {
  return (user: User.AsObject) => {
    return (
      `${user.lastname} ${user.firstname}`
        .toLowerCase()
        .includes(searchString) ||
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchString)
    );
  };
}
