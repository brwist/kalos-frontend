import { grpc } from '@improbable-eng/grpc-web';
import { SlackService } from '../compiled-protos/slack_pb_service';
import { DispatchReq, DMReq, FCReq } from '../compiled-protos/slack_pb';
import { UnaryRpcOptions } from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';
import { Bool } from '../compiled-protos/common_pb';

class SlackClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Dispatch(eventID: number, userID: number, dispatcherID: number, dmOnly = false) {
    const req = new DispatchReq();
    req.setEventId(eventID), req.setUserId(userID), req.setDispatcherId(dispatcherID), req.setDmOnly(dmOnly);
    return new Promise<Bool>((resolve, reject) => {
      const opts: UnaryRpcOptions<DispatchReq, Bool> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SlackService.Dispatch, opts);
    });
  }

  public async DirectMessageUser(userID: number, msg: string, dispatcherID = 0, escape = false) {
    const req = new DMReq();
    req.setUserId(userID);
    req.setText(msg);
    req.setEscape(escape);
    req.setDispatcherId(dispatcherID);
    return new Promise<Bool>((resolve, reject) => {
      const opts: UnaryRpcOptions<DMReq, Bool> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SlackService.DirectMessageUserById, opts);
    });
  }

  public async FirstCall(divisionId: number) {
    const req = new FCReq();
    req.setDivision(divisionId);
    return new Promise<Bool>((resolve, reject) => {
      const opts: UnaryRpcOptions<FCReq, Bool> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SlackService.FirstCall, opts);
    })
  }
}

export { SlackClient };
