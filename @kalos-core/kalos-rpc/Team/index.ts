import { grpc } from '@improbable-eng/grpc-web';
import { TeamService } from '../compiled-protos/team_pb_service';
import { Team, TeamList } from '../compiled-protos/team_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { BaseClient } from '../BaseClient';
class TeamClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Team) {
    return new Promise<Team>((resolve, reject) => {
      const opts: UnaryRpcOptions<Team, Team> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TeamService.Create, opts);
    });
  }

  public async Get(req: Team) {
    return new Promise<Team>((resolve, reject) => {
      const opts: UnaryRpcOptions<Team, Team> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TeamService.Get, opts);
    });
  }

  public async Update(req: Team) {
    return new Promise<Team>((resolve, reject) => {
      const opts: UnaryRpcOptions<Team, Team> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TeamService.Update, opts);
    });
  }

  public async Delete(req: Team) {
    return new Promise<Team>((resolve, reject) => {
      const opts: UnaryRpcOptions<Team, Team> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(TeamService.Delete, opts);
    });
  }

  public async BatchGet(req: Team) {
    return new Promise<TeamList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Team, TeamList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<TeamList>) => {
          if (result.message) {
            resolve(result.message);
          } else {
            if (
              result.statusMessage.toLowerCase() ===
              'response closed without headers'
            ) {
              return this.BatchGet(req);
            } else {
              reject(new Error(result.statusMessage));
            }
          }
        },
      };
      grpc.unary(TeamService.BatchGet, opts);
    });
  }

  public async deleteTeam(id: number) {
    const req = new Team();
    req.setId(id);
    await this.Delete(req);
  }

  public upsertTeam = async (data: Team) => {
    const id = data.getId();
    if (id !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    return await this[id != 0 ? 'Update' : 'Create'](data);
  };
}

export { Team, TeamList, TeamClient };
