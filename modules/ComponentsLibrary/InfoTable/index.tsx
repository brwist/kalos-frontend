import React, {
  ReactElement,
  ReactNode,
  CSSProperties,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import clsx from 'clsx';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import { Actions, ActionsProps } from '../Actions';
import { Link } from '../Link';
import {
  OrderDir,
  TimesheetDepartmentClientService,
  UserClientService,
} from '../../../helpers';
import './styles.less';
import { ACTIONS, Reducer } from './reducer';
import { PlainForm } from '../PlainForm';
import { Type } from '../Field';
import { User } from '@kalos-core/kalos-rpc/User';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
type Styles = {
  loading?: boolean;
  error?: boolean;
  compact?: boolean;
  hoverable?: boolean;
};

type Href = 'tel' | 'mailto';
export type Modes = 'editing' | 'overview';

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
  onSaveRowButton?: (results: {}) => any;
  // row button
  rowButton?: {
    // Type to use with row button (new Transaction(), new PerDiem(), etc.)
    type: any;
    // Information about the columns to use
    columnDefinition: {
      columnsToIgnore: string[];
      columnTypeOverrides: { columnName: string; columnType: Type }[];
    };
    externalButton?: boolean;
    externalButtonClicked?: boolean; // Was an external button clicked that triggers this? (While true, makes the row appear)
  };
  mode?: Modes;
}

