export namespace Address {
  export type AsObject = {
    FullAddress: string[];
    StreetAddress: string[];
    City: string[];
    State: string[];
    ZipCode: string[];
    Country: string[];
  };

  export interface AddressInterface {
    FullAddress: string[];
    StreetAddress: string[];
    City: string[];
    State: string[];
    ZipCode: string[];
    Country: string[];
  }

  export class Address implements AddressInterface {
    FullAddress: string[] = [];
    StreetAddress: string[] = [];
    City: string[] = [];
    State: string[] = [];
    ZipCode: string[] = [];
    Country: string[] = [];
  }
}
