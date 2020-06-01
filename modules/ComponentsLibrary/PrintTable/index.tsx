import React, { FC, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  columns: string[];
  data: ReactNode[][];
}

const useStyles = makeStyles(theme => {
  const border = {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300],
    borderLeftWidth: 0,
    borderRightWidth: 0,
    '&:first-of-type': {
      borderLeftWidth: 1,
    },
    '&:last-of-type': {
      borderRightWidth: 1,
    },
  };
  return {
    table: {
      width: '100%',
      ...theme.typography.body1,
      fontSize: 12,
      ...border,
      borderCollapse: 'collapse',
    },
    th: {
      ...border,
      textAlign: 'left',
      padding: theme.spacing(0.5),
    },
    td: {
      ...border,
      padding: theme.spacing(0.5),
    },
  };
});

export const PrintTable: FC<Props> = ({ columns, data }) => {
  const classes = useStyles();
  return (
    <table className={classes.table}>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column} className={classes.th}>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((cells, idxRow) => (
          <tr key={idxRow}>
            {cells.map((cell, idxColumn) => (
              <td key={idxColumn} className={classes.td}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
