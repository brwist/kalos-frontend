import React, { FC, useCallback, ReactElement } from 'react';
import clsx from 'clsx';
import difference from 'lodash/difference';
import { format, addDays, getDay, differenceInDays, parseISO } from 'date-fns';
import { Tooltip } from '../Tooltip';
import { PROJECT_TASK_PRIORITY_ICONS } from '../EditProject';
import { formatDate, formatTime } from '../../../helpers';
import { WEEK_DAYS } from '../../../constants';
import './CalendarEvents.module.less';

export type CalendarEvent = {
  id: number;
  startDate: string;
  startHour?: string;
  endDate: string;
  endHour?: string;
  notes: string;
  status?: string;
  statusColor?: string;
  priority?: string;
  priorityId?: number;
  assignee?: string;
  onClick?: () => void;
  renderTooltip?: ReactElement;
  label?: string;
  isActive?: number | boolean;
};

type Style = {
  loading?: boolean;
};

interface Props extends Style {
  events: CalendarEvent[];
  startDate: string;
  endDate: string;
  onAdd?: (startDate: string) => void;
  withLabels?: boolean;
}

export const CalendarEvents: FC<Props> = ({
  events,
  loading,
  startDate: dateStart,
  endDate: dateEnd,
  onAdd,
  withLabels = false,
}) => {
  const EVENT_HEIGHT = withLabels ? 40 : 30;
  const startDate = parseISO(`${dateStart}T00:00:00`);
  const endDate = parseISO(`${dateEnd}T00:00:00`);
  const totalDays = differenceInDays(endDate, startDate);
  const offsetStart = getDay(startDate);
  const offsetEnd = 6 - getDay(endDate);
  const handleAddClick = useCallback(
    (startDate: string) => () => {
      if (onAdd) {
        onAdd(startDate);
      }
    },
    [onAdd],
  );
  let offsets: { [key: number]: number } = {};
  return (
    <div className={clsx('CalendarEvents', { loading })}>
      {[...Array(7)].map((_, idx) => (
        <div key={idx} className="CalendarEventsWeekDay">
          {WEEK_DAYS[idx]}
        </div>
      ))}
      {[...Array(totalDays + offsetStart + offsetEnd + 1)].map((_, idx) => {
        const day = addDays(startDate, idx - offsetStart);
        const date = format(day, 'yyyy-MM-dd');
        const weekDay = +format(day, 'i');
        Object.keys(offsets).forEach(id => {
          if (
            !events
              .filter(
                ({ startDate, endDate }) =>
                  startDate <= date && date <= endDate,
              )
              .map(({ id }) => id)
              .includes(+id)
          ) {
            delete offsets[+id];
          }
        });
        if (weekDay === 7) {
          offsets = Object.keys(offsets)
            .sort((a, b) => {
              const A = offsets[+a];
              const B = offsets[+b];
              if (A < B) return -1;
              if (A > B) return 1;
              return 0;
            })
            .reduce((aggr, id, idx) => ({ ...aggr, [id]: idx }), {});
        }
        return (
          <div
            key={idx}
            className={clsx(
              'CalendarEventsDay',
              weekDay >= 6 ? 'CalendarEventsWeekendDay' : '',
              dateStart > date || date > dateEnd
                ? 'CalendarEventsDisabledDay'
                : '',
            )}
          >
            <div className="CalendarEventsDayDate">
              <span
                className="CalendarEventsDayDateValue"
                onClick={handleAddClick(date)}
              >
                {(format(day, 'd') === '1' ||
                  weekDay === 7 ||
                  dateStart === date) &&
                  format(day, 'MMMM ')}
                {format(day, 'd')}
              </span>
            </div>
            {events
              .filter(
                ({ startDate, endDate }) =>
                  startDate <= date && date <= endDate,
              )
              .map(
                (
                  {
                    id,
                    notes,
                    startDate,
                    endDate,
                    startHour,
                    endHour,
                    status,
                    statusColor,
                    priorityId,
                    priority,
                    assignee,
                    onClick,
                    renderTooltip,
                    label,
                    isActive,
                  },
                  idx,
                ) => {
                  const PriorityIcon = priorityId
                    ? PROJECT_TASK_PRIORITY_ICONS[priorityId]
                    : null;
                  if (startDate === date) {
                    const min = Math.min(
                      ...difference(
                        [...Array(100)].map((_, idx) => idx),
                        Object.values(offsets).sort(),
                      ),
                    );
                    offsets[id] = Object.keys(offsets).length ? min : 0;
                  }
                  const offset = offsets[id] || 0;
                  return (
                    <Tooltip
                      key={id}
                      content={
                        renderTooltip || (
                          <div
                            className="CalendarEventsStatus"
                            style={{ backgroundColor: statusColor }}
                          >
                            {assignee && (
                              <div>
                                <strong>Assigned Employee: </strong>
                                {assignee}
                              </div>
                            )}
                            <div>
                              <strong>Brief Description: </strong>
                              {notes}
                            </div>
                            <div>
                              <strong>Start Date: </strong>
                              {formatDate(startDate)}{' '}
                              {startHour && formatTime(startHour)}
                            </div>
                            <div>
                              <strong>End Date: </strong>
                              {formatDate(endDate)}{' '}
                              {endHour && formatTime(endHour)}
                            </div>
                            <div>
                              <strong>Status: </strong>
                              {status}
                            </div>
                            <div>
                              <strong>Priority: </strong>
                              {PriorityIcon && (
                                <PriorityIcon
                                  style={{
                                    fontSize: 16,
                                    marginRight: 4,
                                    verticalAlign: 'middle',
                                    display: 'inline-flex',
                                  }}
                                />
                              )}
                              {priority}
                            </div>
                          </div>
                        )
                      }
                      placement="bottom"
                      maxWidth={300}
                    >
                      <div
                        className={clsx(
                          isActive
                            ? 'CalendarEventsEvent'
                            : 'CalendarEventsEvent disabled',
                          { withLabels },
                        )}
                        style={{
                          ...(statusColor
                            ? {
                                backgroundColor: statusColor,
                                color: '#000',
                              }
                            : {}),
                          ...(startDate === date ? { marginLeft: 4 } : {}),
                          ...(endDate === date ? { marginRight: 4 } : {}),
                          top:
                            offset !== idx ? (offset - idx) * EVENT_HEIGHT : 0,
                          cursor: onClick ? 'pointer' : 'default',
                        }}
                        onClick={onClick}
                      >
                        <div
                          className={clsx('CalendarEventsEventDesc', {
                            withLabels,
                          })}
                        >
                          {(startDate === date || weekDay === 7) && (
                            <>
                              {PriorityIcon && (
                                <PriorityIcon
                                  style={{
                                    fontSize: 16,
                                    marginRight: 4,
                                    verticalAlign: 'middle',
                                    display: 'inline-flex',
                                  }}
                                />
                              )}
                              {withLabels && (
                                <div className="CalendarEventsEventLabel">
                                  {label}
                                </div>
                              )}
                              <span className="CalendarEventsEventName">
                                {notes}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="CalendarEventsHour">
                          {startDate === date && startHour && (
                            <span>{formatTime(startHour, false)}</span>
                          )}
                          {endDate === date &&
                            startDate !== endDate &&
                            endHour && (
                              <span>ends {formatTime(endHour, false)}</span>
                            )}
                        </div>
                      </div>
                    </Tooltip>
                  );
                },
              )}
          </div>
        );
      })}
    </div>
  );
};
