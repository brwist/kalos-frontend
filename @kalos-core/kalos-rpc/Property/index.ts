import { grpc } from '@improbable-eng/grpc-web';
import { PropertyService } from '../compiled-protos/property_pb_service';
import { Property, PropertyList, PropertyCoordinates } from '../compiled-protos/property_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { InvokeRpcOptions } from '@improbable-eng/grpc-web/dist/typings/invoke';
import { BaseClient } from '../BaseClient';

class PropertyClient extends BaseClient {
  constructor(host?: string, userID?: number) {
    super(host, userID);
  }

  public async Create(req: Property) {
    return new Promise<Property>((resolve, reject) => {
      const opts: UnaryRpcOptions<Property, Property> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PropertyService.Create, opts);
    });
  }

  public async GetResidentialPropertyCoordinates() {
    return new Promise<PropertyCoordinates>((resolve, reject) => {
      const req = new Property();
      req.setState("FL");
      req.setGroupBy("user_id");
      req.setIsActive(1);
      req.setIsResidential(1);
      req.setWithoutLimit(true);
      const opts: UnaryRpcOptions<Property, PropertyCoordinates> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject)
      }
      grpc.unary(PropertyService.GetPropertyCoordinates, opts)
    })
  }
  
  public async Get(req: Property) {
    return new Promise<Property>((resolve, reject) => {
      const opts: UnaryRpcOptions<Property, Property> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PropertyService.Get, opts);
    });
  }

  public async List(req: Property, cb: (arg: Property) => void) {
    return new Promise<grpc.Code>((resolve, reject) => {
      const opts: InvokeRpcOptions<Property, Property> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onMessage: (msg: Property) => {
          if (msg) {
            cb(msg);
          }
        },
        onEnd: (code: grpc.Code) => {
          resolve(code);
        },
      };
      grpc.invoke(PropertyService.List, opts);
    });
  }

  public async Update(req: Property) {
    return new Promise<Property>((resolve, reject) => {
      const opts: UnaryRpcOptions<Property, Property> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PropertyService.Update, opts);
    });
  }

  public async Delete(req: Property) {
    return new Promise<Property>((resolve, reject) => {
      const opts: UnaryRpcOptions<Property, Property> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: this.onUnaryEnd(resolve, reject),
      };
      grpc.unary(PropertyService.Delete, opts);
    });
  }

  public async BatchGet(req: Property) {
    return new Promise<PropertyList>((resolve, reject) => {
      const opts: UnaryRpcOptions<Property, PropertyList> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (result: UnaryOutput<PropertyList>) => {
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
      grpc.unary(PropertyService.BatchGet, opts);
    });
  }

  /**
   * Returns loaded Property by its ids
   * @param id: property id
   * @returns Property
   */
  public async loadPropertyByID(id: number) {
    const req = new Property();
    req.setId(id);
    req.setIsActive(1);
    return await this.Get(req);
  }

  public deletePropertyById = async (id: number) => {
    const req = new Property();
    req.setId(id);
    await this.Delete(req);
  };

  public saveProperty = async (
    data: Property,
    userId: number,
    propertyId?: number
  ) => {
    data.setUserId(userId);
    if (propertyId) {
      data.setId(propertyId);
    }
    if (propertyId !== 0 && data.getFieldMaskList().length === 0) {
      throw new Error(
        'Attempting to update entity without providing a field mask will result in a no op'
      );
    }
    return await this[propertyId ? 'Update' : 'Create'](data);
  };
}

const getPropertyAddress = (p?: Property): string =>
  p ? `${p.getAddress()}, ${p.getCity()}, ${p.getState()} ${p.getZip()}` : '';

export { Property, PropertyList, PropertyClient, getPropertyAddress, PropertyCoordinates };
