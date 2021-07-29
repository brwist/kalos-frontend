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
import { PerDiem, PerDiemList } from '@kalos-core/kalos-rpc/PerDiem';
import { PrintPage, Status } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintParagraph } from '../PrintParagraph';
import { PerDiemComponent, getStatus } from '../PerDiem';
import {
  PerDiemClientService,
  makeFakeRows,
  getWeekOptions,
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
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { User } from '@kalos-core/kalos-rpc/User';

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
  PerDiem,
  'getDateStarted' | 'getDepartmentId' | 'getUserId' | 'getNeedsAuditing'
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

// const initialFormData = {
//   needsAuditing: true,
//   dateStarted: OPTION_ALL,
//   departmentId: 0,
//   userId: 0,
// };

let initialFormData = new PerDiem();
initialFormData.setDateStarted(OPTION_ALL);
initialFormData.setNeedsAuditing(true);
initialFormData.setDepartmentId(0);
initialFormData.setUserId(0);

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
  const [perDiems, setPerDiems] = useState<PerDiem[]>([]);
  const [perDiemsPrint, setPerDiemsPrint] = useState<PerDiem[]>([]);
  const [perDiemViewed, setPerDiemViewed] = useState<PerDiem>();
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [departments, setDepartments] = useState<TimesheetDepartment[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [pendingAudited, setPendingAudited] = useState<PerDiem>();
  const [pendingReject, setPendingReject] = useState<PerDiem>();
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formPrintData, setFormPrintData] =
    useState<FormPrintData>(initialFormPrintData);
  const [formKey, setFormKey] = useState<number>(0);
  const [govPerDiemsByYearMonth, setGovPerDiemsByYearMonth] =
    useState<GovPerDiemsByYearMonth>({});
  const initialize = useCallback(async () => {
    const technicians = await UserClientService.loadTechnicians();
    setTechnicians(technicians);
    let departments: TimesheetDepartment[];
    try {
      departments =
        await TimesheetDepartmentClientService.loadTimeSheetDepartments();
    } catch (err) {
      console.error(
        `An error occurred while loading timesheet departments: ${err}`,
      );
      setInitialized(true);
      return;
    }
    setDepartments(
      sortBy(departments, TimesheetDepartmentClientService.getDepartmentName),
    );
    setInitialized(true);
  }, [setInitialized, setDepartments]);
  const load = useCallback(async () => {
    setLoading(true);
    let response: PerDiemList;
    try {
      response = await PerDiemClientService.loadPerDiemsNeedsAuditing(
        page,
        formData.getNeedsAuditing(),
        false,
        formData.getDepartmentId() ? formData.getDepartmentId() : undefined,
        formData.getUserId() ? formData.getUserId() : undefined,
        formData.getDateStarted() !== OPTION_ALL
          ? formData.getDateStarted()
          : undefined,
      );
    } catch (err) {
      console.error(
        `An error occurred while getting a per diem that needs auditing: ${err}`,
      );
      return;
    }

    setPerDiems(response.getResultsList());
    setCount(response.getTotalCount());
    setLoading(false);
  }, [setLoading, formData, page]);
  const loadLodging = useCallback(
    async (perDiems: PerDiem[]) => {
      const zipCodesByYearMonth: {
        [key: number]: {
          [key: number]: string[];
        };
      } = {};
      perDiems.forEach(perDiem =>
        perDiem.getRowsList().forEach(pdr => {
          const [y, m] = pdr.getDateString().split('-');
          const year = +y;
          const month = +m;
          if (!zipCodesByYearMonth[year]) {
            zipCodesByYearMonth[year] = {};
          }
          if (!zipCodesByYearMonth[year][month]) {
            zipCodesByYearMonth[year][month] = [];
          }
          if (!zipCodesByYearMonth[year][month].includes(pdr.getZipCode())) {
            zipCodesByYearMonth[year][month].push(pdr.getZipCode());
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
    const resultsList = await PerDiemClientService.loadPerDiemsReport(
      departmentIds,
      userIds
        .split(',')
        .filter(id => !!id)
        .map(id => +id),
      weeks,
    );
    setPerDiemsPrint(resultsList.getResultsList());
    await loadLodging(resultsList.getResultsList());
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
    (perDiem?: PerDiem) => () => setPendingAudited(perDiem),
    [setPendingAudited],
  );
  const handlePendingRejectToggle = useCallback(
    (perDiem?: PerDiem) => () => setPendingReject(perDiem),
    [setPendingReject],
  );
  const handlePerDiemViewedToggle = useCallback(
    (perDiem?: PerDiem) => () => setPerDiemViewed(perDiem),
    [setPerDiemViewed],
  );
  const handleAudit = useCallback(async () => {
    if (pendingAudited) {
      const id = pendingAudited.getId();
      setLoading(true);
      setPendingAudited(undefined);
      await PerDiemClientService.updatePerDiemNeedsAudit(id);
      setLoaded(false);
    }
  }, [pendingAudited, setLoading, setPendingAudited, setLoaded]);
  const handleReject = useCallback(async () => {
    if (pendingReject) {
      const id = pendingReject.getId();
      setLoading(true);
      const slackID = await getSlackID(pendingReject.getOwnerName());
      if (slackID != '0') {
        slackNotify(
          slackID,
          `Your PerDiem for ${formatWeek(
            pendingReject.getDateStarted(),
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
  const handlePrinted = useCallback(
    () => setPrintStatus('idle'),
    [setPrintStatus],
  );
  const handleTogglePrinting = useCallback(
    (printing: boolean) => () => setPrinting(printing),
    [setPrinting],
  );
  const techniciansOptions: Option[] = useMemo(
    () => [
      { label: OPTION_ALL, value: 0 },
      ...technicians.map(el => ({
        label: UserClientService.getCustomerName(el),
        value: el.getId(),
      })),
    ],
    [technicians],
  );
  const departmentsOptions: Option[] = useMemo(() => {
    return [
      { label: OPTION_ALL, value: 0 },
      ...departments.map(el => ({
        label: TimesheetDepartmentClientService.getDepartmentName(el),
        value: el.getId(),
      })),
    ];
  }, [departments]);
  const SCHEMA: Schema<FormData> = [
    [
      {
        name: 'getNeedsAuditing',
        label: 'Needs Auditing',
        type: 'checkbox',
      },
      {
        name: 'getUserId',
        label: 'Technician',
        options: techniciansOptions,
      },
      {
        name: 'getDepartmentId',
        label: 'Department',
        options: departmentsOptions,
      },
      {
        name: 'getDateStarted',
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
          value: el.getId(),
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
        const { text, color } = getStatus(
          entry.getDateApproved(),
          entry.getDateSubmitted(),
          false,
        );
        return [
          {
            value: entry.getOwnerName(),
            onClick: handlePerDiemViewedToggle(entry),
          },
          {
            value: TimesheetDepartmentClientService.getDepartmentName(
              entry.getDepartment()!,
            ),
            onClick: handlePerDiemViewedToggle(entry),
          },
          {
            value: formatWeek(entry.getDateStarted()),
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
          onPageChange: handleChangePage,
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
          Are you sure Per Diem of{' '}
          <strong>{pendingReject.getOwnerName()}</strong> for department{' '}
          <strong>
            {TimesheetDepartmentClientService.getDepartmentName(
              pendingReject.getDepartment()!,
            )}
          </strong>{' '}
          for <strong>{formatWeek(pendingReject.getDateStarted())}</strong>{' '}
          should be Rejected?
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
          Are you sure Per Diem of{' '}
          <strong>{pendingAudited.getOwnerName()}</strong> for department{' '}
          <strong>
            {TimesheetDepartmentClientService.getDepartmentName(
              pendingAudited.getDepartment()!,
            )}
          </strong>{' '}
          for <strong>{formatWeek(pendingAudited.getDateStarted())}</strong> no
          longer needs auditing?
        </Confirm>
      )}
      {perDiemViewed && (
        <Modal open onClose={handlePerDiemViewedToggle(undefined)} fullScreen>
          <SectionBar
            title={`Per Diem: ${perDiemViewed.getOwnerName()}`}
            subtitle={
              <>
                Department:{' '}
                {TimesheetDepartmentClientService.getDepartmentName(
                  perDiemViewed.getDepartment()!,
                )}
                <br />
                {formatWeek(perDiemViewed.getDateStarted())}
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
              perDiemsPrint.map(entry => {
                const totalMeals = entry.getRowsList().length * MEALS_RATE;
                const totalLodging = entry
                  .getRowsList()
                  .filter(pdr => !pdr.getMealsOnly())
                  .reduce((aggr, pdr) => {
                    const [y, m] = pdr.getDateString().split('-');
                    const year = +y;
                    const month = +m;
                    return (
                      aggr +
                      govPerDiemsByYearMonth[year][month][pdr.getZipCode()]
                        .lodging
                    );
                  }, 0);
                return (
                  <div
                    key={entry.getId()}
                    className="PerDiemNeedsAuditingPrintItem"
                  >
                    <PrintParagraph tag="h3">
                      {entry.getOwnerName()} /{' '}
                      {TimesheetDepartmentClientService.getDepartmentName(
                        entry.getDepartment()!,
                      )}{' '}
                      / {formatWeek(entry.getDateStarted())}
                    </PrintParagraph>
                    <PrintTable
                      columns={[
                        `Total Meals: ${usd(totalMeals)}`,
                        `Total Lodging: ${usd(totalLodging)}`,
                        entry.getDateSubmitted()
                          ? `Date submited: ${formatDate(
                              entry.getDateSubmitted(),
                            )}`
                          : '',
                        entry.getDateApproved()
                          ? `Date approved: ${formatDate(
                              entry.getDateApproved(),
                            )}`
                          : '',
                      ]}
                      data={[]}
                      skipNoEntriesTest
                      equalColWidths
                      noBorders
                    />
                    {entry.getNotes() && (
                      <PrintParagraph>Notes: {entry.getNotes()}</PrintParagraph>
                    )}
                    <PrintTable
                      key={entry.getId()}
                      equalColWidths
                      columns={[...Array(7)].map((_, idx) => {
                        const date = format(
                          addDays(parseISO(entry.getDateStarted()), idx),
                          'do, iiii',
                        );
                        return date;
                      })}
                      data={[
                        [...Array(7)].map((_, idx) => {
                          const date = format(
                            addDays(parseISO(entry.getDateStarted()), idx),
                            'yyyy-MM-dd',
                          );
                          const row = entry
                            .getRowsList()
                            .find(pdr => pdr.getDateString().includes(date));
                          if (!row) return '';
                          const [y, m] = row.getDateString().split('-');
                          const year = +y;
                          const month = +m;
                          return (
                            <>
                              <div>Zip Code: {row.getZipCode()}</div>
                              <div>Job Number: {row.getServiceCallId()}</div>
                              <div>Meals: {usd(MEALS_RATE)}</div>
                              {!row.getMealsOnly() && (
                                <div>
                                  Lodging:{' '}
                                  {usd(
                                    govPerDiemsByYearMonth[year][month][
                                      row.getZipCode()
                                    ].lodging,
                                  )}
                                </div>
                              )}
                              {row.getNotes() && (
                                <div>Notes: {row.getNotes()}</div>
                              )}
                            </>
                          );
                        }),
                      ]}
                      noBorders
                    />
                  </div>
                );
              })}
          </PrintPage>
        </Modal>
      )}
    </div>
  );
};
