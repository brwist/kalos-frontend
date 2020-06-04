import React, { FC, ReactNode, CSSProperties } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  columns: string[];
  data: ReactNode[][];
  noEntriesText?: string;
}

const useStyles = makeStyles(theme => {
  const border: CSSProperties = {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: theme.palette.grey[300],
  };
  return {
    table: {
      width: '100%',
      ...theme.typography.body1,
      fontSize: 10,
      ...border,
      borderCollapse: 'collapse',
    },
    th: {
      ...border,
      borderBottomColor: theme.palette.grey[500],
      textAlign: 'left',
      padding: theme.spacing(0.25),
    },
    td: {
      ...border,
      padding: theme.spacing(0.25),
    },
  };
});

export const PrintTable: FC<Props> = ({
  columns,
  data,
  noEntriesText = 'No entries found.',
}) => {
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
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length}>{noEntriesText}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
