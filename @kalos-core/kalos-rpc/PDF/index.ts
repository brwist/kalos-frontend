import { grpc } from '@improbable-eng/grpc-web';
import { PDFService } from '../compiled-protos/pdf_pb_service';
import { HTML } from '../compiled-protos/pdf_pb';
import { UnaryRpcOptions } from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';
import { URLObject } from '../compiled-protos/s3_pb';

class PDFClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: HTML) {
    return new Promise<string>((resolve, reject) => {
      const opts: UnaryRpcOptions<HTML, URLObject> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: output => {
          if (output.message) {
            resolve(output.message.getUrl());
          } else {
            reject(output.statusMessage);
          }
        },
      };
      grpc.unary(PDFService.Create, opts);
    });
  }

  public getUploadedHTMLUrl = async (
    HTMLString: string,
    filename: string,
    bucketName: string = 'testbuckethelios'
  ) => {
    const req = new HTML();
    req.setData(HTMLString);
    req.setKey(filename);
    req.setBucket(bucketName);
    const url = await this.Create(req);
    return url;
  };
}

export { HTML, PDFClient };
