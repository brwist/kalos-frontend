import React, {
  ReactElement,
  ReactNode,
  CSSProperties,
  useReducer,
} from 'react';
import clsx from 'clsx';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import { Actions, ActionsProps } from '../Actions';
import { Link } from '../Link';
import { OrderDir } from '../../../helpers';
import './styles.less';
import { Props as ButtonProps } from '../Button';
import { ACTIONS, Reducer } from './reducer';
import { PlainForm } from '../PlainForm';
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
  invisible?: boolean;
}[];

export type Data = Row[];

export type Columns = {
  name: ReactNode;
  width?: number;
  dir?: OrderDir;
  onClick?: () => void;
  actions?: ActionsProps;
  fixedActions?: boolean;
  align?: 'left' | 'center' | 'right';
  invisible?: boolean;
}[];

interface Props extends Styles {
  columns?: Columns;
  data?: Data;
  styles?: CSSProperties;
  className?: string;
  skipPreLine?: boolean;
  addRowButton?: boolean; // Will add a button to add a new row
}

export const InfoTable = ({
  columns = [],
  data,
  loading = false,
  error = false,
  compact = false,
  hoverable = true,
  skipPreLine = false,
  className = '',
  styles,
  addRowButton,
}: Props) => {
  const [state, dispatch] = useReducer(Reducer, {
    isAddingRow: false,
  });
  if (addRowButton && columns.length === 0) {
    console.error(
      `addRowButton requires the columns to be defined. This is a no-op, but there will be no addRowButton. `,
    );
  }
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('xs'));
  if (state.isAddingRow) {
    let arrOfObjects: { fieldValue: string }[] = [];
    columns.forEach(_col =>
      arrOfObjects.push({
        fieldValue: '',
      }),
    );

    let fields: {} = {};
    columns.forEach(col => {
      (fields as any)[col.name as any] = ''; // Creating the field on the object for use later
    });

    let proto = fields;

    data?.unshift([
      {
        value: (
          <PlainForm<typeof proto>
            onChange={fieldOutput => console.log('changed: ', fieldOutput)}
            schema={[
              Object.keys(proto).map((field: any) => {
                return { label: field, name: field, type: 'text' };
              }),
            ]}
            data={fields}
          />
        ),
      },
    ]);
  }
  return (
    <div
      className={clsx('InfoTable', className)}
      style={styles}
      key={state.toString()}
    >
      {columns.length > 0 && (
        <div className="InfoTableHeader">
          {columns.map(
            (
              {
                name,
                dir,
                onClick,
                actions,
                fixedActions,
                width,
                align = 'left',
                invisible,
              },
              idx,
            ) => {
              if (invisible) return null;
              if (addRowButton && idx === columns.length - 1) {
                if (actions === undefined) actions = [];
                actions.push({
                  label: 'Add New Row',
                  onClick: () =>
                    dispatch({
                      type: ACTIONS.SET_IS_ADDING_ROW,
                      payload: true,
                    }),
                });
              }
              const ArrowIcon =
                dir === 'DESC' ? ArrowDropDownIcon : ArrowDropUpIcon;
              return (
                <Typography
                  key={idx}
                  className="InfoTableColumn"
                  style={{
                    width: md
                      ? '100%'
                      : width ||
                        `${
                          100 /
                          columns.filter(column => !column.invisible).length
                        }%`,
                    flexGrow: md || width === -1 ? 1 : 0,
                    flexShrink: width && width! > -1 ? 0 : 1,
                  }}
                  component="div"
                >
                  <span
                    onClick={onClick}
                    className="InfoTableDir"
                    style={{
                      cursor: onClick ? 'pointer' : 'default',
                      justifyContent:
                        md || align === 'left'
                          ? 'flex-start'
                          : align === 'right'
                          ? 'flex-end'
                          : 'center',
                    }}
                  >
                    {name} {dir && <ArrowIcon />}
                  </span>
                  {actions && (
                    <Actions
                      actions={actions}
                      fixed={fixedActions}
                      onClickAction={(
                        actionClicked: ButtonProps & {
                          desktop?: boolean;
                          burgeronly?: number;
                          fixed?: boolean;
                        },
                      ) => console.log('CLICKED THE ACTION')}
                    />
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
                  actions = [],
                  onClick,
                  actionsFullWidth = false,
                  invisible,
                },
                idx2,
              ) => {
                if (invisible) return null;
                const align =
                  columns && columns[idx2]
                    ? columns[idx2].align || 'left'
                    : 'left';

                return (
                  <Typography
                    key={idx2}
                    className={clsx('InfoTableItem', { compact })}
                    component="div"
                    style={{
                      width: md
                        ? '100%'
                        : columns && columns[idx2] && columns[idx2].width
                        ? columns[idx2].width
                        : `${
                            100 / items.filter(item => !item.invisible).length
                          }%`,
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
                      justifyContent:
                        md || align === 'left'
                          ? 'flex-start'
                          : align === 'right'
                          ? 'flex-end'
                          : 'center',
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
                          <div
                            className="InfoTableValueContent"
                            style={{
                              textAlign: md
                                ? 'left'
                                : columns[idx2]
                                ? columns[idx2].align || 'left'
                                : 'left',
                            }}
                          >
                            {value}
                          </div>
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
                );
              },
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
