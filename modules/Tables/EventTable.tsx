import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ToolTip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import GoToCallIcon from '@material-ui/icons/ExitToApp';
import Skeleton from '@material-ui/lab/Skeleton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Event } from '../../@kalos-core/kalos-rpc/Event';
import { Property } from '../../@kalos-core/kalos-rpc/Property';
import { User } from '../../@kalos-core/kalos-rpc/User';
import { parseISO } from 'date-fns';

interface EventProps {
  events: Event.AsObject[];
  title?: string;
  isLoading: boolean;
}

export const EventTable = ({ events, isLoading, title }: EventProps) => {
  return (
    <>
      {title && (
        <Typography
          variant="h5"
          component="span"
          style={{
            alignSelf: 'flex-start',
            marginLeft: '6%',
          }}
        >
          {title}
        </Typography>
      )}
      <Paper
        elevation={7}
        style={{
          width: '90%',
          maxHeight: 400,
          overflowY: 'scroll',
          marginBottom: 20,
        }}
      >
        <Table aria-label="events table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Subtype</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading &&
              [0, 1, 2, 3, 4, 5, 6].map(i => (
                <TableRow key={`${i}_skeleton`}>
                  <TableCell style={{ height: 80 }}>
                    <Skeleton variant="text" width={40} height={16} />
                  </TableCell>
                  <TableCell style={{ height: 80 }}>
                    <Skeleton variant="text" width={85} height={16} />
                  </TableCell>
                  <TableCell style={{ height: 80 }}>
                    <Skeleton variant="text" width={120} height={16} />
                  </TableCell>
                  <TableCell style={{ height: 80 }}>
                    <Skeleton variant="text" width={120} height={16} />
                  </TableCell>
                  <TableCell style={{ height: 80 }}>
                    <Skeleton variant="text" width={200} height={16} />
                  </TableCell>
                  <TableCell style={{ height: 80 }}>
                    <Skeleton variant="text" width={150} height={16} />
                  </TableCell>
                  <TableCell style={{ height: 80 }}>
                    <Skeleton variant="text" width={150} height={16} />
                  </TableCell>
                  <TableCell style={{ height: 80 }}>
                    <Skeleton variant="text" width={150} height={16} />
                  </TableCell>
                  <TableCell style={{ height: 80 }}>
                    <IconButton color="secondary">
                      <GoToCallIcon />
                    </IconButton>
                    {/*<Skeleton variant="rect" width={18} height={18} />*/}
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading &&
              events
                .sort((a, b) => {
                  const dateA = parseISO(a.dateStarted.split(' ')[0]);
                  const dateB = parseISO(b.dateStarted.split(' ')[0]);
                  return dateB.valueOf() - dateA.valueOf();
                })
                .map(e => (
                  <TableRow key={`${e.id}_assignment_row`}>
                    <TableCell>
                      <Typography variant="body1" component="span">
                        {e.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        component="span"
                        align="center"
                      >
                        {e.dateStarted.split(' ')[0]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        component="span"
                        align="center"
                      >
                        {e.timeStarted} - {e.timeEnded}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" component="span">
                        {getCustomerName(e.customer)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" component="span">
                        {getPropertyAddress(e.property)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" component="span">
                        {e.jobType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" component="span">
                        {e.jobSubtype}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" component="span">
                        {e.logJobStatus}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <ToolTip placement="top" title="Go to Service Call">
                        <IconButton
                          color="secondary"
                          onClick={openServiceCall(e)}
                        >
                          <GoToCallIcon />
                        </IconButton>
                      </ToolTip>
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && events.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  <Typography variant="body1" component="span">
                    No Results
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

function getCustomerName(c?: User.AsObject): string {
  let res = '';
  if (c) {
    res = `${c.firstname} ${c.lastname}`;
    if (c.businessname && c.businessname != '') {
      res = `${res} - ${c.businessname}`;
    }
  }
  return res;
}

function getPropertyAddress(p?: Property.AsObject): string {
  let res = '';
  if (p) {
    res = `${p.address}, ${p.city}, ${p.state} ${p.zip}`;
  }
  return res;
}

function openServiceCall(e: Event.AsObject) {
  return () => {
    const url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${
      e.id
    }&user_id=${e.customer ? e.customer.id : 0}&property_id=${e.propertyId}`;
    window.location.href = url;
  };
}
