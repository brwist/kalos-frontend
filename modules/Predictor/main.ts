import { PredictionClient } from '@kalos-core/kalos-rpc/Predict';
import { ENDPOINT } from '../../constants';

export class Predictor {
  PredictionClient: PredictionClient;
  constructor() {
    this.PredictionClient = new PredictionClient(ENDPOINT);
  }

  async auth() {
    try {
      await this.PredictionClient.GetToken('test', 'test');
    } catch (err) {
      console.log('failed to authenticate', err);
    }
  }

  async predictCostCenter(
    vendor: string,
    ownerID: number,
    notes: string,
    amount: number,
  ) {
    try {
      return await this.PredictionClient.getCostCenterPrediction(
        vendor,
        amount,
        notes,
        ownerID,
      );
    } catch (err) {
      if (err.includes('authentication')) {
        await this.auth();
        return await this.PredictionClient.getCostCenterPrediction(
          vendor,
          amount,
          notes,
          ownerID,
        );
      }
      console.log(err);
      return [];
    }
  }
}
