import { grpc } from '@improbable-eng/grpc-web';
import { SamsaraService } from '../compiled-protos/samsara_pb_service';
import {
  SamsaraAddress,
  SamsaraDriversResponse,
  SamsaraLocationResponse,
} from '../compiled-protos/samsara_pb';
import { UnaryRpcOptions } from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';
import { Bool, Empty, String } from '../compiled-protos/common_pb';

class SamsaraClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async BatchGetLocations() {
    const req = new Empty();
    return new Promise<SamsaraLocationResponse>((resolve, reject) => {
      const opts: UnaryRpcOptions<Empty, SamsaraLocationResponse> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SamsaraService.BatchGetLocations, opts);
    });
  }

  public async BatchGetDrivers() {
    const req = new Empty();
    return new Promise<SamsaraDriversResponse>((resolve, reject) => {
      const opts: UnaryRpcOptions<Empty, SamsaraDriversResponse> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SamsaraService.BatchGetDrivers, opts);
    });
  }

  public async CreateAddress(req: SamsaraAddress) {
    return new Promise<String>((resolve, reject) => {
      const opts: UnaryRpcOptions<SamsaraAddress, String> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(SamsaraService.CreateAddress, opts);
    });
  }
}

export { SamsaraClient };
