import React from 'react';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

interface props {
  headers: string[];
  toolbar?: React.ReactElement;
  style?: React.CSSProperties;
}

export const TableSkeleton = ({ headers, style, toolbar }: props) => {
  return (
    <Paper elevation={7} style={style}>
      {toolbar}
      <Table aria-label="table skeleton" stickyHeader>
        <TableHead>
          <TableRow>
            {headers.map(h => (
              <TableCell key={`${h}_skeleton`}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <TableRow key={`${i}_skeleton_row`}>
              {headers.map(i => (
                <TableCell style={{ height: 85 }} key={`${i}_skeleton_cell`}>
                  <Skeleton variant="text" width={40} height={16} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
