import { grpc } from '@improbable-eng/grpc-web';
import { EventService } from '../compiled-protos/event_pb_service';
import {
  Event,
  EventList,
  CalendarData,
  CostReportData,
  CostReportReq,
  Quotable,
  QuotableList,
  QuotableRead,
} from '../compiled-protos/event_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import { ProjectTask, ProjectTaskList } from '../compiled-protos/task_pb';
import { Double, Int32 } from '../compiled-protos/common_pb';

class EventClient extends BaseClient {
  req: Event;
  constructor(host?: string, userID?: number) {
    super(host, userID);
    this.req = new Event();
  }

  public async Create(req: Event) {
    return new Promise<Event>((resolve, reject) => {
      const opts: UnaryRpcOptions<Event, Event> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventService.Create, opts);
    });
  }

  public async Get(req: Event) {
    return new Promise<Event>((resolve, reject) => {
      const opts: UnaryRpcOptions<Event, Event> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventService.Get, opts);
    });
  }

  public async GetCalendarData(req: Event) {
    return new Promise<CalendarData>((resolve, reject) => {
      const opts: UnaryRpcOptions<Event, CalendarData> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (output: UnaryOutput<CalendarData>) => {
          if (output.message) {
            resolve(output.message);
          } else {
            reject(output.statusMessage);
          }
        },
      };
      grpc.unary(EventService.GetCalendarData, opts);
    });
  }

  public async BatchGetCostReportData(req: CostReportReq) {
    return new Promise<CostReportData>((resolve, reject) => {
      const opts: UnaryRpcOptions<CostReportReq, CostReportData> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<CostReportData>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.BatchGetCostReportData(req);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(EventService.BatchGetCostReportData, opts);
    });
  }
  public async List(req: Event, cb: (arg: Event) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Event, Event> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Event) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(EventService.List, opts);
    });
  }

  public async Update(req: Event) {
    return new Promise<Event>((resolve, reject) => {
      const opts: UnaryRpcOptions<Event, Event> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventService.Update, opts);
    });
  }

  public async Delete(req: Event) {
    return new Promise<Event>((resolve, reject) => {
      const opts: UnaryRpcOptions<Event, Event> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(EventService.Delete, opts);
    });
  }

  public async BatchGet(req: Event) {
    return new Promise<EventList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Event, EventList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<EventList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.BatchGet(req);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(EventService.BatchGet, opts);
    });
  }

  public async WriteQuotes(q: Quotable) {
    return new Promise<Quotable>((resolve, reject) => {
      const opts: UnaryRpcOptions<Quotable, Quotable> = {
        request: q,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Quotable>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(result.statusMessage);
          }
        },
      };
      grpc.unary(EventService.WriteQuote, opts);
    });
  }

  public async ReadQuotes(q: QuotableRead) {
    return new Promise<QuotableList>((resolve, reject) => {
      const opts: UnaryRpcOptions<QuotableRead, QuotableList> = {
        request: q,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<QuotableList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(result.statusMessage);
          }
        },
      };
      grpc.unary(EventService.ReadQuotes, opts);
    });
  }

  public async GetProjectTasks(t: ProjectTask) {
    return new Promise<ProjectTaskList>((resolve, reject) => {
      const opts: UnaryRpcOptions<ProjectTask, ProjectTaskList> = {
        request: t,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ProjectTaskList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(result.statusMessage);
          }
        },
      };
      grpc.unary(EventService.GetProjectTasks, opts);
    });
  }

  /**
   * Returns tasks associated with the provided event ID
   * @param ID ID of an event
   */
  public async loadTasksByEventID(ID: number) {
    const req = new ProjectTask();
    req.setEventId(ID);
    req.setIsActive(true);
    req.setOrderBy('hourly_start');
    req.setOrderDir('asc');
    return await this.GetProjectTasks(req);
  }

  /**
   * Checks event.log_technicianAssigned for presence of provided user_id
   * @param ID the user ID
   * @param page
   */
  public async loadEventsByUserID(ID: number, page = 0) {
    const req = new Event();
    req.setLogTechnicianAssigned(`%${ID}%`);
    req.setPageNumber(page);
    return await this.BatchGet(req);
  }

  /**
   *  Loads an event by a service call Id
   * @param ServiceCallID The service call Id
   * @param Page
   */
  public async LoadEventByServiceCallID(ID: number) {
    const req = new Event();
    req.setId(ID);
    return await this.Get(req);
  }

  /**
   *  Loads an event by a service call Id
   * @param ServiceCallID The service call Id
   * @param Page
   */
  public async LoadEventsByServiceCallID(ID: number) {
    const req = new Event();
    req.setId(ID);
    return await this.BatchGet(req);
  }

  public async deleteEventById(ID: number) {
    const req = new Event();
    req.setId(ID);
    await this.Delete(req);
  }

  /**
   * Gets a single event with the provided ID
   * @param ID
   */
  public async loadEvent(ID: number) {
    const req = new Event();
    req.setId(ID);
    return this.Get(req);
  }

  public loadProjectTasks = async (eventId: number) => {
    const data = await this.loadTasksByEventID(eventId);
    return data.getResultsList().sort((a, b) => {
      const A = a.getStartDate();
      const B = b.getStartDate();
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
  };

  public loadQuotable = async (id: number) => {
    const req = new QuotableRead();
    req.setEventId(id);
    req.setIsActive(true);
    req.setFieldMaskList(['IsActive']);
    const res = await this.ReadQuotes(req);
    return res.getDataList();
  };

  public loadQuotableList = async (filter: QuotableRead) => {
    return await this.ReadQuotes(filter);
  };

  public async getLaborHoursByEventID(eventID: number) {
    return new Promise((resolve, reject) => {
      const req = new Int32();
      req.setValue(eventID);
      const opts: UnaryRpcOptions<Int32, Double> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Double>) => {
          if (result.status !== grpc.Code.OK) {
            reject(result.statusMessage);
          } else {
            resolve(result.message?.getValue());
          }
        },
      };
      grpc.unary(EventService.GetLaborHoursByEventID, opts);
    });
  }
  /**
   * Returns loaded QuoteParts
   * @returns QuotePart[]
   */
  public async loadQuoteParts(filter: QuotableRead) {
    const results: Quotable[] = [];
    const data = await this.loadQuotableList(filter);

    const list = data.getDataList();
    const listLen = list.length;
    const totalCount = data.getTotalCount();
    results.concat(data.getDataList());
    if (totalCount > listLen) {
      const batchesAmount = Math.ceil((totalCount - listLen) / listLen);
      const batchResults = await Promise.all(
        Array.from(Array(batchesAmount)).map(async (_, idx) => {
          return (await this.loadQuotableList(filter)).getDataList();
        })
      );
      results.push(
        ...batchResults.reduce((aggr, item) => [...aggr, ...item], [])
      );
    }
    return results;
  }
  public async updateMaterialUsed(
    serviceCallId: number,
    materialUsed: string,
    materialTotal: number
  ) {
    const req = new Event();
    req.setId(serviceCallId);
    req.setMaterialUsed(materialUsed);
    req.setMaterialTotal(materialTotal);
    req.setFieldMaskList(['MaterialUsed', 'MaterialTotal']);
    await this.Update(req);
  }

  /**
   * Returns loaded Events by property id
   * @param propertyId: property id
   * @returns Event[]
   */
  public async loadEventsByPropertyId(propertyId: number) {
    const req = new Event();
    req.setIsActive(1);
    req.setPropertyId(propertyId);
    req.setWithoutLimit(true);
    const res = await this.BatchGet(req);
    return res.getResultsList().sort((a, b) => {
      const A = a.getLogJobNumber().toLocaleLowerCase();
      const B = b.getLogJobNumber().toLocaleLowerCase();
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
  }

  public upsertEvent = async (data: Event) => {
    return await this[data.getId() ? 'Update' : 'Create'](data);
  };
}

export { Event, EventList, EventClient, Quotable, QuotableList };
