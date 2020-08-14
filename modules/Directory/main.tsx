import React from 'react';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ENDPOINT } from '../../constants';
import { PageWrapper } from '../PageWrapper/main';

interface props {
  userId: number;
}

interface state {
  employees: User.AsObject[];
}

export class Directory extends React.PureComponent<props, state> {
  UserClient: UserClient;
  constructor(props: props) {
    super(props);
    this.state = { employees: [] };
    this.UserClient = new UserClient(ENDPOINT);

    this.addEmployee = this.addEmployee.bind(this);
  }

  addEmployee(emp: User.AsObject) {
    this.setState((prevState) => ({
      employees: prevState.employees.concat(emp),
    }));
  }

  async componentDidMount() {
    const req = new User();
    req.setIsEmployee(1);
    req.setIsActive(1);
    this.UserClient.GetToken('test', 'test');
    await this.UserClient.List(req, this.addEmployee);
  }

  render() {
    return (
      <PageWrapper userID={this.props.userId}>
        <Table aria-label="employee table">
          <TableHead>
            <TableRow>
              <TableCell>Last Name</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.employees
              .sort((a, b) =>
                `${a.lastname} ${a.firstname}`.localeCompare(
                  `${b.lastname} ${b.firstname}`
                )
              )
              .map((emp) => (
                <TableRow hover key={emp.id}>
                  <TableCell>{emp.lastname}</TableCell>
                  <TableCell>{emp.firstname}</TableCell>
                  <TableCell>Actions go here</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </PageWrapper>
    );
  }
}
