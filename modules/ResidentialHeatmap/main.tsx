/* 

  Description: A heatmap of all residential customers, using one property per customer queried

  Design Specification / Document: None Specified
  
*/

import React, {
  useReducer,
  useState,
  useMemo,
  useEffect,
  useCallback,
  FC,
} from 'react';
import { PageWrapper } from '../PageWrapper/main';
import { reducer, ACTIONS } from './reducer';
import {
  GoogleMap,
  useJsApiLoader,
  HeatmapLayer,
} from '@react-google-maps/api';

import {
  PropertyClient,
  Property,
  PropertyCoordinates,
} from '../../@kalos-core/kalos-rpc/Property';
import { format } from 'date-fns';
import { ENDPOINT } from '../../constants';
import { ApiKey } from '../../@kalos-core/kalos-rpc/ApiKey';

// add any prop types here
interface props {
  loggedUserId: number;
  apiKey: string;
}

export const ResidentialHeatmap: FC<props> = ({ loggedUserId, apiKey }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    error: undefined, // use error for boolean checks
    heatmapData: [],
    apiKey: '',
  });
  const client = useMemo(() => new PropertyClient(ENDPOINT), []);

  const load = useCallback(async () => {
    const coords = await client.GetResidentialPropertyCoordinates();
    console.log(coords);
    let mapData: Array<google.maps.LatLng> = [];
    for (const c of coords.getCoordsList()) {
      const m = new google.maps.LatLng(c.getLat(), c.getLng());
      mapData = mapData.concat(m);
    }
    dispatch({ type: ACTIONS.SET_DATA, data: mapData });
  }, [client]);

  const cleanup = useCallback(() => {}, []);

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['visualization'],
  });
  return (
    <PageWrapper userID={loggedUserId} withHeader>
      {isLoaded && (
        <GoogleMap
          id="heatmap"
          mapContainerStyle={{
            width: '98%',
            height: `${window.innerHeight * 0.98}px`,
          }}
          center={{ lat: 28.565989, lng: -81.733872 }}
          zoom={10}
          options={{ streetViewControl: false }}
        >
          <HeatmapLayer
            data={state.heatmapData}
            options={{
              dissipating: false,
              radius: 25,
              opacity: 0.8,
              gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)',
              ],
            }}
          />
        </GoogleMap>
      )}
    </PageWrapper>
  );
};
