import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import { Spiff } from '@kalos-core/kalos-rpc/Task';

interface SpiffProps {
  spiffs: Spiff.AsObject[];
  isLoading: boolean;
}

export const Spiffs = ({ spiffs, isLoading }: SpiffProps) => {
  return (
    <>
      <Typography
        variant="h5"
        component="span"
        style={{
          alignSelf: 'flex-start',
          marginLeft: '6%',
        }}
      >
        Spiffs
      </Typography>
      <Paper
        elevation={7}
        style={{
          width: '90%',
          maxHeight: 400,
          overflowY: 'scroll',
          marginBottom: 20,
        }}
      >
        <Table aria-label="spiffss table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Claim Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Spiff Type</TableCell>
              <TableCell>Job ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reviewed By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading &&
              [0, 1, 2, 3, 4, 5, 6].map(i => (
                <TableRow key={`${i}_skeleton`}>
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
                </TableRow>
              ))}
            {!isLoading &&
              spiffs
                .sort((a, b) => {
                  const dateA = new Date(a.timeCreated.split(' ')[0]);
                  const dateB = new Date(b.timeCreated.split(' ')[0]);
                  return dateB.valueOf() - dateA.valueOf();
                })
                .map(e => (
                  <TableRow
                    key={`${e.spiffAddress}_${e.spiffJobnumber}_${e.spiffAmount}_${e.timeCreated}`}
                  >
                    <TableCell>
                      <Typography
                        variant="body1"
                        component="span"
                        align="center"
                      >
                        {e.timeCreated.split(' ')[0]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        component="span"
                        align="center"
                      >
                        {e.briefDescription}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" component="span">
                        ${e.spiffAmount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" component="span">
                        {e.spiffType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" component="span">
                        {e.spiffJobnumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {e.status === 'Rejected' ? (
                        <Tooltip placement="top" title={e.reason}>
                          <Typography
                            variant="body1"
                            component="span"
                            style={{ cursor: 'pointer' }}
                          >
                            {e.status}
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="body1" component="span">
                          {e.status}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" component="span">
                        {e.reviewedBy}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && spiffs.length === 0 && (
              <span>
                <Typography variant="body1" component="span">
                  No Results
                </Typography>
              </span>
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};
