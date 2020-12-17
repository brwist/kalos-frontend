export interface AddressInterface {
  StreetAddress: string;
  City: string;
  State: string;
  ZipCode: string;
  Country: string;
}

export namespace AddressNamespace {
  export type AsObject = {
    StreetAddress: string;
    City: string;
    State: string;
    ZipCode: string;
    Country: string;
  };
}

export namespace Address {
  export type AsObject = {
    StreetAddress: string;
    City: string;
    State: string;
    ZipCode: string;
    Country: string;
  };
}

export class Address implements AddressInterface {
  StreetAddress: string = '';
  City: string = '';
  State: string = '';
  ZipCode: string = '';
  Country: string = '';
}
