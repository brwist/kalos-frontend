import React from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import SearchIcon from '@material-ui/icons/SearchSharp';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { TableSkeleton } from '../../Tables/Skeleton';
import { ENDPOINT } from '../../../constants';
import Divider from '@material-ui/core/Divider';

// add any prop types here
interface props {
  selector: React.ReactElement;
  containerStyle?: React.CSSProperties;
}

// map your state here
interface state {
  searchStr: string;
  searchBy: 'Address' | 'Subdivision' | 'City' | 'Zip Code';
  count: number;
  page: number;
  isLoading: boolean;
  properties: Property.AsObject[];
}

const headers = ['Address', 'Subdivision', 'City', 'Zip Code'];
export class PropertySearch extends React.PureComponent<props, state> {
  Client: PropertyClient;
  constructor(props: props) {
    super(props);
    this.state = {
      searchStr: '',
      searchBy: 'Address',
      count: 0,
      page: 0,
      isLoading: false,
      properties: [],
    };
    this.Client = new PropertyClient(ENDPOINT);
    this.updateSearchStr = this.updateSearchStr.bind(this);
    this.updateSearchTarget = this.updateSearchTarget.bind(this);
    this.doFetchProperties = this.doFetchProperties.bind(this);
    this.fetchProperties = this.fetchProperties.bind(this);
    this.changePage = this.changePage.bind(this);
  }
  async fetchProperties() {
    const { searchBy, searchStr, page } = this.state;
    const req = new Property();
    if (searchBy === 'Address') {
      req.setAddress(`%${searchStr}%`);
    } else if (searchBy === 'Subdivision') {
      req.setSubdivision(`%${searchStr}%`);
    } else if (searchBy === 'City') {
      req.setCity(`%${searchStr}%`);
    } else if (searchBy === 'Zip Code') {
      req.setZip(`%${searchStr}%`);
    }
    req.setIsActive(1);
    req.setPageNumber(page);
    const res = (await this.Client.BatchGet(req)).toObject();
    this.setState({
      properties: res.resultsList,
      isLoading: false,
      count: res.totalCount,
    });
  }
  doFetchProperties() {
    this.setState({ isLoading: true }, this.fetchProperties);
  }
  updateSearchStr(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      searchStr: e.currentTarget.value,
    });
  }
  updateSearchTarget(e: React.ChangeEvent<HTMLSelectElement>) {
    //@ts-ignore
    this.setState({
      searchBy: e.currentTarget.value,
    });
  }
  changePage(event: unknown, newPage: number) {
    if (!this.state.isLoading) {
      this.setState({ page: newPage }, this.doFetchProperties);
    }
  }
  componentDidMount() {
    this.doFetchProperties();
  }
  renderToolbar() {
    return (
      <Toolbar>
        <Grid
          container
          justify="space-evenly"
          alignItems="flex-end"
          wrap="nowrap"
        >
          <Grid item>{this.props.selector}</Grid>
          <TablePagination
            component="span"
            count={this.state.count}
            rowsPerPage={25}
            page={this.state.page}
            backIconButtonProps={{
              'aria-label': 'previous page',
            }}
            nextIconButtonProps={{
              'aria-label': 'next page',
            }}
            onChangePage={this.changePage}
            rowsPerPageOptions={[25]}
          />
          <Grid item>
            <InputLabel htmlFor="search-target-picker">Search By</InputLabel>
            <NativeSelect
              inputProps={{ id: 'search-target-picker' }}
              value={this.state.searchBy}
              onChange={this.updateSearchTarget}
            >
              {headers.map(h => (
                <option value={h} key={`${h}_select`}>
                  {h}
                </option>
              ))}
            </NativeSelect>
          </Grid>
          <Grid item>
            <TextField
              onChange={this.updateSearchStr}
              value={this.state.searchStr}
              placeholder="Enter search string..."
            />
            <Button
              style={{ marginLeft: 10 }}
              onClick={this.doFetchProperties}
              startIcon={<SearchIcon />}
              variant="contained"
              color="primary"
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    );
  }
  goToPropertyDetail(p: Property.AsObject) {
    window.location.href = `https://app.kalosflorida.com/index.cfm?action=admin:properties.details&user_id=${p.userId}&property_id=${p.id}`;
  }
  render() {
    if (this.state.isLoading) {
      return (
        <TableSkeleton
          headers={headers}
          toolbar={this.renderToolbar()}
          style={this.props.containerStyle}
        />
      );
    } else {
      return (
        <Paper elevation={7} style={this.props.containerStyle}>
          {this.renderToolbar()}
          <Divider />
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map(h => (
                  <TableCell key={`${h}_header`}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.properties.map(p => (
                <TableRow
                  key={`${p.id}-${p.dateCreated}`}
                  hover
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.goToPropertyDetail(p)}
                >
                  <TableCell>{p.address}</TableCell>
                  <TableCell>{p.subdivision}</TableCell>
                  <TableCell>{p.city}</TableCell>
                  <TableCell>{p.zip}</TableCell>
                </TableRow>
              ))}
              {this.state.properties.length === 0 && !this.state.isLoading && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Results
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      );
    }
  }
}
