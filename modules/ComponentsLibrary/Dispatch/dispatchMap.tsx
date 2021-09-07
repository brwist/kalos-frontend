import React, { FC, useEffect, useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
interface props {
  userID: number;
  center: {lat: number, lng: number};
  zoom: number;
  apiKey: string;
  techs: DispatchableTech[];
  calls: DispatchCall[];
  handleMapClick: (tech: DispatchableTech, call: DispatchCall) => void
}

export const DispatchMap: FC<props> = props => {

  const [techMarkers, setTechMarkers] = useState<JSX.Element[]>([])
  const [callMarkers, setCallMarkers] = useState<JSX.Element[]>([])

  const buildTechMarkers = useCallback(async () => {
    const markers = props.techs.map(async tech => {
      const icon = {
        path: "M20,2H4A2,2 0 0,0 2,4V16A2,2 0 0,0 4,18H8L12,22L16,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M12,4.3C13.5,4.3 14.7,5.5 14.7,7C14.7,8.5 13.5,9.7 12,9.7C10.5,9.7 9.3,8.5 9.3,7C9.3,5.5 10.5,4.3 12,4.3M18,15H6V14.1C6,12.1 10,11 12,11C14,11 18,12.1 18,14.1V15Z",
        fillColor: '#711313',
        fillOpacity: 1,
        anchor: new google.maps.Point(10,24),
        scale: 1.25,
        labelOrigin: new google.maps.Point(13,27)
      }
      
      if (tech.getGeolocationLng() && tech.getGeolocationLat()) {
        return ( <Marker
            position={{lat: tech.getGeolocationLat(), lng: tech.getGeolocationLng()}}
            icon={icon}
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
            icon={icon}
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
      const icon = {
        path: "M0,21V10L7.5,5L15,10V21H10V14H5V21H0M24,2V21H17V8.93L16,8.27V6H14V6.93L10,4.27V2H24M21,14H19V16H21V14M21,10H19V12H21V10M21,6H19V8H21V6Z",
        fillColor: 'green',
        fillOpacity: 1,
        anchor: new google.maps.Point(10,24),
        scale: 1,
        labelOrigin: new google.maps.Point(14,-5)
      }
      if (call.getGeolocationLng() && call.getGeolocationLat()) {
        return ( <Marker
          position={{lat: call.getGeolocationLat(), lng: call.getGeolocationLng()}}
          icon={icon}
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
            icon={icon}
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
  }, [props.calls])

  useEffect(() => {
    console.log('inner map');
    buildTechMarkers();
    buildCallMarkers();
  }, [buildTechMarkers, buildCallMarkers]);

  return (
    <div style={{textAlign: "center"}}>
      <LoadScript
        googleMapsApiKey={props.apiKey}
      //   // googleMapsApiKey='AIzaSyAYrAeGFmyE-POkh5Gl8S9fWGpSEsOclB0'
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