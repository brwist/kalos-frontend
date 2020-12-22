export namespace AddressPair {
  export type AsObject = {
    /*
    FullAddress: string[];
    StreetAddress: string[];
    City: string[];
    State: string[];
    ZipCode: string[];
    Country: string[];
    */
    FullAddressOrigin: string;
    StreetAddressOrigin: string;
    CityOrigin: string;
    StateOrigin: string;
    ZipCodeOrigin: string;
    CountryOrigin: string;

    FullAddressDestination: string;
    StreetAddressDestination: string;
    CityDestination: string;
    StateDestination: string;
    ZipCodeDestination: string;
    CountryDestination: string;
  };

  export interface AddressInterface {
    FullAddressOrigin: string;
    StreetAddressOrigin: string;
    CityOrigin: string;
    StateOrigin: string;
    ZipCodeOrigin: string;
    CountryOrigin: string;

    FullAddressDestination: string;
    StreetAddressDestination: string;
    CityDestination: string;
    StateDestination: string;
    ZipCodeDestination: string;
    CountryDestination: string;
  }

  export class AddressPair implements AddressInterface {
    FullAddressOrigin: string = '';
    StreetAddressOrigin: string = '';
    CityOrigin: string = '';
    StateOrigin: string = '';
    ZipCodeOrigin: string = '';
    CountryOrigin: string = '';

    FullAddressDestination: string = '';
    StreetAddressDestination: string = '';
    CityDestination: string = '';
    StateDestination: string = '';
    ZipCodeDestination: string = '';
    CountryDestination: string = '';
  }
}
