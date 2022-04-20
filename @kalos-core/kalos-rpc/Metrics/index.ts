import { grpc } from '@improbable-eng/grpc-web';
import { MetricsService } from '../compiled-protos/metrics_pb_service';
import {
  Billable,
  AvgTicket,
  Callbacks,
  Revenue,
  MetricReportData,
  MertricReportDataRequest,
  MetricReportDataList,
} from '../compiled-protos/metrics_pb';
import { UnaryRpcOptions } from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';

class MetricsClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async GetBillable(userID: number) {
    const req = new Billable();
    req.setId(userID);
    return new Promise<Billable>((resolve, reject) => {
      const opts: UnaryRpcOptions<Billable, Billable> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MetricsService.GetBillable, opts);
    });
  }

  public async GetAvgTicket(userID: number) {
    const req = new AvgTicket();
    req.setId(userID);
    return new Promise<AvgTicket>((resolve, reject) => {
      const opts: UnaryRpcOptions<AvgTicket, AvgTicket> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MetricsService.GetAvgTicket, opts);
    });
  }

  public async GetCallbacks(userID: number) {
    const req = new Callbacks();
    req.setId(userID);
    return new Promise<Callbacks>((resolve, reject) => {
      const opts: UnaryRpcOptions<Callbacks, Callbacks> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MetricsService.GetCallbacks, opts);
    });
  }

  public async GetRevenue(userID: number) {
    const req = new Revenue();
    req.setId(userID);
    return new Promise<Revenue>((resolve, reject) => {
      const opts: UnaryRpcOptions<Revenue, Revenue> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MetricsService.GetRevenue, opts);
    });
  }

  /**
   * Returns loaded Metric by user id and metricType
   * @param userId: number
   * @param metricType: MetricType
   * @returns metric
   */
  public async loadMetricByUserId(userId: number, metricType: MetricType) {
    try {
      //@ts-ignore
      return await this[`Get${metricType}`](userId);
    } catch (e) {
      return { id: userId, value: 0 };
    }
  }

  /**
   * Returns loaded Metric by user id in provided list and metricType
   * @param userIds: number array
   * @param metricType: MetricType
   * @returns metric
   */
  public async loadMetricByUserIds(userIds: number[], metricType: MetricType) {
    return await Promise.all(
      userIds.map(
        async userId => await this.loadMetricByUserId(userId, metricType)
      )
    );
  }
  /**
   * Returns loaded Metric report data for all users based on a date range, returns metricReportData type
   * @param userIds: number array
   * @param metricType: MetricType
   * @returns metric
   */
  public async loadMetricsReportData(req: MertricReportDataRequest) {
    return new Promise<MetricReportDataList>((resolve, reject) => {
      const opts: UnaryRpcOptions<
        MertricReportDataRequest,
        MetricReportDataList
      > = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(MetricsService.BatchGetMetricReportData, opts);
    });
  }
}

type MetricType = 'Billable' | 'Callbacks' | 'Revenue' | 'AvgTicket';

export { MetricsClient, Billable, AvgTicket, Callbacks, Revenue, MetricType,MertricReportDataRequest };
