import { grpc } from '@improbable-eng/grpc-web';
import { TrelloService } from '../compiled-protos/trello_pb_service';
import {
  UnaryOutput,
  UnaryRpcOptions,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';
import { Bool, String, Empty } from '../compiled-protos/common_pb';
import { Board, BoardIdList, BoardList } from '../compiled-protos/trello_pb';

class TrelloClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async GetBoardById(req: String) {
    return new Promise<Board>((resolve, reject) => {
      const opts: UnaryRpcOptions<String, Board> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TrelloService.GetBoardById, opts);
    });
  }

  public async BatchGetBoardsById(req: BoardIdList) {
    return new Promise<BoardList>((resolve, reject) => {
      const opts: UnaryRpcOptions<BoardIdList, BoardList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<BoardList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.BatchGetBoardsById(req);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(TrelloService.BatchGetBoardsById, opts);
    });
  }

  public async CreateBoard(req: Board) {
    return new Promise<Board>((resolve, reject) => {
      const opts: UnaryRpcOptions<Board, Board> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TrelloService.CreateBoard, opts);
    });
  }

  public async UpdateBoard(req: Board) {
    return new Promise<Board>((resolve, reject) => {
      const opts: UnaryRpcOptions<Board, Board> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TrelloService.UpdateBoard, opts);
    });
  }

  public async DeleteBoardById(req: String) {
    return new Promise<Empty>((resolve, reject) => {
      const opts: UnaryRpcOptions<String, Empty> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TrelloService.DeleteBoardById, opts);
    });
  }
}

export { TrelloClient };
