import { grpc } from '@improbable-eng/grpc-web';
import { AuthService } from '../compiled-protos/auth_pb_service';
import { AuthData, Token } from '../compiled-protos/auth_pb';
import {
  UnaryOutput,
  UnaryRpcOptions,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { HOST, AUTH_KEY } from '../constants';
import { ProtobufMessage } from '@improbable-eng/grpc-web/dist/typings/message';
import { ActivityLog } from '../compiled-protos/activity_log_pb';
import { ActivityLogService } from '../compiled-protos/activity_log_pb_service';
import { getPosition } from '../Common';

export interface ActivityLogConfig {
  name: string;
  propertyID?: number;
  contractID?: number;
  customerID?: number;
  taskID?: number;
  eventID?: number;
}

export class BaseClient {
  host: string;
  userID: number;
  constructor(host?: string, userID?: number) {
    this.host = host || HOST;
    this.userID = userID || 0;
  }
  private storeToken(token: string) {
    localStorage.setItem(AUTH_KEY, token);
  }
  private async makeLog(config: ActivityLogConfig) {
    const req = new ActivityLog();
    req.setUserId(this.userID);
    req.setActivityName(config.name);
    if (config.propertyID) {
      req.setPropertyId(config.propertyID);
    }
    if (config.customerID) {
      req.setCustomerId(config.customerID);
    }
    if (config.eventID) {
      req.setEventId(config.eventID);
    }
    if (config.contractID) {
      req.setContractId(config.contractID);
    }
    if (config.taskID) {
      req.setTaskId(config.taskID);
    }
    try {
      const pos = await getPosition();
      req.setGeolocationLng(pos.coords.longitude);
      req.setGeolocationLat(pos.coords.latitude);
    } catch (err) {
      console.log('could not set coordinates: ', err);
    }

    const opts: UnaryRpcOptions<ActivityLog, ActivityLog> = {
      request: req,
      host: this.host,
      onEnd: (res: UnaryOutput<ActivityLog>) => {
        console.log(res);
      },
    };
    grpc.unary(ActivityLogService.Create, opts);
  }
  protected getMetaData() {
    const token = localStorage.getItem(AUTH_KEY);
    const md = new grpc.Metadata();
    if (token) {
      md.append('authorization', token);
      return md;
    }
    return '';
  }
  protected onUnaryEnd = <T extends ProtobufMessage>(
    resolve: any,
    reject: any,
    logConfig?: ActivityLogConfig
  ) => {
    return (result: UnaryOutput<T>) => {
      if (result.trailers.headersMap['new-identity']) {
        this.storeToken(result.trailers.headersMap['new-identity'][0]);
      }
      if (result.message) {
        if (logConfig && this.userID !== 0) {
          this.makeLog(logConfig);
        }
        resolve(result.message);
      } else {
        reject(new Error(result.statusMessage));
      }
    };
  };

  public async GetToken(username: string, password: string) {
    return new Promise<boolean | void>((resolve, reject) => {
      const req = new AuthData();
      req.setUsername(username);
      req.setPassword(password);
      const opts: UnaryRpcOptions<AuthData, Token> = {
        request: req,
        host: this.host,
        onEnd: (res: UnaryOutput<Token>) => {
          if (res.message) {
            const resp = res.message;
            this.storeToken(resp.getAsString());
            resolve(true);
          } else {
            reject(res.statusMessage);
          }
        },
      };
      grpc.unary(AuthService.GetToken, opts);
    });
  }
}
