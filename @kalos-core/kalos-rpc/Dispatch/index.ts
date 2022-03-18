import { grpc } from '@improbable-eng/grpc-web';
import {
  DispatchableTech,
  DispatchableTechList,
  DispatchCall,
  DispatchCallList,
  DispatchCallBack,
  DispatchCallBacksList,
  DispatchCallTime,
  DispatchCallTimeList,
  DispatchCallCount,
  DispatchCallCountList,
  DispatchFirstCall,
  DispatchFirstCallList,
} from '../compiled-protos/dispatch_pb';
import { DispatchService } from '../compiled-protos/dispatch_pb_service';
import {
  UnaryRpcOptions,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';
import { Empty, DateRange } from '../compiled-protos/common_pb';
import { TimeoffRequest, TimeoffRequestList } from '../compiled-protos/timeoff_request_pb';

class DispatchClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async GetDispatchableTechnicians(req : DispatchableTech) {
    return new Promise<DispatchableTechList>((resolve, reject) => {
      const opts: UnaryRpcOptions<DispatchableTech, DispatchableTechList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DispatchService.GetDispatchableTechnicians, opts);
    });
  }

  public async GetDispatchCalls(req : DispatchCall) {
    return new Promise<DispatchCallList>((resolve, reject) => {
      const opts: UnaryRpcOptions<DispatchCall, DispatchCallList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DispatchService.GetDispatchCalls, opts);
    });
  }

  public async GetTimeoffData(req : TimeoffRequest) {
    return new Promise<TimeoffRequestList>((resolve, reject) => {
      const opts: UnaryRpcOptions<TimeoffRequest, TimeoffRequestList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DispatchService.GetTimeoffData, opts);
    });
  }

  public async GetDispatchCallBacks(req : DateRange) {
    return new Promise<DispatchCallBacksList>((resolve, reject) => {
      const opts: UnaryRpcOptions<DateRange, DispatchCallBacksList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DispatchService.GetDispatchCallBacks, opts);
    });
  }

  public async GetDispatchCallTimes(req : DateRange) {
    return new Promise<DispatchCallTimeList>((resolve, reject) => {
      const opts: UnaryRpcOptions<DateRange, DispatchCallTimeList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DispatchService.GetDispatchCallTimes, opts);
    });
  }

  public async GetDispatchCallCount(req : DateRange) {
    return new Promise<DispatchCallCountList>((resolve, reject) => {
      const opts: UnaryRpcOptions<DateRange, DispatchCallCountList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DispatchService.GetDispatchCallCount, opts);
    });
  }

  public async GetDispatchFirstCall() {
    return new Promise<DispatchFirstCallList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Empty, DispatchFirstCallList> = {
        request: new Empty(),
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(DispatchService.GetDispatchFirstCall, opts);
    });
  }
}

export { 
  DispatchableTechList,
  DispatchableTech,
  DispatchClient,
  DispatchCall,
  DispatchCallBack,
  DispatchCallTime,
  DispatchCallCount,
  DispatchFirstCall,
  TimeoffRequest
};
