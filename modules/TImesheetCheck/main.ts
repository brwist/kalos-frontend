import { TransactionClient } from '@kalos-core/kalos-rpc/Transaction';

export class TimesheetCheck {
  userID: number;
  TxnClient: TransactionClient;
  constructor(userID: number) {
    const endpoint = 'https://core-dev.kalosflorida.com:8443';
    this.userID = userID;
    this.TxnClient = new TransactionClient(endpoint);
  }

  async handleCheck() {
    return await this.TxnClient.timesheetCheck(this.userID);
  }
}
