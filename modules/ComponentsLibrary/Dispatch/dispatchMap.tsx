import React, { FC, useEffect, useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import { ApiKey } from '@kalos-core/kalos-rpc/ApiKey';
import { ApiKeyClientService } from '../../../helpers';
// @ts-ignore
import techIcon from '../../Dispatch/male-2.png';
// @ts-ignore
import callIcon from '../../Dispatch/townhouse.png';
interface props {
  userID: number;
  center: {lat: number, lng: number};
  zoom: number;
  techs: DispatchableTech[];
  calls: DispatchCall[];
  handleMapClick: (tech: DispatchableTech, call: DispatchCall) => void
}

export const DispatchMap: FC<props> = props => {

  const [techMarkers, setTechMarkers] = useState<JSX.Element[]>([])
  const [callMarkers, setCallMarkers] = useState<JSX.Element[]>([])

  const buildTechMarkers = useCallback(async () => {
    const markers = props.techs.map(async tech => {
      if (tech.getGeolocationLng() && tech.getGeolocationLat()) {
        return ( <Marker
            position={{lat: tech.getGeolocationLat(), lng: tech.getGeolocationLng()}}
            icon={{url: techIcon, labelOrigin: new google.maps.Point(17,45)}}
            label={{text: tech.getTechname(), fontWeight:'bold', fontSize:'15px'}}
            // onClick={() => props.handleMapClick(tech, new DispatchCall())}
            key={`marker_${tech.getUserId()}`}
          />
        )
      } else if (tech.getPropertyCity()) {
        const geocode = new google.maps.Geocoder();
        const results = await geocode.geocode({address: tech.getPropertyCity()});

        return ( <Marker
            position={{lat: results.results[0].geometry.location.lat(), lng: results.results[0].geometry.location.lng()}}
            icon={{url: techIcon, labelOrigin: new google.maps.Point(17,45)}}
            label={{text: tech.getTechname(), fontWeight:'bold', fontSize:'15px'}}
            // onClick={() => props.handleMapClick(tech, new DispatchCall())}
            key={`marker_${tech.getUserId()}`}
          />
        )
      } else {
        return ( <Marker position={{lat: 0, lng: 0}} />)
      }
    })
    setTechMarkers(await Promise.all(markers));
  }, [props.techs])

  const buildCallMarkers = useCallback(async () => {
    const markers = props.calls.map( async (call, index) => {
      if (call.getGeolocationLng() && call.getGeolocationLat()) {
        return ( <Marker
          position={{lat: call.getGeolocationLat(), lng: call.getGeolocationLng()}}
          icon={{url: callIcon, labelOrigin: new google.maps.Point(17,-5)}}
          label={{text: `${index + 1}`, fontWeight:'bold', fontSize:'15px'}}
          onClick={() => props.handleMapClick(new DispatchableTech(), call)}
          key={`marker_${call.getId()}`}
        />
        )
      } else if (call.getPropertyAddress()) {
        const geocode = new google.maps.Geocoder();
        const results = await geocode.geocode({address: call.getPropertyAddress()});
        return ( <Marker
            position={{lat: results.results[0].geometry.location.lat(), lng: results.results[0].geometry.location.lng()}}
            icon={{url: callIcon, labelOrigin: new google.maps.Point(17,-5)}}
            label={{text: `${index + 1}`, fontWeight:'bold', fontSize:'15px'}}
            onClick={() => props.handleMapClick(new DispatchableTech(), call)}
            key={`marker_${call.getId()}`}
          />
        )
      } else {
        return ( <Marker position={{lat: 0, lng: 0}} />)
      }
    })
    setCallMarkers(await Promise.all(markers));
  }, [props])

  useEffect(() => {
    buildTechMarkers();
    buildCallMarkers();
  }, [props, buildTechMarkers, buildCallMarkers]);

  return (
    <div style={{textAlign: "center"}}>
      <LoadScript
        googleMapsApiKey={"AIzaSyByAO5Z6jhy7NGgzd5iI8xfucFy68luaMw"}
      >
        <GoogleMap
          id="dispatch_map"
          mapContainerStyle={{width:"98%", height:`${window.innerHeight * 0.7}px`}}
          center={props.center}
          zoom={props.zoom}
        >
          {techMarkers}
          {callMarkers}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}