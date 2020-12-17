export interface AddressInterface {
  StreetAddress: string;
  City: string;
  State: string;
  ZipCode: string;
  Country: string;
}

export interface AddressPairInterface {
  StreetAddressOrigin: string;
  CityOrigin: string;
  StateOrigin: string;
  ZipCodeOrigin: string;
  CountryOrigin: string;

  StreetAddressDestination: string;
  CityDestination: string;
  StateDestination: string;
  ZipCodeDestination: string;
  CountryDestination: string;
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

export namespace AddressPair {
  export type AsObject = {
    StreetAddressOrigin: string;
    CityOrigin: string;
    StateOrigin: string;
    ZipCodeOrigin: string;
    CountryOrigin: string;

    StreetAddressDestination: string;
    CityDestination: string;
    StateDestination: string;
    ZipCodeDestination: string;
    CountryDestination: string;
  };
}

export class Address implements AddressInterface {
  StreetAddress: string = '';
  City: string = '';
  State: string = '';
  ZipCode: string = '';
  Country: string = '';
}

export class AddressPair implements AddressPairInterface {
  StreetAddressOrigin: string = '';
  CityOrigin: string = '';
  StateOrigin: string = '';
  ZipCodeOrigin: string = '';
  CountryOrigin: string = '';

  StreetAddressDestination: string = '';
  CityDestination: string = '';
  StateDestination: string = '';
  ZipCodeDestination: string = '';
  CountryDestination: string = '';
}
