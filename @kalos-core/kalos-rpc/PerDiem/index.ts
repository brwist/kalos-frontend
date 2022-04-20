import { grpc } from '@improbable-eng/grpc-web';
import { PerDiemService } from '../compiled-protos/perdiem_pb_service';
import {
  PerDiem,
  PerDiemList,
  TripList,
  PerDiemRow,
  PerDiemReportRequest,
  Trip,
  SQLRequest,
} from '../compiled-protos/perdiem_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';
import { TimesheetDepartment } from '../compiled-protos/timesheet_department_pb';
import { TimesheetDepartmentClient } from '../TimesheetDepartment';
import {
  Double,
  Empty,
  Int32,
  IntArray,
  String,
} from '../compiled-protos/common_pb';
import { ApiKey, ApiKeyClient } from '../ApiKey';
import { unique, getDepartmentName, timestamp } from '../Common';
import { NULL_TIME, MEALS_RATE, ENDPOINT } from '../constants';
import { MapClient } from '../Maps';
class PerDiemClient extends BaseClient {
  MapClient: MapClient;
  constructor(host?: string, userID?: number) {
    super(host, userID);
    this.MapClient = new MapClient(ENDPOINT);
  }

  public async Create(req: PerDiem) {
    return new Promise<PerDiem>((resolve, reject) => {
      const opts: UnaryRpcOptions<PerDiem, PerDiem> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PerDiemService.Create, opts);
    });
  }

  public async Get(req: PerDiem) {
    return new Promise<PerDiem>((resolve, reject) => {
      const opts: UnaryRpcOptions<PerDiem, PerDiem> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PerDiemService.Get, opts);
    });
  }

  public async Update(req: PerDiem, returnMsg = false) {
    return new Promise<PerDiem>((resolve, reject) => {
      const opts: UnaryRpcOptions<PerDiem, PerDiem> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (output: UnaryOutput<PerDiem>) => {
          if (output.message && returnMsg) {
            resolve(output.message);
          } else if (!output.message) {
            reject(output.statusMessage);
          } else {
            // Ignoring due to linter
            // @ts-ignore
            resolve();
          }
        },
      };
      grpc.unary(PerDiemService.Update, opts);
    });
  }

  public async Delete(req: PerDiem) {
    return new Promise<PerDiem>((resolve, reject) => {
      const opts: UnaryRpcOptions<PerDiem, PerDiem> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PerDiemService.Delete, opts);
    });
  }

  public async isPerDiemAdmin(userID: number) {
    try {
      const tsc = new TimesheetDepartmentClient(this.host);
      const req = new TimesheetDepartment();
      req.setManagerId(userID);
      const res = await tsc.Get(req);
      if (res.getManagerId() === userID) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  public async CreateRow(req: PerDiemRow) {
    return new Promise<PerDiemRow>((resolve, reject) => {
      const opts: UnaryRpcOptions<PerDiemRow, PerDiemRow> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PerDiemRow>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.CreateRow, opts);
    });
  }

  public async GetRow(req: PerDiemRow) {
    return new Promise<PerDiemRow>((resolve, reject) => {
      const opts: UnaryRpcOptions<PerDiemRow, PerDiemRow> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PerDiemRow>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.GetRow, opts);
    });
  }

  public async CreateTrip(req: Trip) {
    return new Promise<Trip>((resolve, reject) => {
      const opts: UnaryRpcOptions<Trip, Trip> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Trip>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.CreateTrip, opts);
    });
  }

  public async UpdateTrip(req: Trip) {
    return new Promise<Trip>((resolve, reject) => {
      const opts: UnaryRpcOptions<Trip, Trip> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Trip>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.UpdateTrip, opts);
    });
  }

  public async GetTrip(req: Trip) {
    return new Promise<Trip>((resolve, reject) => {
      const opts: UnaryRpcOptions<Trip, Trip> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Trip>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.GetTrip, opts);
    });
  }

  public async UpdateRow(req: PerDiemRow) {
    return new Promise<PerDiemRow>((resolve, reject) => {
      const opts: UnaryRpcOptions<PerDiemRow, PerDiemRow> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PerDiemRow>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.UpdateRow, opts);
    });
  }

  public async DeleteTrip(req: Trip) {
    return new Promise<Trip>((resolve, reject) => {
      const opts: UnaryRpcOptions<Trip, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PerDiemService.DeleteTrip, opts);
    });
  }

  public async DeleteRow(perDiemRowID: number) {
    const req = new PerDiemRow();
    req.setId(perDiemRowID);
    return new Promise<Empty>((resolve, reject) => {
      const opts: UnaryRpcOptions<PerDiemRow, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Empty>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.DeleteRow, opts);
    });
  }

  public async BatchGet(req: PerDiem) {
    return new Promise<PerDiemList>((resolve, reject) => {
      const opts: UnaryRpcOptions<PerDiem, PerDiemList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PerDiemList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.BatchGet, opts);
    });
  }

  public async BatchGetPerDiemsByIds(req: number[]) {
    let arr: IntArray = new IntArray();
    arr.setIdsList(req);
    return new Promise<PerDiemList>((resolve, reject) => {
      const opts: UnaryRpcOptions<IntArray, PerDiemList> = {
        request: arr,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PerDiemList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.BatchGetPerDiemsByIds, opts);
    });
  }

  public async BatchGetTrips(req: Trip) {
    return new Promise<TripList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Trip, TripList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TripList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.BatchGetTrips, opts);
    });
  }

  public async GetTotalRowTripDistance(req: Int32) {
    return new Promise<Double>((resolve, reject) => {
      const opts: UnaryRpcOptions<Int32, Double> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Double>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.GetTotalRowTripDistance, opts);
    });
  }

  public async BatchDeleteTrips(req: Trip) {
    return new Promise<Empty>((resolve, reject) => {
      const opts: UnaryRpcOptions<Trip, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Empty>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.BatchDeleteTrips, opts);
    });
  }

  public async getPerDiemReportData(config: PerDiemReportConfig) {
    return new Promise<PerDiemList>((resolve, reject) => {
      const req = new PerDiemReportRequest();
      req.setWeekList(config.weeks!);
      req.setUserIdList(config.userIDs!);
      req.setDepartmentIdList(config.departmentIDs!);
      const opts: UnaryRpcOptions<PerDiemReportRequest, PerDiemList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PerDiemList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.GetPerDiemReport, opts);
    });
  }

  public async updatePerDiemNeedsAudit(id: number) {
    const req = new PerDiem();
    req.setId(id);
    req.setNeedsAuditing(false);
    req.setFieldMaskList(['NeedsAuditing']);
    await this.Update(req);
  }

  public async updatePerDiemPayrollProcessed(id: number) {
    const req = new PerDiem();
    req.setId(id);
    req.setPayrollProcessed(true);
    req.setFieldMaskList(['PayrollProcessed']);
    await this.Update(req);
  }

  public async updateTripPayrollProcessed(id: number) {
    const req = new Trip();
    req.setId(id);
    req.setPayrollProcessed(true);
    req.setDateProcessed(timestamp());
    req.setFieldMaskList(['PayrollProcessed', 'DateProcessed']);
    await this.UpdateTrip(req);
  }

  public async updateTripApproved(id: number) {
    const req = new Trip();
    req.setId(id);
    req.setApproved(true);
    req.setAdminActionDate(timestamp());
    req.setFieldMaskList(['Approved', 'AdminActionDate']);
    await this.UpdateTrip(req);
  }
  public async updateTripDeny(id: number) {
    const req = new Trip();
    req.setId(id);
    req.setFieldMaskList(['AdminActionDate']);
    req.setAdminActionDate(timestamp());
    await this.UpdateTrip(req);
  }
  public async deletePerDiemById(id: number) {
    const req = new PerDiem();
    req.setId(id);
    await this.Delete(req);
  }

  public loadPerDiemByUserIdAndDateStarted = async (
    userId: number,
    dateStarted: string
  ) => {
    const req = new PerDiem();
    req.setUserId(userId);
    req.setWithRows(true);
    req.setIsActive(true);
    req.setPageNumber(0);
    req.setDateStarted(`${dateStarted}%`);
    return await this.BatchGet(req);
  };

  public loadPerDiemsByEventId = async (eventId: number) => {
    const req = new PerDiem();
    req.setWithRows(true);
    req.setIsActive(true);
    req.setPageNumber(0);
    req.setWithoutLimit(true);
    const row = new PerDiemRow();
    row.setServiceCallId(eventId);
    req.setReferenceRow(row);
    return await this.BatchGet(req);
  };

  public loadPerDiemByUserIdAndDateStartedAudited = async (
    userId: number,
    dateEnded: string
  ) => {
    const req = new PerDiem();
    req.setUserId(userId);
    req.setWithRows(true);
    req.setIsActive(true);
    req.setApprovedById(0);
    req.setNotEqualsList(['ApprovedById']);
    req.setFieldMaskList(['PayrollProcessed']);
    req.setPageNumber(0);
    req.setDateRangeList(['>=', '0001-01-01', '<', dateEnded]);
    return await this.BatchGet(req);
  };

  public getTotalRowTripDistanceWithUserID = async (
    userID: number,
    rowID?: number
  ) => {
    let trip = new Trip();
    trip.setUserId(userID);
    if (rowID) {
      trip.setPerDiemRowId(rowID);
    }
    const trips = await this.BatchGetTrips(trip);
    let totalDist = 0;
    trips
      .getResultsList()
      .forEach(trip => (totalDist += trip.getDistanceInMiles()));

    return totalDist;
  };

  public getPerDiemsFromIds = async (ids: number[]) => {
    let list: PerDiem[] = [];
    for await (const id of ids) {
      let pd = new PerDiem();
      pd.setId(id);
      list.push(await this.Get(pd));
    }

    return list;
  };

  public async getSQL(pd: PerDiem, type: 'Get' | 'BatchGet' | 'Update') {
    return new Promise((resolve, reject) => {
      const req = new SQLRequest();
      req.setData(pd);
      req.setRequestType(type);
      const opts: UnaryRpcOptions<SQLRequest, String> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<String>) => {
          if (result.message) {
            resolve(result.message.getValue());
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(PerDiemService.GetDebugSQLOutput, opts);
    });
  }

  public loadPerDiemByUserIdsAndDateStarted = async (
    userIds: number[],
    dateStarted: string
  ) => {
    const response = await Promise.all(
      unique(userIds).map(async userId => ({
        userId,
        data: (
          await this.loadPerDiemByUserIdAndDateStarted(userId, dateStarted)
        ).getResultsList(),
      }))
    );
    return response.reduce(
      (aggr, { userId, data }) => ({ ...aggr, [userId]: data }),
      {}
    );
  };

  public getRowDatesFromPerDiemTripInfos = async (trips: TripInfo[]) => {
    let tripIds = [];
    for (const trip of trips) {
      tripIds.push(trip.perDiemRowId);
    }
    let res: { date: string; row_id: number }[] = [];
    for await (const id of tripIds) {
      try {
        let pd = new PerDiem();
        pd.setId(id);
        const pdr = await this.Get(pd);
        const obj = {
          date: pdr.getDateStarted(),
          row_id: id,
        };
        if (!res.includes(obj)) res.push(obj);
      } catch (err) {
        console.error(
          'Error in promise for get row dates from per diem IDs (Verify Per Diem exists): ',
          err
        );
      }
    }

    return res;
  };

  getRowDatesFromPerDiemTrips = async (trips: Trip[]) => {
    let tripIds = [];
    for (const trip of trips) {
      tripIds.push(trip.getPerDiemRowId());
    }
    let res: { date: string; row_id: number }[] = [];

    if (tripIds.length != 0) {
      let pds = await this.BatchGetPerDiemsByIds(tripIds);

      for (const perDiem of pds.getResultsList()) {
        const obj = {
          date: perDiem.getDateStarted(),
          row_id: perDiem.getId(),
        };
        res.push(obj);
      }
    }

    return res;
  };

  getRowDatesFromPerDiemIds = async (ids: number[]) => {
    let res: { date: string; row_id: number }[] = [];
    for await (const id of ids) {
      try {
        let pd = new PerDiem();
        pd.setId(id);
        const pdr = await this.Get(pd);
        const obj = {
          date: pdr.getDateStarted(),
          row_id: id,
        };
        if (!res.includes(obj)) res.push(obj);
      } catch (err) {
        console.error(
          'Error in promise for get row dates from per diem IDs (Verify Per Diem exists): ',
          err
        );
      }
    }

    return res;
  };

  loadPerDiemByDepartmentIdsAndDateStarted = async (
    departmentIds: number[],
    dateStarted: string
  ) => {
    const results = await Promise.all(
      departmentIds.map(async departmentId => {
        const req = new PerDiem();
        req.setDepartmentId(departmentId);
        req.setWithRows(true);
        req.setIsActive(true);
        req.setPageNumber(0);
        req.setDateStarted(`${dateStarted}%`);
        return (await this.BatchGet(req)).getResultsList();
      })
    );
    return results
      .reduce((aggr, item) => [...aggr, ...item], [])
      .sort((a, b) => {
        if (
          getDepartmentName(a.getDepartment()) <
          getDepartmentName(b.getDepartment())
        )
          return -1;
        if (
          getDepartmentName(a.getDepartment()) >
          getDepartmentName(b.getDepartment())
        )
          return 1;
        return 0;
      });
  };

  loadPerDiemsForPayroll = async (
    page: number,
    needsAuditing: boolean,
    needsProcessed: boolean,
    managerApproved?: boolean,
    departmentId?: number,
    userId?: number,
    dateStarted?: string,
    payrollToggle?: boolean,
    orderBy?: string,
    orderDir?: string
  ) => {
    const req = new PerDiem();
    req.setWithRows(true);
    req.setPageNumber(page);
    req.setIsActive(true);
    req.addNotEquals('DateSubmitted');
    req.setDateSubmitted(NULL_TIME);
    if (departmentId) {
      req.setDepartmentId(departmentId);
    }
    if (userId) {
      req.setUserId(userId);
    }
    if (orderBy && orderDir) {
      req.setOrderBy(orderBy);
      req.setOrderDir(orderDir);
    }
    if (dateStarted) {
      req.setDateStarted(`${dateStarted}%`);
    }
    if (managerApproved || needsProcessed || needsAuditing) {
      if (managerApproved && !payrollToggle) {
        //fetch unapproved perdiems for the department
        req.addFieldMask('ApprovedById');
        req.addNotEquals('PayrollProcessed');
        req.setPayrollProcessed(true);
      }
      if (managerApproved && payrollToggle) {
        //fetch already approved perdiems for the department
        req.setApprovedById(0);
        req.addNotEquals('ApproveById');
      } else if (needsProcessed && !payrollToggle) {
        //fetch all peridems that are not currently processed by payroll
        req.addNotEquals('ApprovedById');
        req.addFieldMask('PayrollProcessed');
      } else if (needsProcessed && payrollToggle) {
        req.addNotEquals('ApprovedById');
        req.addNotEquals('PayrollProcessed');
      } else if (needsAuditing) {
        //fetch perdiems that have no been audited yet
        req.addNotEquals('ApprovedById');
        req.addFieldMask('NeedsAuditing');
        req.setFieldMaskList(['NeedsAuditing']);
        req.setNeedsAuditing(true);
      }
    }

    return await this.BatchGet(req);
  };

  loadPerDiemsNeedsAuditing = async (
    page: number,
    needsAuditing: boolean,
    payrollProcessed: boolean,
    departmentId?: number,
    userId?: number,
    dateStarted?: string,
    approved?: boolean
  ) => {
    const req = new PerDiem();
    req.setFieldMaskList([
      'NeedsAuditing',
      'PayrollProcessed',
      ...(typeof approved === 'boolean' && !approved ? ['ApprovedById'] : []),
    ]);
    req.setWithRows(true);
    req.setPageNumber(page);
    req.setNeedsAuditing(needsAuditing);
    req.setPayrollProcessed(payrollProcessed);
    req.setNotEqualsList(['DateSubmitted']);
    req.setDateSubmitted(NULL_TIME);
    req.setIsActive(true);
    if (departmentId) {
      req.setDepartmentId(departmentId);
    }
    if (userId) {
      req.setUserId(userId);
    }
    if (dateStarted) {
      req.setDateStarted(`${dateStarted}%`);
    }
    if (typeof approved === 'boolean' && approved) {
      req.setNotEqualsList(['ApprovedById']);
    }
    req.setIsActive(true);
    return await this.BatchGet(req);
  };

  loadPerDiemsReport = async (
    departmentIDs: number[],
    userIDs: number[],
    weeks: string[]
  ) => {
    const config: PerDiemReportConfig = {
      departmentIDs,
      userIDs,
      weeks,
    };
    return await this.getPerDiemReportData(config);
  };

  public upsertPerDiem = async (data: PerDiem) => {
    const id = data.getId();
    if (id !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    return await this[id != 0 ? 'Update' : 'Create'](data);
  };

  public loadGovPerDiemByZipCode = async (zipCode: number, year: number) => {
    const client = new ApiKeyClient(ENDPOINT);
    const req = new ApiKey();
    req.setTextId('per_diem_key');
    const res = await client.Get(req);
    const endpoint = `${res
      .getApiEndpoint()
      .replace('{ZIP}', zipCode.toString())}${year}?api_key=${res.getApiKey()}`;
    const response = await (await fetch(endpoint)).json();
    if (response.rates.length === 0) return false;
    const {
      rates: [
        {
          rate: [
            {
              city,
              county,
              months: { month },
            },
          ],
          state,
        },
      ],
    } = response;
    return { state, city, county, month };
  };
  public loadGovPerDiemData = async (
    apiEndpoint: string,
    apiKey: string,
    zipCode: string,
    year: number,
    month: number
  ) => {
    try {
      const endpoint = `${apiEndpoint.replace(
        '{ZIP}',
        zipCode
      )}${year}?api_key=${apiKey}`;
      const {
        rates: [
          {
            rate: [{ meals, months }],
          },
        ],
      } = await (await fetch(endpoint)).json();
      return {
        [zipCode]: {
          meals: meals,
          lodging: months.month[month - 1].value,
        },
      };
    } catch (e) {
      return { [zipCode]: { meals: 0, lodging: 0 } };
    }
  };
  public loadPerDiemsLodging = async (perDiems: PerDiem[]) => {
    const zipCodesByYearMonth: {
      [key: number]: {
        [key: number]: string[];
      };
    } = {};
    perDiems.forEach(pd =>
      pd
        .getRowsList()
        .filter(pd => !pd.getMealsOnly())
        .forEach(pd => {
          const [y, m] = pd.getDateString().split('-');
          const year = +y;
          const month = +m;
          if (!zipCodesByYearMonth[year]) {
            zipCodesByYearMonth[year] = {};
          }
          if (!zipCodesByYearMonth[year][month]) {
            zipCodesByYearMonth[year][month] = [];
          }
          if (!zipCodesByYearMonth[year][month].includes(pd.getZipCode())) {
            zipCodesByYearMonth[year][month].push(pd.getZipCode());
          }
        })
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
      })
    );
    const govPerDiems = await Promise.all(
      zipCodesArr.map(async ({ year, month, zipCodes }) => ({
        year,
        month,
        data: await this.loadGovPerDiem(zipCodes, year, month),
      }))
    );
    const govPerDiemsByYearMonth: {
      [key: number]: {
        [key: number]: {
          [key: string]: {
            meals: number;
            lodging: number;
          };
        };
      };
    } = {};
    govPerDiems.forEach(({ year, month, data }) => {
      if (!govPerDiemsByYearMonth[year]) {
        govPerDiemsByYearMonth[year] = {};
      }
      govPerDiemsByYearMonth[year][month] = data;
    });
    return perDiems
      .reduce((aggr, pd) => [...aggr, ...pd.getRowsList()], [] as PerDiemRow[])
      .filter(pd => !pd.getMealsOnly())
      .reduce((aggr, pd) => {
        const [y, m] = pd.getDateString().split('-');
        const year = +y;
        const month = +m;
        return {
          ...aggr,
          [pd.getId()]: govPerDiemsByYearMonth[year][month][pd.getZipCode()]
            .lodging,
        };
      }, {});
  };

  public loadGovPerDiem = async (
    zipCodes: string[],
    year: number,
    month: number
  ) => {
    const client = new ApiKeyClient(ENDPOINT);
    const req = new ApiKey();
    req.setTextId('per_diem_key');
    const res = await client.Get(req);
    const results = await Promise.all(
      unique(zipCodes).map(zipCode =>
        this.loadGovPerDiemData(
          res.getApiEndpoint(),
          res.getApiKey(),
          zipCode,
          year,
          month
        )
      )
    );
    return results.reduce((aggr, item) => ({ ...aggr, ...item }), {});
  };

  public tripAsObjectToTrip = (
    asObj: Trip,
    rowId?: number,
    userId?: number
  ): Trip => {
    const req = new Trip();
    let originAddress: string = '';
    let destinationAddress: string = '';

    req.setPerDiemRowId(rowId ? rowId : asObj.getPerDiemRowId());
    req.setUserId(userId ? userId : asObj.getUserId());
    req.setNotes(asObj.getNotes());
    req.setDistanceInMiles(asObj.getDistanceInMiles());
    req.setOriginAddress(originAddress);
    req.setDestinationAddress(destinationAddress);
    return req;
  };

  upsertTrip = async (data: Trip, rowId: number, userId: number) => {
    let results: { distance: number; duration: number };

    try {
      results = await this.MapClient.getTripDistance(
        data.getOriginAddress(),
        data.getDestinationAddress()
      );
    } catch (err) {
      console.error(
        `An error occurred while getting the trip distance: ${err}`
      );
    }
    data.setUserId(userId);
    data.setPerDiemRowId(rowId);
    data.setDistanceInMiles(results.distance);
    data.setCalculatedDurationInSeconds(results.duration);

    try {
      return await this[data.getId() != 0 ? 'UpdateTrip' : 'CreateTrip'](data);
    } catch (err) {
      console.error('Error occurred trying to save trip: ' + err);
    }
  };

  submitPerDiemById = async (id: number) => {
    const req = new PerDiem();
    req.setId(id);
    req.setDateSubmitted(timestamp());
    const fieldMaskList = ['DateSubmitted'];
    req.setFieldMaskList(fieldMaskList);
    return await this.Update(req);
  };

  approvePerDiemById = async (id: number, approvedById: number) => {
    const req = new PerDiem();
    req.setId(id);
    req.setDateApproved(timestamp());
    req.setApprovedById(approvedById);
    const fieldMaskList = ['DateApproved', 'ApprovedById'];
    req.setFieldMaskList(fieldMaskList);
    return await this.Update(req);
  };

  /**
   * Returns a number representing the per diem row id of the current week (or the date provided if
   * one was provided), or undefined if there is an error.
   * @param date
   * @returns number | undefined
   */
  getPerDiemRowIds = async (date?: Date) => {
    const dateToQuery = date != null ? date : new Date();
    let daysToGoBack = 0;
    // If the day is Monday - Friday, we don't have to worry about overflow stuff with the offset
    // (Since our days start on Saturday, not Sunday like JS, we have this weirdness)
    if (dateToQuery.getDay() <= 5) {
      daysToGoBack = dateToQuery.getDay() + 1;
    } else {
      daysToGoBack = dateToQuery.getDay() - 6;
    }
    let dateToQueryMonth = dateToQuery.getMonth() + 1;
    let dateToQueryYear = dateToQuery.getFullYear();
    let dateToQueryDay = dateToQuery.getDate() - daysToGoBack;
    // If the dateToQueryDay is less than 0, that means it occurred last year but this day
    // that is being checked is in the new year, so we act accordingly
    if (dateToQueryDay < 0) {
      dateToQueryMonth = 12;
      dateToQueryYear--;
      dateToQueryDay = 31 + dateToQueryDay;
    }

    // We find the last saturday that happened because that's the start of our weeks
    // and every Saturday per_diem_row is incremented
    const lastSaturday = `${dateToQueryYear}-${padWithZeroes(
      dateToQueryMonth
    )}-${padWithZeroes(dateToQueryDay)} 00:00:00`;

    let perDiemRes: PerDiemList = new PerDiemList();
    try {
      let pd = new PerDiem();
      pd.setDateStarted(lastSaturday);
      perDiemRes = await this.BatchGet(pd);
    } catch (error) {
      if (
        error.startsWith(
          'Error: failed to scan PerDiem query result - sql: no rows in result set'
        )
      ) {
        // There was just no results in the set so we should not error for that,
        // just display it as no trips and if they go to add one add a Per Diem
        // first
        console.log('No per-diem was found for the given date : ', error);
        return;
      }
      console.error(
        'An error occurred while fetching the current Per-Diem period: ',
        error
      );
    }

    if (perDiemRes.getTotalCount() == 0) {
      console.error('No per-diem was found for the given date.');
      return;
    }

    return perDiemRes;
  };

  upsertPerDiemRow = async (data: PerDiemRow) => {
    const id = data.getId();
    if (id !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    return await this[id == 0 ? 'UpdateRow' : 'CreateRow'](data);
  };

  deletePerDiemRowById = async (id: number) => {
    await this.DeleteRow(id);
  };
}
/**
 *
 * @param num number which needs a zero in front if it is less than 10
 * @returns string of the number with 0 in front if it is less than 10, otherwise just
 * the number
 */
function padWithZeroes(num: number): string {
  return num < 10 ? '0' + num : `${num}`;
}
interface PerDiemReportConfig {
  weeks?: string[];
  userIDs?: number[];
  departmentIDs?: number[];
}

type TripInfo = {
  id: number;
  distanceInMiles: number;
  originAddress: string;
  destinationAddress: string;
  perDiemRowId: number;
  fieldMaskList: string[];
  userId: number;
  notes: string;
  payrollProcessed: boolean;
  page: number;
  approved: boolean;
  distanceInDollars: string;
  weekOf: string;
  nameOfEmployee: string;
  departmentName: string;
};

export {
  PerDiem,
  PerDiemList,
  PerDiemClient,
  PerDiemRow,
  PerDiemReportConfig,
  TripInfo,
};
