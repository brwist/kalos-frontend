import { grpc } from '@improbable-eng/grpc-web';
import { TaskService } from '../compiled-protos/task_pb_service';
import {
  Task,
  TaskList,
  ToolFund,
  Spiff,
  SpiffList,
  TaskEventData,
  TaskStatus,
  SpiffType,
  SpiffTypeList,
  SpiffDuplicate,
  ProjectTask,
  ProjectTaskList,
  TaskStatusList,
  TaskPriority,
  TaskPriorityList,
} from '../compiled-protos/task_pb';
import { User } from '../compiled-protos/user_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import { Empty, StringList } from '../compiled-protos/common_pb';
import { NULL_TIME } from '../constants';
import { timestamp } from '../Common';
class TaskClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Task) {
    return new Promise<Task>((resolve, reject) => {
      const opts: UnaryRpcOptions<Task, Task> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskService.Create, opts);
    });
  }

  public async CreateProjectTask(req: ProjectTask) {
    return new Promise<ProjectTask>((resolve, reject) => {
      const opts: UnaryRpcOptions<ProjectTask, ProjectTask> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskService.CreateProjectTask, opts);
    });
  }

  public async Get(req: Task) {
    return new Promise<Task>((resolve, reject) => {
      const opts: UnaryRpcOptions<Task, Task> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskService.Get, opts);
    });
  }

  public async GetProjectTask(req: ProjectTask) {
    return new Promise<ProjectTask>((resolve, reject) => {
      const opts: UnaryRpcOptions<ProjectTask, ProjectTask> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskService.GetProjectTask, opts);
    });
  }

  public async List(req: Task, cb: (arg: Task) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Task, Task> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Task) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(TaskService.List, opts);
    });
  }

  public async Update(req: Task) {
    return new Promise<Task>((resolve, reject) => {
      const opts: UnaryRpcOptions<Task, Task> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskService.Update, opts);
    });
  }

  public async UpdateProjectTask(req: ProjectTask) {
    return new Promise<ProjectTask>((resolve, reject) => {
      const opts: UnaryRpcOptions<ProjectTask, ProjectTask> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskService.UpdateProjectTask, opts);
    });
  }

  public async Delete(req: Task) {
    return new Promise<Task>((resolve, reject) => {
      const opts: UnaryRpcOptions<Task, Task> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskService.Delete, opts);
    });
  }

  public async DeleteProjectTask(req: ProjectTask) {
    return new Promise<ProjectTask>((resolve, reject) => {
      const opts: UnaryRpcOptions<ProjectTask, ProjectTask> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskService.DeleteProjectTask, opts);
    });
  }

  public async BatchGet(req: Task) {
    return new Promise<TaskList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Task, TaskList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TaskList>) => {
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
      grpc.unary(TaskService.BatchGet, opts);
    });
  }

  public async BatchGetProjectTasks(req: ProjectTask) {
    return new Promise<ProjectTaskList>((resolve, reject) => {
      const opts: UnaryRpcOptions<ProjectTask, ProjectTaskList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ProjectTaskList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(TaskService.BatchGetProjectTasks, opts);
    });
  }

  public async GetToolFundBalanceByID(userID: number) {
    const req = new ToolFund();
    req.setId(userID);
    return new Promise<ToolFund>((resolve, reject) => {
      const opts: UnaryRpcOptions<ToolFund, ToolFund> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<ToolFund>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.GetToolFundBalanceByID(userID);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(TaskService.GetToolFundBalanceByID, opts);
    });
  }

  public async GetTaskStatusList(req: TaskStatus) {
    return new Promise<TaskStatusList>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskStatus, TaskStatusList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: output => {
          if (output.message) {
            resolve(output.message);
          } else {
            reject(output.statusMessage);
          }
        },
      };
      grpc.unary(TaskService.GetTaskStatusList, opts);
    });
  }

  public async GetTaskPriorityList(req: TaskPriority) {
    return new Promise<TaskPriorityList>((resolve, reject) => {
      const opts: UnaryRpcOptions<TaskPriority, TaskPriorityList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: output => {
          if (output.message) {
            resolve(output.message);
          } else {
            reject(output.statusMessage);
          }
        },
      };
      grpc.unary(TaskService.GetTaskPriorityList, opts);
    });
  }

  public async GetSpiffTypes(req?: SpiffType) {
    return new Promise<SpiffTypeList>((resolve, reject) => {
      const opts: UnaryRpcOptions<SpiffType, SpiffTypeList> = {
        request: req || spiffTypeReq(),
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: output => {
          if (output.message) {
            resolve(output.message);
          } else {
            reject(output.statusMessage);
          }
        },
      };
      grpc.unary(TaskService.GetSpiffTypes, opts);
    });
  }

  // Called GetTaskBillableTypeList in the server side of things
  public async LoadTaskBillableTypeList() {
    return new Promise<StringList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Empty, StringList> = {
        request: new Empty(),
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: output => {
          if (output.message) {
            resolve(output.message);
          } else {
            reject(output.statusMessage);
          }
        },
      };
      grpc.unary(TaskService.GetTaskBillableTypeList, opts);
    });
  }

  // public async loadTaskBillableTypeList() {
  //   return new Promise<string[]>((resolve, reject) => {
  //     const opts: UnaryRpcOptions<Empty, StringList> = {
  //       request: new Empty(),
  //       host: this.host,
  //       metadata: this.getMetaData(),
  //       onEnd: output => {
  //         if (output.message) {
  //           resolve(output.message.toArray());
  //         } else {
  //           reject(output.statusMessage);
  //         }
  //       },
  //     };
  //     grpc.unary(TaskService.GetTaskBillableTypeList, opts);
  //   });
  // }
  public async GetAppliedSpiffs(userID: number) {
    const req = new Spiff();
    req.setExternalId(userID);
    return new Promise<SpiffList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Spiff, SpiffList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TaskService.GetAppliedSpiffs, opts);
    });
  }

  public async newToolPurchase(
    amount: number,
    userID: number,
    ref: string,
    description: string,
    timestamp: string
  ) {
    const req = new Task();
    const timeStr = `${new Date().valueOf()}`;
    req.setExternalCode('user');
    req.setBillableType('Tool Purchase');
    req.setToolpurchaseCost(amount);
    req.setExternalId(userID);
    req.setCreatorUserId(userID);
    req.setReferenceNumber(ref);
    req.setBriefDescription(description);
    req.setPriorityId(2);
    req.setSpiffJobNumber('');
    req.setDatePerformed(timestamp);
    req.setSpiffToolId(`SPF-${userID}-${timeStr.substr(timeStr.length - 4)}`);
    return await this.Create(req);
  }

  public async loadTaskStatuses() {
    const req = new TaskStatus();
    return await this.GetTaskStatusList(req);
  }

  public async loadTaskPriorityList() {
    const req = new TaskPriority();
    return await this.GetTaskPriorityList(req);
  }
  public async loadSpiffTypes() {
    const req = new SpiffType();
    req.setIsActive(true);
    const res = await this.GetSpiffTypes(req);
    return res
      .getResultsList()
      .filter(item => !!item.getExt())
      .sort((a, b) => {
        if (a.getExt() < b.getExt()) return -1;
        if (a.getExt() > b.getExt()) return 1;
        return 0;
      });
  }
  public deleteProjectTaskById = async (id: number) => {
    const req = new ProjectTask();
    req.setId(id);
    await this.DeleteProjectTask(req);
  };

  public loadProjectTaskPriorities = async () => {
    const res = await this.loadTaskPriorityList();
    return res.getResultsList();
  };

  public loadProjectTaskStatuses = async () => {
    const res = await this.loadTaskStatuses();
    return res.getResultsList();
  };

  public loadSpiffToolLogs = async ({
    page,
    type,
    technician,
    description,
    datePerformed,
    beginDate,
    endDate,
    jobNumber,
  }: {
    page: number;
    type: 'Spiff' | 'Tool';
    technician?: number;
    description?: string;
    datePerformed?: string;
    beginDate?: string;
    endDate?: string;
    jobNumber?: string;
  }) => {
    const req = new Task();
    req.setPageNumber(page);
    req.setIsActive(true);
    req.setOrderBy(type === 'Spiff' ? 'date_performed' : 'time_due');
    req.setOrderDir('ASC');
    if (technician) {
      req.setExternalId(technician);
    }
    req.setBillableType(type === 'Spiff' ? 'Spiff' : 'Tool Purchase');
    if (description) {
      req.setBriefDescription(`%${description}%`);
    }
    if (datePerformed) {
      req.setDatePerformed(datePerformed);
    }
    if (beginDate && endDate) {
      req.setDateRangeList(['>=', beginDate, '<', endDate]);
      req.setDateTargetList(['date_performed', 'date_performed']);
    }
    if (jobNumber) {
      req.setSpiffJobNumber(`%${jobNumber}%`);
    }
    const res = await this.BatchGet(req);
    const resultsList = res.getResultsList();
    const count = res.getTotalCount();
    return { resultsList, count };
  };

  public deleteSpiffTool = async (id: number) => {
    const req = new Task();
    req.setId(id);
    await this.Delete(req);
  };

  public GetPendingTasks = (billableType: string) => {
    return async (config: GetPendingSpiffConfig) => {
      const req = new Task();
      req.setOrderBy(billableType === 'Spiff' ? 'date_performed' : 'time_due');
      req.setBillableType(billableType);
      if (billableType === 'Spiff') {
        req.setDatePerformed(NULL_TIME);
        req.setNotEqualsList(['DatePerformed']);
      }
      if (billableType === 'Tool Purchase') {
        req.setTimeDue(NULL_TIME);
        req.setNotEqualsList(['TimeDue']);
      }
      req.setIsActive(true);
      req.setGroupBy('external_id');
      req.setPageNumber(config.page || 0);
      if (config.role === 'Manager') {
        req.setFieldMaskList(['AdminActionId']);
        if (billableType === 'Spiff') {
          req.setNotEqualsList(['DatePerformed']);
        }
        if (billableType === 'Tool Purchase') {
          req.setNotEqualsList(['TimeDue']);
        }
      }
      if (config.role === 'Payroll') {
        if (billableType === 'Spiff') {
          req.setAdminActionId(0);
          req.setNotEqualsList(['AdminActionId', 'DatePerformed']);
        }
        if (billableType === 'Tool Purchase') {
          req.setAdminActionId(0);
          req.setNotEqualsList(['AdminActionId', 'TimeDue']);
        }
      }
      if (config.role === 'Auditor') {
        console.log('Spiff Tool auditor');
        if (billableType === 'Spiff') {
          req.setNotEqualsList([
            'AdminActionId',
            'DatePerformed',
            'NeedsAuditing',
          ]);
        }
        if (billableType === 'Tool Purchase') {
          req.setNotEqualsList(['AdminActionId', 'TimeDue', 'NeedsAuditing']);
        }
      }
      if (config.processed) {
        req.setPayrollProcessed(config.processed);
      }
      if (config.technicianUserID) {
        req.setExternalId(config.technicianUserID);
      }
      if (config.startDate && config.endDate) {
        req.setDateRangeList(['>=', config.startDate, '<=', config.endDate]);
      }
      if (config.option) {
        const spiffType = new SpiffType();
        spiffType.setPayout(config.option);
        req.setSpiffType(spiffType);
      }
      if (config.departmentId) {
        let u = new User();
        u.setEmployeeDepartmentId(config.departmentId);
        req.setSearchUser(u);
      }
      console.log(req);
      return await this.BatchGet(req);
    };
  };

  public upsertTask = async (data: Task) => {
    const id = data.getId();
    if (id !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    const res = await this[id != 0 ? 'Update' : 'Create'](data);
    return res.getId();
  };

  public updateSpiffTool = async (data: Task) => {
    if (data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    await this.Update(data);
  };
  public loadPendingSpiffs = this.GetPendingTasks('Spiff');
  public loadPendingToolLogs = this.GetPendingTasks('Tool Purchase');

  /**
   *
   * @param pt a project task. FieldMaskList MUST be configured if the ID is not 0
   */
  public upsertEventTask = async (pt: ProjectTask) => {
    const req = new ProjectTask();
    req.setTimeCreated(timestamp());
    if (pt.getEventId()) {
      req.setEventId(pt.getEventId());
    }
    const id = pt.getId();
    if (id) {
      req.setId(id);
    }
    const externalId = pt.getExternalId();
    if (externalId) {
      req.setExternalId(externalId);
      req.setExternalCode('user');
    } else {
      req.setExternalId(0);
      req.setExternalCode('project');
    }
    const briefDescription = pt.getBriefDescription();
    if (briefDescription) {
      req.setBriefDescription(briefDescription);
    }
    const creatorUserId = pt.getCreatorUserId();
    if (creatorUserId) {
      req.setCreatorUserId(creatorUserId);
    }
    const statusId = pt.getStatusId();
    if (statusId) {
      req.setStatusId(statusId);
    }
    const startDate = pt.getStartDate();
    if (startDate) {
      req.setStartDate(startDate);
    }
    const endDate = pt.getEndDate();
    if (endDate) {
      req.setEndDate(endDate);
    }
    const priorityId = pt.getPriorityId();
    if (priorityId) {
      req.setPriorityId(priorityId);
    }
    const checkedIn = pt.getCheckedIn();
    if (checkedIn != undefined) {
      req.setCheckedIn(checkedIn);
    }
    req.setFieldMaskList(pt.getFieldMaskList());
    await this[id ? 'UpdateProjectTask' : 'CreateProjectTask'](req);
  };

  public loadTasks = async (filter: Task) => {
    return await this.BatchGet(filter);
  };
}

function spiffTypeReq() {
  const res = new SpiffType();
  res.setIsActive(true);
  return res;
}
interface GetPendingSpiffConfig {
  page?: number;
  technicianUserID?: number;
  startDate?: string;
  endDate?: string;
  role?: string;
  departmentId?: number;
  option?: string;
  processed?: boolean;
}

export {
  Task,
  TaskList,
  TaskClient,
  Spiff,
  SpiffList,
  TaskEventData,
  TaskStatus,
  SpiffType,
  SpiffTypeList,
  SpiffDuplicate,
  ProjectTask,
  ProjectTaskList,
  TaskPriority,
  GetPendingSpiffConfig,
  spiffTypeReq,
};
