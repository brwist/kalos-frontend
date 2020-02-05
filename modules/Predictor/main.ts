import { PredictionClient } from '@kalos-core/kalos-rpc/Predict';

export class Predictor {
  PredictionClient: PredictionClient;
  constructor() {
    this.PredictionClient = new PredictionClient(
      0,
      'https://core-dev.kalosflorida.com:8443',
    );
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
      console.log(err);
      return [];
    }
  }
}
