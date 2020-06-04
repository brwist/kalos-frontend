import React, { FC, ReactNode, CSSProperties } from 'react';
import { makeStyles } from '@material-ui/core/styles';

type Style = {
  noBorders?: boolean;
};

type Column = { title: string; align: 'left' | 'center' | 'right' };

interface Props extends Style {
  columns: (string | Column)[];
  data: ReactNode[][];
  noEntriesText?: string;
}

const useStyles = makeStyles(theme => {
  const border = ({ noBorders }: Style): CSSProperties => ({
    borderBottomWidth: noBorders ? 0 : 1,
    borderBottomStyle: 'solid',
    borderBottomColor: theme.palette.grey[300],
  });
  return {
    table: style => ({
      width: '100%',
      ...theme.typography.body1,
      fontSize: 10,
      ...border(style),
      borderCollapse: 'collapse',
      marginBottom: theme.spacing(),
    }),
    th: style => ({
      ...border(style),
      borderBottomColor: theme.palette.grey[500],
      textAlign: 'left',
      padding: theme.spacing(0.25),
      verticalAlign: 'top',
    }),
    td: style => ({
      ...border(style),
      padding: theme.spacing(0.25),
      verticalAlign: 'top',
    }),
  };
});

export const PrintTable: FC<Props> = ({
  columns,
  data,
  noEntriesText = 'No entries found.',
  noBorders = false,
}) => {
  const classes = useStyles({ noBorders });
  return (
    <table className={classes.table}>
      <thead>
        <tr>
          {columns.map((column, idxColumn) => (
            <th
              key={idxColumn}
              className={classes.th}
              style={
                typeof column === 'object' ? { textAlign: column.align } : {}
              }
            >
              {typeof column === 'string' ? column : column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((cells, idxRow) => (
          <tr key={idxRow}>
            {cells.map((cell, idxColumn) => (
              <td
                key={idxColumn}
                className={classes.td}
                style={
                  typeof columns[idxColumn] === 'object'
                    ? { textAlign: (columns[idxColumn] as Column).align }
                    : {}
                }
              >
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
