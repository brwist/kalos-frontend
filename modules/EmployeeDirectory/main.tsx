import React, { SyntheticEvent, ChangeEvent } from "react";
import BuildIcon from "@material-ui/icons/BuildSharp";
import ScheduleIcon from "@material-ui/icons/ScheduleSharp";
import EditIcon from "@material-ui/icons/EditSharp";
import { User, UserClient } from "@kalos-core/kalos-rpc/User";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/CloseSharp";
import ReactPDF, { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import PdfIcon from "@material-ui/icons/PictureAsPdf";
import { EmployeePDF } from "./pdf"; // use ./ for local imports
import Tooltip from "@material-ui/core/Tooltip";
import GroupIcon from "@material-ui/icons/Group";
import AddIcon from "@material-ui/icons/Add";

import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import {
  IconButton,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  ButtonGroup,
  Grid,
  Dialog,
  Divider,
  Avatar,
  ListItem,
  List,
  ListItemText,
  TextField,
  Toolbar,
  Switch,
  FormControlLabel
} from "@material-ui/core";
import {
  TimesheetDepartment,
  TimesheetDepartmentClient
} from "@kalos-core/kalos-rpc/TimesheetDepartment";
import { UserService } from "@kalos-core/kalos-rpc/compiled-protos/user_pb_service";

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
      isModalOpen: false,
      timeSheetDepartments: [],
      searchString: "",
      showInactive: false
    };
    this.TimesheetDepartmentClient = new TimesheetDepartmentClient(
      "https://core-dev.kalosflorida.com:8443"
    );
    this.UserClient = new UserClient("https://core-dev.kalosflorida.com:8443");
    this.addUser = this.addUser.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.saveAsPDF = this.saveAsPDF.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleshowInactive = this.toggleshowInactive.bind(this);
  }

  handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const searchString = event.currentTarget.value;
    this.setState(() => ({
      searchString
    }));
  }; //textfield needs this onchnge handler

  toggleModal(e: SyntheticEvent<HTMLElement>) {
    const selectedUserId = parseInt(e.currentTarget.id);
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
      selectedUserId
    }));
  }
  toggleshowInactive() {
    this.setState(prevState => ({
      showInactive: !prevState.showInactive
    }));
  }
  addUser(user: User.AsObject) {
    this.setState(prevState => ({
      users: [...prevState.users, user]
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
    const tab = window.open(url, "_blank");
    try {
      tab!.focus();
    } catch (err) {
      console.log(err);
    }
  }

  async saveAsPDF() {
    const doc = await pdf(<EmployeePDF users={this.state.users} />).toBlob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(doc);
    link.download = "directory.pdf";
    document.body.append(link);
    link.click();
    link.remove();
  }

  async componentDidMount() {
    await this.UserClient.GetToken("test", "test");
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
  //{this.state.users.length === 0 && <CircularProgress />}
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
    const selectedUser = this.state.users.find(
      user => user.id === this.state.selectedUserId
    );

    let department:
      | TimesheetDepartment.AsObject
      | undefined = new TimesheetDepartment().toObject();
    if (selectedUser) {
      department = this.state.timeSheetDepartments.find(
        dept => dept.id === selectedUser!.employeeDepartmentId
      );
    }

    return (
      <Grid container direction="column" alignItems="center" justify="center">
        {this.state.users.length === 0 && (
          <CircularProgress style={{ position: "absolute", top: "50%" }} />
        )}

        <Toolbar>
          <Tooltip title="Download as PDF">
            <IconButton onClick={this.saveAsPDF}>
              <PdfIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Employee Group">
            <IconButton href=" https://app.kalosflorida.com/index.cfm?action=admin:user.employeedept">
              <GroupIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Employee">
            <IconButton href=" https://app.kalosflorida.com/index.cfm?action=admin:user.edit">
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Employee Detail">
            <IconButton href="https://app.kalosflorida.com/index.cfm?action=admin:user.employees_detail">
              <ImportContactsIcon />
            </IconButton>
          </Tooltip>

          <TextField
            label="Search Employees"
            onChange={this.handleInputChange}
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.showInactive}
                onChange={this.toggleshowInactive}
                value="Inactives"
                color="primary"
              />
            }
            label={"Show Inactive"}
          />
        </Toolbar>

        {this.state.users.length !== 0 && (
          <Table stickyHeader style={{ width: "80%" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">First Name</TableCell>
                <TableCell align="center">Last Name</TableCell>
                {this.state.user.isAdmin === 1 && (
                  <TableCell align="center"></TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow
                  id={`${user.id}`}
                  onClick={this.toggleModal}
                  hover
                  key={`${user.id}-${user.lastname}-trow`}
                >
                  <TableCell align="center">{user.lastname}</TableCell>
                  <TableCell align="center">{user.firstname}</TableCell>
                  {this.state.user.isAdmin === 1 && (
                    <TableCell align="center">
                      <ButtonGroup>
                        <IconButton
                          onClick={() =>
                            this.openLink(
                              `https://app.kalosflorida.com/index.cfm?action=admin:tasks.spiff_tool_logs&type=tool&rt=all&reportUserId=${user.id}`
                            )
                          }
                        >
                          <BuildIcon />
                        </IconButton>

                        <IconButton
                          onClick={() =>
                            this.openLink(
                              `https://app.kalosflorida.com/index.cfm?action=admin:timesheet.timesheetview&timesheetAction=cardview&user_id=${user.id}&search_user_id=${user.id}&timesheetadmin=${this.state.user.isAdmin}`
                            )
                          }
                        >
                          <ScheduleIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            this.openLink(
                              `https://app.kalosflorida.com/index.cfm?action=admin:user.edit&id=${user.id}`
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </ButtonGroup>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {selectedUser && (
          <Dialog
            open={this.state.isModalOpen}
            fullScreen
            onClose={this.toggleModal}
          >
            <Grid container direction="column" alignItems="center">
              <IconButton
                style={{ alignSelf: "stretch" }}
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
                    primaryTypographyProps={{ variant: "h6" }}
                    secondaryTypographyProps={{ variant: "h4" }}
                    secondary={selectedUser.email}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primaryTypographyProps={{ variant: "h6" }}
                    secondaryTypographyProps={{ variant: "h4" }}
                    primary="First Name"
                    secondary={selectedUser.firstname}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primaryTypographyProps={{ variant: "h6" }}
                    secondaryTypographyProps={{ variant: "h4" }}
                    primary="Last Name"
                    secondary={selectedUser.lastname}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primaryTypographyProps={{ variant: "h6" }}
                    secondaryTypographyProps={{ variant: "h4" }}
                    primary="Phone Number"
                    secondary={selectedUser.phone}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Title"
                    primaryTypographyProps={{ variant: "h6" }}
                    secondaryTypographyProps={{ variant: "h4" }}
                    secondary={selectedUser.empTitle}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Manager"
                    primaryTypographyProps={{ variant: "h6" }}
                    secondaryTypographyProps={{ variant: "h4" }}
                    secondary={department?.description}
                  />
                </ListItem>
                <Divider />
              </List>
            </Grid>
          </Dialog>
        )}
      </Grid>
    );
  }
}

function sortUsers(a: User.AsObject, b: User.AsObject) {
  return `${a.lastname} ${a.firstname}`.localeCompare(
    `${b.lastname} ${b.firstname}`
  );
}

function makeSearchUsers(searchString: string) {
  return (user: User.AsObject) => {
    return `${user.lastname} ${user.firstname}`
      .toLowerCase()
      .includes(searchString);
  };
}