let addingRowSelected = false; // Will go true before state set, performance optimization so clicking the button doesn't freeze a little bit

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
  onSaveRowButton,
  rowButton,
  mode = 'overview',
}: Props) => {
  const [state, dispatch] = useReducer(Reducer, {
    isAddingRow: false,
    mode: 'overview',
    technicians: undefined,
    departments: undefined,
    loaded: false,
  });
  if (mode && state.mode !== mode) {
    dispatch({ type: ACTIONS.SET_MODE, payload: mode });
  }
  if (rowButton !== undefined && columns.length === 0) {
    console.error(
      `addRowButton requires the columns to be defined. This is a no-op, but there will be no addRowButton. `,
    );
  }
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('xs'));

  let fields: any = {};
  let temporaryResult: {}; // The result assigned when the onChange is fired.

  if (state.isAddingRow || mode !== 'overview') {
    columns.forEach(col => {
      if (
        !rowButton?.columnDefinition.columnsToIgnore.includes(
          col.name!.toString(),
        ) &&
        !col.invisible
      )
        (fields as any)[col.name as any] = ''; // Creating the field on the object for use later
    });
  }

  const determineCast = useCallback(
    (
      value:
        | boolean
        | React.ReactChild
        | React.ReactFragment
        | React.ReactPortal
        | ReactNode
        | undefined,
      columnType:
        | {
            columnName: string;
            columnType: Type;
          }
        | undefined,
    ) => {
      if (!value || !state.loaded) {
        return '';
      }
      if (columnType === undefined) {
        return value.toString().replace('$ ', '');
      }

      const tech = state.technicians!.filter(
        tech =>
          tech.getId() ===
          parseInt(
            String(value).substring(
              String(value).indexOf('(') + 1,
              String(value).lastIndexOf(')'),
            ),
          ),
      );
      let dept;
      if (state.departments) {
        dept = state.departments!.filter(department => {
          return (department as any)[2] === value.toString();
        })[0];
      }
      let techResult = tech.length === 0 ? new User() : tech[0];

      switch (columnType.columnType) {
        case 'number':
          return parseFloat(value.toString().replace('$ ', '').trim());
        case 'technician':
          return techResult !== new User() ? techResult.getId() : 0;
        case 'department':
          return (dept as any)[0];
        default:
          console.log('Returning from default');
      }

      return value.toString().replace('$ ', '');
    },
    [state.departments, state.loaded, state.technicians],
  );

  const load = useCallback(async () => {
    if (state.technicians === undefined || state.technicians.length === 0) {
      dispatch({
        type: ACTIONS.SET_TECHNICIANS,
        payload: await UserClientService.loadTechnicians(),
      });
    }
    if (state.departments === undefined || state.departments.length === 0) {
      let req = new TimesheetDepartment();
      req.setIsActive(1);
      dispatch({
        type: ACTIONS.SET_DEPARTMENTS,
        payload: (
          await TimesheetDepartmentClientService.BatchGet(req)
        ).toArray()[0],
      });
    }
    dispatch({ type: ACTIONS.SET_LOADED, payload: true });
  }, [state]);

  useEffect(() => {
    if (!state.loaded) load();
  }, [load, state.loaded]);

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
              if (
                rowButton?.externalButton &&
                rowButton?.externalButtonClicked &&
                !state.isAddingRow &&
                !addingRowSelected
              ) {
                dispatch({
                  type: ACTIONS.SET_IS_ADDING_ROW,
                  payload: true,
                });
                addingRowSelected = true;
              }
              if (
                rowButton !== undefined &&
                idx === columns.length - 1 &&
                !rowButton.externalButton
              ) {
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
                  {/* ! This action can have new actions pushed to it above via the actions variable to add the "Add New" button in */}
                  {actions && (
                    <Actions actions={actions} fixed={fixedActions} />
                  )}
                </Typography>
              );
            },
          )}
        </div>
      )}

      {/* Adding Row */}

      {state.isAddingRow && (
        <PlainForm<typeof fields>
          onChange={fieldOutput => (temporaryResult = fieldOutput)}
          schema={[
            Object.keys(fields).map((field: any, idx: number) => {
              let columnType =
                rowButton?.columnDefinition.columnTypeOverrides.filter(
                  type => type.columnName === field,
                );
              return {
                label: field,
                name: field,
                type:
                  columnType?.length === 1 ? columnType![0].columnType : 'text',
                actions:
                  idx == Object.keys(fields).length - 1
                    ? [
                        {
                          label: 'OK',
                          onClick: () => {
                            dispatch({
                              type: ACTIONS.SET_IS_ADDING_ROW,
                              payload: false,
                            });
                            if (onSaveRowButton)
                              onSaveRowButton(temporaryResult);
                          },
                        },
                      ]
                    : [],
              };
            }),
          ]}
          data={fields}
        />
      )}

      {/* Overview Mode */}

      {data &&
        mode === 'overview' &&
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

      {/* Editing mode */}

      {data &&
        mode === 'editing' &&
        data.map((items, idx) => (
          <div
            key={idx}
            className={clsx('InfoTableRow', { compact, hoverable })}
          >
            <PlainForm<typeof fields>
              key={String(idx) + String(state.loaded)}
              onChange={fieldOutput => {
                temporaryResult = fieldOutput;
                console.log('FIELD OUTPUT: ', fieldOutput);
              }}
              schema={[
                items.map((item, idx2) => {
                  if (
                    item.invisible ||
                    rowButton?.columnDefinition?.columnsToIgnore.includes(
                      String(columns[idx2].name),
                    )
                  ) {
                    return {
                      label: '',
                      invisible: true,
                    };
                  }

                  let columnType =
                    rowButton?.columnDefinition.columnTypeOverrides.filter(
                      type => type.columnName === String(columns[idx2].name),
                    );

                  return {
                    label: String(columns[idx2].name),
                    value: determineCast(
                      item.value,
                      columnType === undefined
                        ? undefined
                        : columnType.length > 0
                        ? columnType[0]
                        : undefined,
                    ),
                    content: determineCast(
                      item.value,
                      columnType === undefined
                        ? undefined
                        : columnType.length > 0
                        ? columnType[0]
                        : undefined,
                    ),
                    name: String(columns[idx2].name),
                    type:
                      columnType?.length === 1
                        ? columnType![0].columnType
                        : 'text',
                  };
                }),
              ]}
              data={Object.assign(
                {},
                ...items.map((item, idx2) => {
                  let columnType =
                    rowButton?.columnDefinition.columnTypeOverrides.filter(
                      type => type.columnName === String(columns[idx2].name),
                    );

                  // This weird hacky thing is to create a precomputed object that has fields acceptable for the PlainForm to accept
                  // (as it takes objects with specific fields in as input)
                  let string = `${columns[idx2].name}`;
                  let obj = {};
                  (obj as any)[string] = determineCast(
                    item.value,
                    columnType === undefined
                      ? undefined
                      : columnType.length > 0
                      ? columnType[0]
                      : undefined,
                  );

                  return obj;
                }),
              )}
            />
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
