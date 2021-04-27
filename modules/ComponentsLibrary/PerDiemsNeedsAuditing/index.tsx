import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import { format, addDays } from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
import { PlainForm, Schema, Option } from '../PlainForm';
import { Confirm } from '../Confirm';
import { Modal } from '../Modal';
import { PerDiem } from '@kalos-core/kalos-rpc/PerDiem';
import { PrintPage, Status } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintParagraph } from '../PrintParagraph';
import { PerDiemComponent, getStatus } from '../PerDiem';
import {
  PerDiemClientService,
  PerDiemType,
  makeFakeRows,
  getWeekOptions,
  TimesheetDepartmentType,
  UserType,
  usd,
  formatDate,
  getSlackID,
  slackNotify,
  UserClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { OPTION_ALL, ROWS_PER_PAGE, MEALS_RATE } from '../../../constants';
import './styles.less';
import { parseISO } from 'date-fns/esm';
import { TripInfoTable } from '../TripInfoTable';
import { NULL_TIME } from '@kalos-core/kalos-rpc/constants';

interface Props {
  loggedUserId: number;
}

const COLUMNS: Columns = [
  { name: 'Technician' },
  { name: 'Department' },
  { name: 'Week' },
  { name: 'Status' },
];

type FormData = Pick<
  PerDiemType,
  'dateStarted' | 'departmentId' | 'userId' | 'needsAuditing'
>;

type FormPrintData = {
  userIds: string;
  departmentIds: number[];
  weeks: string[];
};

type GovPerDiemsByYearMonth = {
  [key: number]: {
    [key: number]: {
      [key: string]: {
        meals: number;
        lodging: number;
      };
    };
  };
};

const initialFormData: FormData = {
  needsAuditing: true,
  dateStarted: OPTION_ALL,
  departmentId: 0,
  userId: 0,
};

const initialFormPrintData: FormPrintData = {
  departmentIds: [],
  userIds: '',
  weeks: [],
};

const formatWeek = (date: string) => {
  const d = parseISO(date);
  return `Week of ${format(d, 'MMMM')}, ${format(d, 'do')}`;
};

export const PerDiemsNeedsAuditing: FC<Props> = ({ loggedUserId }) => {
  const weekOptions = useMemo(
    () => [
      { label: OPTION_ALL, value: OPTION_ALL },
      ...getWeekOptions(52, 0, -1),
    ],
    [],
  );
  const [initialized, setInitialized] = useState<boolean>(false);
  const [printing, setPrinting] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [rejectionMessage, setRejectionMessage] = useState<string>('');
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [perDiemsPrint, setPerDiemsPrint] = useState<PerDiemType[]>([]);
  const [perDiemViewed, setPerDiemViewed] = useState<PerDiemType>();
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [technicians, setTechnicians] = useState<UserType[]>([]);
  const [pendingAudited, setPendingAudited] = useState<PerDiemType>();
  const [pendingReject, setPendingReject] = useState<PerDiemType>();
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formPrintData, setFormPrintData] = useState<FormPrintData>(
    initialFormPrintData,
  );
  const [formKey, setFormKey] = useState<number>(0);
  const [
    govPerDiemsByYearMonth,
    setGovPerDiemsByYearMonth,
  ] = useState<GovPerDiemsByYearMonth>({});
  const initialize = useCallback(async () => {
    const technicians = await UserClientService.loadTechnicians();
    setTechnicians(technicians);
    const departments = await TimesheetDepartmentClientService.loadTimeSheetDepartments();
    setDepartments(
      sortBy(departments, TimesheetDepartmentClientService.getDepartmentName),
    );
    setInitialized(true);
  }, [setInitialized, setDepartments]);
  const load = useCallback(async () => {
    setLoading(true);
    const { departmentId, userId, dateStarted, needsAuditing } = formData;
    const {
      resultsList,
      totalCount,
    } = await PerDiemClientService.loadPerDiemsNeedsAuditing(
      page,
      needsAuditing,
      false,
      departmentId ? departmentId : undefined,
      userId ? userId : undefined,
      dateStarted !== OPTION_ALL ? dateStarted : undefined,
    );
    setPerDiems(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, formData, page]);
  const loadLodging = useCallback(
    async (perDiems: PerDiemType[]) => {
      const zipCodesByYearMonth: {
        [key: number]: {
          [key: number]: string[];
        };
      } = {};
      perDiems.forEach(({ rowsList }) =>
        rowsList.forEach(({ dateString, zipCode }) => {
          const [y, m] = dateString.split('-');
          const year = +y;
          const month = +m;
          if (!zipCodesByYearMonth[year]) {
            zipCodesByYearMonth[year] = {};
          }
          if (!zipCodesByYearMonth[year][month]) {
            zipCodesByYearMonth[year][month] = [];
          }
          if (!zipCodesByYearMonth[year][month].includes(zipCode)) {
            zipCodesByYearMonth[year][month].push(zipCode);
          }
        }),
      );
      const zipCodesArr: {
        year: number;
        month: number;
        zipCodes: string[];
      }[] = [];
      Object.keys(zipCodesByYearMonth).forEach(year =>
        Object.keys(zipCodesByYearMonth[+year]).forEach(month => {
          zipCodesArr.push({
            year: +year,
            month: +month,
            zipCodes: zipCodesByYearMonth[+year][+month],
          });
        }),
      );
      const govPerDiems = await Promise.all(
        zipCodesArr.map(async ({ year, month, zipCodes }) => ({
          year,
          month,
          data: await PerDiemClientService.loadGovPerDiem(
            zipCodes,
            year,
            month,
          ),
        })),
      );
      const govPerDiemsByYearMonth: GovPerDiemsByYearMonth = {};
      govPerDiems.forEach(({ year, month, data }) => {
        if (!govPerDiemsByYearMonth[year]) {
          govPerDiemsByYearMonth[year] = {};
        }
        govPerDiemsByYearMonth[year][month] = data;
      });
      setGovPerDiemsByYearMonth(govPerDiemsByYearMonth);
    },
    [setGovPerDiemsByYearMonth],
  );
  const loadPrintData = useCallback(async () => {
    const { departmentIds, userIds, weeks } = formPrintData;
    const { resultsList } = await PerDiemClientService.loadPerDiemsReport(
      departmentIds,
      userIds
        .split(',')
        .filter(id => !!id)
        .map(id => +id),
      weeks,
    );
    setPerDiemsPrint(resultsList);
    await loadLodging(resultsList);
  }, [formPrintData, setPerDiemsPrint, loadLodging]);
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
    if (initialized && !loaded) {
      setLoaded(true);
      load();
    }
  }, [initialized, initialize, loaded, setLoaded, load]);
  const handlePendingAuditedToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPendingAudited(perDiem),
    [setPendingAudited],
  );
  const handlePendingRejectToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPendingReject(perDiem),
    [setPendingReject],
  );
  const handlePerDiemViewedToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPerDiemViewed(perDiem),
    [setPerDiemViewed],
  );
  const handleAudit = useCallback(async () => {
    if (pendingAudited) {
      const { id } = pendingAudited;
      setLoading(true);
      setPendingAudited(undefined);
      await PerDiemClientService.updatePerDiemNeedsAudit(id);
      setLoaded(false);
    }
  }, [pendingAudited, setLoading, setPendingAudited, setLoaded]);
  const handleReject = useCallback(async () => {
    if (pendingReject) {
      const { id } = pendingReject;
      setLoading(true);
      const slackID = await getSlackID(pendingReject.ownerName);
      if (slackID != '0') {
        slackNotify(
          slackID,
          `Your PerDiem for ${formatWeek(
            pendingReject.dateStarted,
          )} was rejected for the following reason:` + rejectionMessage,
        );
      } else {
        console.log('We could not find the user, but we will still reject');
      }
      setPendingReject(undefined);
      setRejectionMessage('Enter Rejection Message');
      const req = new PerDiem();
      req.setId(id);
      req.setDateSubmitted(NULL_TIME);
      await PerDiemClientService.Update(req);
      setLoaded(false);
    }
  }, [
    pendingReject,
    setLoading,
    setPendingReject,
    setLoaded,
    rejectionMessage,
  ]);
  const handleReset = useCallback(() => {
    setPage(0);
    setFormData(initialFormData);
    setFormKey(formKey + 1);
    setLoaded(false);
  }, [setFormData, setFormKey, formKey, setLoaded, setPage]);
  const handleSearch = useCallback(() => {
    setPage(0);
    setLoaded(false);
  }, [setPage]);
  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );
  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadPrintData();
    setPrintStatus('loaded');
  }, [setPrintStatus, loadPrintData]);
  const handlePrinted = useCallback(() => setPrintStatus('idle'), [
    setPrintStatus,
  ]);
  const handleTogglePrinting = useCallback(
    (printing: boolean) => () => setPrinting(printing),
    [setPrinting],
  );
  const techniciansOptions: Option[] = useMemo(
    () => [
      { label: OPTION_ALL, value: 0 },
      ...technicians.map(el => ({
        label: UserClientService.getCustomerName(el),
        value: el.id,
      })),
    ],
    [technicians],
  );
  const departmentsOptions: Option[] = useMemo(
    () => [
      { label: OPTION_ALL, value: 0 },
      ...departments.map(el => ({
        label: TimesheetDepartmentClientService.getDepartmentName(el),
        value: el.id,
      })),
    ],
    [departments],
  );
  const SCHEMA: Schema<FormData> = [
    [
      {
        name: 'needsAuditing',
        label: 'Needs Auditing',
        type: 'checkbox',
      },
      {
        name: 'userId',
        label: 'Technician',
        options: techniciansOptions,
      },
      {
        name: 'departmentId',
        label: 'Department',
        options: departmentsOptions,
      },
      {
        name: 'dateStarted',
        label: 'Week',
        options: weekOptions,
        actions: [
          {
            label: 'Reset',
            variant: 'outlined',
            onClick: handleReset,
          },
          {
            label: 'Search',
            onClick: handleSearch,
          },
        ],
      },
    ],
  ];
  const SCHEMA_PRINT: Schema<FormPrintData> = [
    [
      {
        name: 'userIds',
        label: 'Technician(s)',
        type: 'technicians',
      },
    ],
    [
      {
        name: 'departmentIds',
        label: 'Department(s)',
        options: departments.map(el => ({
          label: TimesheetDepartmentClientService.getDepartmentName(el),
          value: el.id,
        })),
        type: 'multiselect',
      },
    ],
    [
      {
        name: 'weeks',
        label: 'Week(s)',
        options: getWeekOptions(52, 0, -1),
        type: 'multiselect',
      },
    ],
  ];
  const data: Data = loading
    ? makeFakeRows(4, 5)
    : perDiems.map(entry => {
        const {
          dateStarted,
          ownerName,
          department,
          dateApproved,
          dateSubmitted,
        } = entry;
        const { text, color } = getStatus(dateApproved, dateSubmitted, false);
        return [
          {
            value: ownerName,
            onClick: handlePerDiemViewedToggle(entry),
          },
          {
            value: TimesheetDepartmentClientService.getDepartmentName(
              department!,
            ),
            onClick: handlePerDiemViewedToggle(entry),
          },
          {
            value: formatWeek(dateStarted),
            onClick: handlePerDiemViewedToggle(entry),
          },
          {
            value: (
              <>
                <div
                  className="PerDiemNeedsAuditingStatus"
                  style={{ backgroundColor: color }}
                />
                {text}
              </>
            ),
            onClick: handlePerDiemViewedToggle(entry),
            actions: [
              <IconButton
                key="view"
                size="small"
                onClick={handlePerDiemViewedToggle(entry)}
              >
                <Visibility />
              </IconButton>,
              <IconButton
                key="audit"
                size="small"
                onClick={handlePendingAuditedToggle(entry)}
              >
                <ThumbUpIcon />
              </IconButton>,
              <IconButton
                key="reject"
                size="small"
                onClick={handlePendingRejectToggle(entry)}
              >
                <NotInterestedIcon />
              </IconButton>,
            ],
          },
        ];
      });

  return (
    <div>
      <SectionBar
        title="Per Diems Auditing"
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handleChangePage,
        }}
        actions={[{ label: 'Print', onClick: handleTogglePrinting(true) }]}
        fixedActions
      />
      <PlainForm
        key={formKey}
        schema={SCHEMA}
        data={formData}
        onChange={setFormData}
      />
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
      {pendingReject && (
        <Confirm
          title="Reject PerDiem"
          open
          onClose={handlePendingRejectToggle()}
          onConfirm={handleReject}
        >
          Are you sure Per Diem of <strong>{pendingReject.ownerName}</strong>{' '}
          for department{' '}
          <strong>
            {TimesheetDepartmentClientService.getDepartmentName(
              pendingReject.department!,
            )}
          </strong>{' '}
          for <strong>{formatWeek(pendingReject.dateStarted)}</strong> should be
          Rejected?
          <br></br>
          <label>
            <strong>Reason:</strong>
          </label>
          <input
            type="text"
            value={rejectionMessage}
            autoFocus
            size={35}
            placeholder="Enter a rejection reason"
            onChange={e => setRejectionMessage(e.target.value)}
          />
        </Confirm>
      )}
      {pendingAudited && (
        <Confirm
          title="Confirm Auditing"
          open
          onClose={handlePendingAuditedToggle()}
          onConfirm={handleAudit}
        >
          Are you sure Per Diem of <strong>{pendingAudited.ownerName}</strong>{' '}
          for department{' '}
          <strong>
            {TimesheetDepartmentClientService.getDepartmentName(
              pendingAudited.department!,
            )}
          </strong>{' '}
          for <strong>{formatWeek(pendingAudited.dateStarted)}</strong> no
          longer needs auditing?
        </Confirm>
      )}
      {perDiemViewed && (
        <Modal open onClose={handlePerDiemViewedToggle(undefined)} fullScreen>
          <SectionBar
            title={`Per Diem: ${perDiemViewed.ownerName}`}
            subtitle={
              <>
                Department:{' '}
                {TimesheetDepartmentClientService.getDepartmentName(
                  perDiemViewed.department!,
                )}
                <br />
                {formatWeek(perDiemViewed.dateStarted)}
              </>
            }
            actions={[
              { label: 'Close', onClick: handlePerDiemViewedToggle(undefined) },
            ]}
            fixedActions
            className="PerDiemNeedsAuditingModalBar"
          />
          <PerDiemComponent
            onClose={handlePerDiemViewedToggle(undefined)}
            perDiem={perDiemViewed}
            loggedUserId={loggedUserId}
          />
          {/*<TripInfoTable
            canAddTrips={false}
            perDiemRowIds={[perDiemViewed.id]}
            loggedUserId={perDiemViewed.userId}
            key={perDiemViewed.id}
          />*/}
        </Modal>
      )}
      {printing && (
        <Modal open onClose={handleTogglePrinting(false)}>
          <SectionBar
            title="Per Diems Auditing Print"
            actions={[{ label: 'Close', onClick: handleTogglePrinting(false) }]}
            fixedActions
          />
          <PlainForm
            schema={SCHEMA_PRINT}
            data={formPrintData}
            onChange={setFormPrintData}
          />
          <PrintPage
            headerProps={{
              title: 'Per Diems',
            }}
            buttonProps={{ label: 'Print', disabled: loading }}
            onPrint={handlePrint}
            onPrinted={handlePrinted}
            status={printStatus}
            key={printStatus}
            className="PerDiemNeedsAuditingPrintBtn"
          >
            {printStatus === 'loaded' &&
              perDiemsPrint.map(
                ({
                  id,
                  ownerName,
                  department,
                  dateStarted,
                  rowsList,
                  dateSubmitted,
                  dateApproved,
                  notes,
                }) => {
                  const totalMeals = rowsList.length * MEALS_RATE;
                  const totalLodging = rowsList
                    .filter(({ mealsOnly }) => !mealsOnly)
                    .reduce((aggr, { dateString, zipCode }) => {
                      const [y, m] = dateString.split('-');
                      const year = +y;
                      const month = +m;
                      return (
                        aggr +
                        govPerDiemsByYearMonth[year][month][zipCode].lodging
                      );
                    }, 0);
                  return (
                    <div key={id} className="PerDiemNeedsAuditingPrintItem">
                      <PrintParagraph tag="h3">
                        {ownerName} /{' '}
                        {TimesheetDepartmentClientService.getDepartmentName(
                          department!,
                        )}{' '}
                        / {formatWeek(dateStarted)}
                      </PrintParagraph>
                      <PrintTable
                        columns={[
                          `Total Meals: ${usd(totalMeals)}`,
                          `Total Lodging: ${usd(totalLodging)}`,
                          dateSubmitted
                            ? `Date submited: ${formatDate(dateSubmitted)}`
                            : '',
                          dateApproved
                            ? `Date approved: ${formatDate(dateApproved)}`
                            : '',
                        ]}
                        data={[]}
                        skipNoEntriesTest
                        equalColWidths
                        noBorders
                      />
                      {notes && <PrintParagraph>Notes: {notes}</PrintParagraph>}
                      <PrintTable
                        key={id}
                        equalColWidths
                        columns={[...Array(7)].map((_, idx) => {
                          const date = format(
                            addDays(parseISO(dateStarted), idx),
                            'do, iiii',
                          );
                          return date;
                        })}
                        data={[
                          [...Array(7)].map((_, idx) => {
                            const date = format(
                              addDays(parseISO(dateStarted), idx),
                              'yyyy-MM-dd',
                            );
                            const row = rowsList.find(({ dateString }) =>
                              dateString.includes(date),
                            );
                            if (!row) return '';
                            const {
                              dateString,
                              zipCode,
                              serviceCallId,
                              mealsOnly,
                              notes,
                            } = row;
                            const [y, m] = dateString.split('-');
                            const year = +y;
                            const month = +m;
                            return (
                              <>
                                <div>Zip Code: {zipCode}</div>
                                <div>Job Number: {serviceCallId}</div>
                                <div>Meals: {usd(MEALS_RATE)}</div>
                                {!mealsOnly && (
                                  <div>
                                    Lodging:{' '}
                                    {usd(
                                      govPerDiemsByYearMonth[year][month][
                                        zipCode
                                      ].lodging,
                                    )}
                                  </div>
                                )}
                                {notes && <div>Notes: {notes}</div>}
                              </>
                            );
                          }),
                        ]}
                        noBorders
                      />
                    </div>
                  );
                },
              )}
          </PrintPage>
        </Modal>
      )}
    </div>
  );
};
