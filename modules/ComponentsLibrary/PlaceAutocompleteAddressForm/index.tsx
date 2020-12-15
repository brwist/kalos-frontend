// This is the google autocomplete form for address queries
import { getKeyByKeyName } from '../../../helpers';

export const getApi = async () => {
  console.log('Calling on the maps api');
  const res = await getKeyByKeyName('google_maps');
  console.log('Key ', res);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/js?key=${res.apiKey}&libraries=places`,
  );
  const data = await response.json();
  console.log('Google maps response: ', data);
};

//const placeSearch: google.maps.places.PlacesService;
//const autocomplete: google.maps.places.Autocomplete;
