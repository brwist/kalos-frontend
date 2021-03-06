import React, {
  ReactElement,
  ReactNode,
  CSSProperties,
  useReducer,
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
import { OrderDir } from '../../../helpers';
import './InfoTable.module.less';

import { Props as ButtonProps } from '../Button';
import { ACTIONS, Reducer } from './reducer';
import { PlainForm } from '../PlainForm';
import { Type, Options } from '../Field';
type Styles = {
  loading?: boolean;
  error?: boolean;
  compact?: boolean;
  hoverable?: boolean;
  ignoreNotify?: boolean;
  ignoreImage?: boolean;
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
  onEnter?: () => void;
  onNotify?: (notifyValue: boolean) => void;
  onSaveRowButton?: (results: {}) => any;
  // row button
  rowButton?: {
    // Type to use with row button (new Transaction(), new PerDiem(), etc.)
    type: any;
    // Information about the columns to use
    columnDefinition: {
      columnsToIgnore: string[];
      columnTypeOverrides: {
        columnName: string;
        columnType: Type;
        options?: Options;
        onBlur?: (value: any) => void;
      }[];
    };
    onNotify?: (notifyValue: number) => void;
    externalButton?: boolean;
    externalButtonClicked?: boolean; // Was an external button clicked that triggers this? (While true, makes the row appear)
    onFileLoad?: (fileData: any) => any;
    disable?: boolean;
  };
}

let temporaryResult: {}; // The result assigned when the onChange is fired.

export const InfoTable = ({
  columns = [],
  data,
  loading = false,
  error = false,
  compact = false,
  onEnter,
  hoverable = true,
  skipPreLine = false,
  className = '',
  styles,
  onSaveRowButton,

  rowButton,
  ignoreNotify = false,
  ignoreImage = false,
}: Props) => {
  const [state, dispatch] = useReducer(Reducer, {
    isAddingRow: false,
  });
  if (rowButton !== undefined && columns.length === 0) {
    console.error(
      `addRowButton requires the columns to be defined. This is a no-op, but there will be no addRowButton. `,
    );
  }
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('xs'));

  let fields: {} = {};

  if (state.isAddingRow) {
    columns.forEach(col => {
      if (
        !rowButton?.columnDefinition.columnsToIgnore.includes(
          col.name!.toString(),
        ) &&
        !col.invisible
      ) {
        rowButton?.columnDefinition.columnTypeOverrides.forEach(override => {
          // Default values for fields
          if (override.columnType === 'multiselect') {
            (fields as any)[col.name as any] = [];
          } else {
            (fields as any)[col.name as any] = '';
          }
        });
      }
    });
  }

  //console.log('adding row: ', state.isAddingRow);
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
                !state.isAddingRow
              ) {
                dispatch({
                  type: ACTIONS.SET_IS_ADDING_ROW,
                  payload: true,
                });
              }
              if (
                rowButton?.externalButton &&
                rowButton?.externalButtonClicked == false &&
                state.isAddingRow
              ) {
                dispatch({
                  type: ACTIONS.SET_IS_ADDING_ROW,
                  payload: false,
                });
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
                  {/* ! This action can be appended to above via the actions variable to add the "Add New" button in */}
                  {actions && (
                    <Actions actions={actions} fixed={fixedActions} />
                  )}
                </Typography>
              );
            },
          )}
        </div>
      )}
      {state.isAddingRow && (
        <PlainForm<typeof fields>
          onChange={fieldOutput => (temporaryResult = fieldOutput)}
          schema={[
            [].concat.apply(
              Object.keys(fields).map((field: any, idx: number) => {
                let columnType =
                  rowButton?.columnDefinition.columnTypeOverrides.filter(
                    type => type.columnName === field,
                  );
                return {
                  label: field,
                  name: field,
                  onBlur:
                    columnType?.length === 1
                      ? columnType![0].onBlur
                        ? columnType![0].onBlur
                        : undefined
                      : undefined,
                  type:
                    columnType?.length === 1
                      ? columnType![0].columnType
                      : 'text',
                  options:
                    columnType?.length === 1
                      ? columnType![0].options
                        ? columnType![0].options
                        : undefined
                      : undefined,
                };
              }) as any,
            ),
            [
              {
                label: 'Notify Manager?',
                name: 'notify',
                invisible: ignoreNotify,
                type: rowButton && rowButton.onNotify ? 'checkbox' : 'hidden',
                onChange: (data: number) => {
                  if (rowButton && rowButton.onNotify) {
                    rowButton.onNotify(data);
                  }
                },
              },
              {
                label: 'Add Image / Document',
                name: 'image',
                invisible: ignoreImage,
                type: 'file',
                onFileLoad: (data: string) => {
                  if (rowButton) {
                    if (rowButton.onFileLoad) rowButton.onFileLoad(data);
                  }
                },
                actions: [
                  {
                    label: 'Create',
                    onClick: () => {
                      dispatch({
                        type: ACTIONS.SET_IS_ADDING_ROW,
                        payload: false,
                      });
                      if (onSaveRowButton) onSaveRowButton(temporaryResult);
                    },
                  },
                ],
                disabled: rowButton?.disable,
              } as any,
            ],
          ]}
          data={fields}
        />
      )}
      {data &&
        data.map((items, idx) => (
          <div
            key={idx}
            onKeyUp={event => {
              if (event.key === 'Enter' && onEnter) {
                console.log('Info table enter');
                event.stopPropagation();
                event.preventDefault();
                onEnter();
              }
            }}
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
