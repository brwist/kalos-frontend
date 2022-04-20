import { grpc } from '@improbable-eng/grpc-web';
import { UserService } from '../compiled-protos/user_pb_service';
import {
  User,
  UserList,
  CardData,
  CardDataList,
  Vehicle,
  VehicleList,
  PermissionGroupUser,
  PermissionGroup,
  PermissionGroupUserList,
  PermissionGroupList,
} from '../compiled-protos/user_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';
import { OrderDir } from '../Common';
import { Empty, Int32, Int32List, Bool } from '../compiled-protos/common_pb';

class UserClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }
  public async GetCardList(req: CardData) {
    return new Promise<CardData[]>((resolve, reject) => {
      const opts: UnaryRpcOptions<CardData, CardDataList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<CardDataList>) => {
          if (result.message) {
            resolve(result.message.getDataList());
          } else {
            reject(result.statusMessage);
          }
        },
      };
      grpc.unary(UserService.GetCardList, opts);
    });
  }

  public async loadCardList() {
    const req = new CardData();
    return await this.GetCardList(req);
  }

  public async Create(req: User) {
    return new Promise<User>((resolve, reject) => {
      const opts: UnaryRpcOptions<User, User> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.Create, opts);
    });
  }

  public async Get(req: User) {
    return new Promise<User>((resolve, reject) => {
      const opts: UnaryRpcOptions<User, User> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.Get, opts);
    });
  }

  public async GetUserManager(req: User) {
    return new Promise<User>((resolve, reject) => {
      const opts: UnaryRpcOptions<User, User> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.GetUserManager, opts);
    });
  }

  public async List(req: User, cb: (arg: User) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<User, User> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: User) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(UserService.List, opts);
    });
  }

  public async Update(req: User) {
    return new Promise<User>((resolve, reject) => {
      const opts: UnaryRpcOptions<User, User> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.Update, opts);
    });
  }

  public async Delete(req: User) {
    return new Promise<User>((resolve, reject) => {
      const opts: UnaryRpcOptions<User, User> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.Delete, opts);
    });
  }

  public async BatchGet(req: User) {
    return new Promise<UserList>((resolve, reject) => {
      const opts: UnaryRpcOptions<User, UserList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<UserList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(new Error(result.statusMessage));
          }
        },
      };
      grpc.unary(UserService.BatchGet, opts);
    });
  }

  public async GetVehicle(req: Vehicle) {
    return new Promise<Vehicle>((resolve, reject) => {
      const opts: UnaryRpcOptions<Vehicle, Vehicle> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.GetVehicle, opts);
    });
  }

  public async BatchGetUsersByIds(req: number[], overrideLimit = false) {
    return this.loadUsersByIds(req, overrideLimit);
  }
  /**
   * Returns loaded User by its ids
   * @param id: user id
   * @returns User
   */
  public async loadUserById(id: number, withProperties?: boolean) {
    try {
      const req = new User();
      req.setId(id);
      if (withProperties) {
        req.setWithProperties(true);
      }
      return await this.Get(req);
    } catch (err) {
      console.error('Failed to fetch user with id', id, err);
      const res = new User();
      res.setId(id);
      res.setIsActive(1);
      res.setIsEmployee(1);
      return res;
    }
  }

  public async GetUserIdsInPermissionGroup(id: number) {
    return new Promise<number[]>((resolve, reject) => {
      const req = new Int32();
      req.setValue(id);
      const opts: UnaryRpcOptions<Int32, Int32List> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<Int32List>) => {
          if (result.status !== grpc.Code.OK) {
            reject(result.statusMessage);
          } else {
            resolve(result.message!.getValuesList());
          }
        },
      };
      grpc.unary(UserService.GetUserIdsInPermissionGroup, opts);
    });
  }
  public async AddUserToPermissionGroup(req: PermissionGroupUser) {
    return new Promise<boolean>((resolve, reject) => {
      const opts: UnaryRpcOptions<PermissionGroupUser, Bool> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.AddUserToPermissionGroup, opts);
    });
  }
  public async GetPermissionGroupUser(req: PermissionGroupUser) {
    return new Promise<PermissionGroupUser>((resolve, reject) => {
      const opts: UnaryRpcOptions<PermissionGroupUser, PermissionGroupUser> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.GetPermissionGroupUser, opts);
    });
  }
  public async BatchGetPermissionGroupUser(req: PermissionGroupUser) {
    return new Promise<PermissionGroupUserList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PermissionGroupUser,
        PermissionGroupUserList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.BatchGetPermissionGroupUser, opts);
    });
  }
  public async RemoveUserFromPermissionGroup(req: PermissionGroupUser) {
    return new Promise<PermissionGroupUser>((resolve, reject) => {
      const opts: UnaryRpcOptions<PermissionGroupUser, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.RemoveUserFromPermissionGroup, opts);
    });
  }
  public async BatchGetPermission(req: PermissionGroup) {
    return new Promise<PermissionGroupList>((resolve, reject) => {
      const opts: UnaryRpcOptions<PermissionGroup, PermissionGroupList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.BatchGetPermissions, opts);
    });
  }
  public async BatchGetUserPermissions(req: PermissionGroupUser) {
    return new Promise<PermissionGroupUserList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        PermissionGroupUser,
        PermissionGroupUserList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.BatchGetUserPermissions, opts);
    });
  }
  /**
   * fetches technicians
   * @returns User[]
   */
  public async loadTechnicians() {
    const req = new User();
    req.setIsActive(1);
    req.setIsEmployee(1);
    req.setOverrideLimit(true);
    const data = await this.BatchGet(req);
    return data.getResultsList().sort((a, b) => {
      const A = `${a.getFirstname()} ${a.getLastname()}`.toLocaleLowerCase();
      const B = `${b.getFirstname()} ${b.getLastname()}`.toLocaleLowerCase();
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
  }

  public async loadCreditCardWithAccount(account: string) {
    const req = new CardData();
    req.setAccount(account);
    req.setWithUser(true);
    return await this.GetCardList(req);
  }

  /** Returns all loaded Users by department id, does not support pagination, returns in alphabetical order
   * @param departmentId: number
   * @returns User[]
   */
  public async loadUsersByDepartmentId(departmentId: number) {
    const req = new User();
    req.setIsActive(1);
    req.setEmployeeDepartmentId(departmentId);
    req.setOverrideLimit(true);
    const data = await this.BatchGet(req);
    return data.getResultsList().sort((a, b) => {
      const A = `${a.getFirstname()} ${a.getLastname()}`.toLocaleLowerCase();
      const B = `${b.getFirstname()} ${b.getLastname()}`.toLocaleLowerCase();
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
  }

  public deleteUserById = async (id: number) => {
    const req = new User();
    req.setId(id);
    await this.Delete(req);
  };

  public async getUserManagerByUserID(ID: number) {
    const req = new User();
    req.setId(ID);
    return this.GetUserManager(req);
  }

  public getEmailByUserID = async (ID: number) => {
    const req = new User();
    req.setId(ID);
    return (await this.Get(req)).getEmail();
  };

  /**
   * Returns loaded Users by their ids
   * @param ids: array of user id
   * @returns object { [userId]: User }
   */
  public async loadUsersByIds(ids: number[], overrideLimit = false) {
    const req = new User();
    req.setUserIdList(ids.join(','));
    req.setOverrideLimit(overrideLimit);
    return await this.BatchGet(req);
  }

  public saveUser = async (data: User, userId?: number) => {
    if (userId) {
      data.setId(userId);
    }
    if (data.getId() !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    return await this[userId ? 'Update' : 'Create'](data);
  };

  public getBusinessName = (c: User): string =>
    c ? c.getBusinessname().trim() : '';

  public getCustomerPhone = (c: User): string => (c ? c.getPhone().trim() : '');

  public getCustomerPhoneWithExt = (c: User): string =>
    c ? `${c.getPhone().trim()}${c.getExt() ? `, ${c.getExt()}` : ''}` : '';

  public getCustomerNameAndBusinessName = (c: User): string => {
    const name = this.getCustomerName(c);
    const businessname = this.getBusinessName(c);
    return `${name}${businessname ? ' - ' : ''}${businessname}`.trim();
  };

  public getCustomerName = (c: User, lastNameFirst: boolean = false): string =>
    c
      ? (lastNameFirst
          ? `${c.getLastname()}, ${c.getFirstname()}`
          : `${c.getFirstname()} ${c.getLastname()}`
        ).trim()
      : '';

  /**
   * Returns Users by filter
   * @param page number (use -1 to disable pagination)
   * @param filter UsersFilter
   * @param sort sort
   * @returns {results: User[], totalCount: number}
   */
  loadUsersByFilter = async ({
    page,
    filter,
    sort,
    withProperties = false,
  }: LoadUsersByFilter) => {
    const { orderBy, orderDir } = sort;
    const req = new User();
    req.setOrderBy(orderBy);
    req.setOrderDir(orderDir);
    req.setIsEmployee(0);
    req.setIsActive(1);
    if (filter.businessname) {
      req.setBusinessname(`%${filter.businessname}%`);
    }
    if (filter.cellphone) {
      req.setCellphone(`%${filter.cellphone}%`);
    }
    if (filter.email) {
      req.setEmail(`%${filter.email}%`);
    }
    if (filter.empTitle) {
      req.setEmpTitle(`%${filter.empTitle}%`);
    }
    if (filter.employeeDepartmentId) {
      req.setEmployeeDepartmentId(filter.employeeDepartmentId);
    }
    if (filter.firstname) {
      req.setFirstname(`%${filter.firstname}%`);
    }
    if (filter.isEmployee) {
      req.setIsEmployee(filter.isEmployee);
    }
    if (filter.lastname) {
      req.setLastname(`%${filter.lastname}%`);
    }
    if (filter.phone) {
      req.setPhone(`%${filter.phone}%`);
    }
    if (filter.ext) {
      req.setExt(`%${filter.ext}%`);
    }
    if (page === -1) {
      req.setOverrideLimit(true);
    } else {
      req.setPageNumber(page);
    }
    if (withProperties) {
      req.setWithProperties(true);
    }

    const data = await this.BatchGet(req);
    return {
      results: data.getResultsList().sort((a, b) => {
        const A = (a.getOrderBy() || '').toString().toLowerCase();
        const B = (b.getOrderBy() || '').toString().toLowerCase();
        if (A < B) return orderDir === 'DESC' ? 1 : -1;
        if (A > B) return orderDir === 'DESC' ? -1 : 1;
        return 0;
      }),
      totalCount: data.getTotalCount(),
    };
  };

  public async CreateVehicle(req: Vehicle) {
    return new Promise<Vehicle>((resolve, reject) => {
      const opts: UnaryRpcOptions<Vehicle, Int32> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.CreateVehicle, opts);
    });
  }

  public async UpdateVehicle(req: Vehicle) {
    return new Promise<Empty>((resolve, reject) => {
      const opts: UnaryRpcOptions<Vehicle, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.UpdateVehicle, opts);
    });
  }

  public async DeleteVehicle(req: Int32) {
    return new Promise<Empty>((resolve, reject) => {
      const opts: UnaryRpcOptions<Int32, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(UserService.DeleteVehicle, opts);
    });
  }

  public async BatchGetVehicles(req: Vehicle) {
    return new Promise<VehicleList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Vehicle, VehicleList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<VehicleList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            reject(result.statusMessage);
          }
        },
      };
      grpc.unary(UserService.BatchGetVehicle, opts);
    });
  }
}

type UsersSort = {
  orderByField: keyof User;
  orderBy: string;
  orderDir: OrderDir;
};

type LoadUsersByFilter = {
  page: number;
  filter: UsersFilter;
  sort: UsersSort;
  withProperties?: boolean;
};

type UsersFilter = {
  firstname?: string;
  lastname?: string;
  businessname?: string;
  phone?: string;
  email?: string;
  isEmployee?: number;
  empTitle?: string;
  employeeDepartmentId?: number;
  ext?: string;
  cellphone?: string;
  id?: number;
};

export {
  User,
  UserList,
  UserClient,
  CardData,
  CardDataList,
  UsersSort,
  LoadUsersByFilter,
  UsersFilter,
};
