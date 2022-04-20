import React, { FC, ReactNode, CSSProperties } from 'react';
import clsx from 'clsx';
import "./PrintTable.module.css";

type Style = {
  noBorders?: boolean;
};

type Column = {
  title: string;
  align: 'left' | 'center' | 'right';
  widthPercentage?: number;
};

interface Props extends Style {
  columns: (string | Column)[];
  nowraps?: boolean[];
  data: ReactNode[][];
  noEntriesText?: string;
  skipNoEntriesTest?: boolean;
  className?: string;
  styles?: CSSProperties;
  equalColWidths?: boolean;
}

export const PrintTable: FC<Props> = ({
  columns,
  nowraps = [],
  data,
  noEntriesText = 'No entries found.',
  skipNoEntriesTest = false,
  noBorders = false,
  className,
  styles = {},
  equalColWidths = false,
}) => {
  return (
    <table
      className={clsx('PrintTable', className, { noBorders })}
      style={styles}
    >
      <thead style={{ display: 'table-header-group' }}>
        <tr>
          {columns.map((column, idxColumn) => (
            <th
              key={idxColumn}
              style={{
                ...(typeof column === 'object'
                  ? {
                      textAlign: column.align,
                      ...(column.widthPercentage
                        ? { width: `${column.widthPercentage}%` }
                        : {}),
                    }
                  : {}),
                ...(nowraps[idxColumn] ? { whiteSpace: 'nowrap' } : {}),
                ...(equalColWidths
                  ? { width: `calc(100% / ${columns.length})` }
                  : {}),
              }}
            >
              {typeof column === 'string' ? column : column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={clsx('PrintTable')}>
        {data.map((cells, idxRow) => (
          <tr key={idxRow}>
            {cells.map((cell, idxColumn) => (
              <td
                key={idxColumn}
                style={{
                  ...(typeof columns[idxColumn] === 'object'
                    ? { textAlign: (columns[idxColumn] as Column).align }
                    : {}),
                  ...(nowraps[idxColumn] ? { whiteSpace: 'nowrap' } : {}),
                  ...(equalColWidths
                    ? { width: `calc(100% / ${columns.length})` }
                    : {}),
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
        {data.length === 0 && !skipNoEntriesTest && (
          <tr>
            <td colSpan={columns.length}>{noEntriesText}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
