import { grpc } from '@improbable-eng/grpc-web';
import { PredictService } from '../compiled-protos/predict_pb_service';
import { TransactionData, Prediction } from '../compiled-protos/predict_pb';
import { UnaryRpcOptions } from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';

class PredictionClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  private async PredictCostCenter(
    vendor: string,
    amount: number,
    notes: string,
    ownerID: number
  ) {
    const req = new TransactionData();
    req.setAmount(amount);
    req.setNotes(notes);
    req.setVendor(vendor);
    req.setOwnerId(ownerID);
    return new Promise<Prediction>((resolve, reject) => {
      const opts: UnaryRpcOptions<TransactionData, Prediction> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(
          resolve,
          reject,
          this.PredictCostCenter.bind(this),
          req
        ),
      };
      grpc.unary(PredictService.PredictCostCenter, opts);
    });
  }

  public async getCostCenterPrediction(
    vendor: string,
    amount: number,
    notes: string,
    ownerID: number
  ) {
    const res = await this.PredictCostCenter(vendor, amount, notes, ownerID);
    return res.predictedScoresMap.sort(
      (a: [string, number], b: [string, number]) => {
        return b[1] - a[1];
      }
    );
  }
}

export { Prediction, PredictionClient };
