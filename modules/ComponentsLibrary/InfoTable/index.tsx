import React, { ReactElement, ReactNode, CSSProperties } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import { Actions, ActionsProps } from '../Actions';
import { Link } from '../Link';
import { OrderDir } from '../../../helpers';
import './styles.less';

type Styles = {
  loading?: boolean;
  error?: boolean;
  compact?: boolean;
  hoverable?: boolean;
};

type Href = 'tel' | 'mailto';

export type Row = {
  label?: string;
  value: ReactNode;
  href?: Href;
  actions?: ReactElement[];
  onClick?: () => void;
  actionsFullWidth?: boolean;
}[];

export type Data = Row[];

export type Columns = {
  name: ReactNode;
  width?: number;
  dir?: OrderDir;
  onClick?: () => void;
  actions?: ActionsProps;
  fixedActions?: boolean;
}[];

interface Props extends Styles {
  columns?: Columns;
  data?: Data;
  styles?: CSSProperties;
  className?: string;
  skipPreLine?: boolean;
}

export const InfoTable = ({
  columns = [],
  data,
  loading = false,
  error = false,
  compact = false,
  hoverable = false,
  skipPreLine = false,
  className = '',
  styles,
}: Props) => {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <div className={clsx('InfoTable', className)} style={styles}>
      {columns.length > 0 && (
        <div className="InfoTableHeader">
          {columns.map(
            ({ name, dir, onClick, actions, fixedActions, width }, idx) => {
              const ArrowIcon =
                dir === 'DESC' ? ArrowDropDownIcon : ArrowDropUpIcon;
              return (
                <Typography
                  key={idx}
                  className="InfoTableColumn"
                  style={{
                    width: md ? '100%' : width || `${100 / columns.length}%`,
                    flexGrow: md || width === -1 ? 1 : 0,
                    flexShrink: width && width! > -1 ? 0 : 1,
                  }}
                  component="div"
                >
                  <span
                    onClick={onClick}
                    className="InfoTableDir"
                    style={{ cursor: onClick ? 'pointer' : 'default' }}
                  >
                    {name} {dir && <ArrowIcon />}
                  </span>
                  {actions && (
                    <Actions actions={actions} fixed={fixedActions} />
                  )}
                </Typography>
              );
            },
          )}
        </div>
      )}
      {data &&
        data.map((items, idx) => (
          <div
            key={idx}
            className={clsx('InfoTableRow', { compact, hoverable })}
          >
            {items.map(
              (
                {
                  label,
                  value,
                  href,
                  actions,
                  onClick,
                  actionsFullWidth = false,
                },
                idx2,
              ) => (
                <Typography
                  key={idx2}
                  className={clsx('InfoTableItem', { compact })}
                  component="div"
                  style={{
                    width: md
                      ? '100%'
                      : columns && columns[idx2] && columns[idx2].width
                      ? columns[idx2].width
                      : `${100 / items.length}%`,
                    flexGrow:
                      md ||
                      (columns && columns[idx2] && columns[idx2].width === -1)
                        ? 1
                        : 0,
                    flexShrink:
                      columns &&
                      columns[idx2] &&
                      columns[idx2].width &&
                      columns[idx2].width! > -1
                        ? 0
                        : 1,
                    cursor: onClick ? 'pointer' : 'default',
                  }}
                  onClick={loading || error ? undefined : onClick}
                >
                  {label && (
                    <strong className="InfoTableLabel">{label}: </strong>
                  )}
                  {loading || error ? (
                    <span className="InfoTableFake" />
                  ) : (
                    <div
                      className="InfoTableValue"
                      style={{
                        whiteSpace: skipPreLine ? 'initial' : 'pre-line',
                      }}
                    >
                      {href ? (
                        <Link href={`${href}:${value}`}>{value}</Link>
                      ) : (
                        <div className="InfoTableValueContent">{value}</div>
                      )}
                      {actions && (
                        <span
                          className="InfoTableActions"
                          onClick={event => event.stopPropagation()}
                          style={
                            actionsFullWidth
                              ? { width: '100%', textAlign: 'right' }
                              : {}
                          }
                        >
                          {actions}
                        </span>
                      )}
                    </div>
                  )}
                </Typography>
              ),
            )}
          </div>
        ))}
      {!loading && !error && data && data.length === 0 && (
        <div className={clsx('InfoTableRow', { compact, hoverable })}>
          <Typography className="InfoTableNoEntries">
            No entries found.
          </Typography>
        </div>
      )}
      {error && (
        <div className="InfoTableError">
          <Typography className="InfoTableErrorText">
            Error loading data
          </Typography>
        </div>
      )}
    </div>
  );
};
