/* eslint-disable no-undef */
import React, { FC, useEffect, useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';
import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import CircularProgress from '@material-ui/core/CircularProgress';
import { User } from '@kalos-core/kalos-rpc/User';
interface props {
  userID: number;
  center: {lat: number, lng: number};
  zoom: number;
  apiKey: string;
  techs: DispatchableTech[];
  users?: User[];
  calls: DispatchCall[];
  handleMapClick: (call: DispatchCall, edit: boolean, tech: DispatchableTech) => void;
  handleGeocodeUpdate: (type: string, id: number, geo: {lat: number, lng: number}) => void;
  loading: boolean;
  isFirstCall? : boolean;
  handleError?: (message: string, type: string, r: string) => void;
}

export const DispatchMap: FC<props> = props => {

  const [userMarkers, setUserMarkers] = useState<JSX.Element[]>([])
  const [techMarkers, setTechMarkers] = useState<JSX.Element[]>([])
  const [callMarkers, setCallMarkers] = useState<JSX.Element[]>([])
  const {
    isLoaded,
    loadError
  } = useJsApiLoader({
    googleMapsApiKey: props.apiKey
  });

  const buildUserMarkers = useCallback(async () => {
    if (props.users) {
      const markers = props.users.map(async user => {
        const icon = {
          path: "M20,2H4A2,2 0 0,0 2,4V16A2,2 0 0,0 4,18H8L12,22L16,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M12,4.3C13.5,4.3 14.7,5.5 14.7,7C14.7,8.5 13.5,9.7 12,9.7C10.5,9.7 9.3,8.5 9.3,7C9.3,5.5 10.5,4.3 12,4.3M18,15H6V14.1C6,12.1 10,11 12,11C14,11 18,12.1 18,14.1V15Z",
          fillColor: '#711313',
          fillOpacity: 1,
          anchor: new google.maps.Point(10,24),
          scale: 1.25,
          labelOrigin: new google.maps.Point(13,27)
        }
        if (user.getGeolocationLng() && user.getGeolocationLat()) {
          return ( <Marker
            position={{lat: user.getGeolocationLat(), lng: user.getGeolocationLng()}}
            icon={icon}
            label={{text: `${user.getFirstname()} ${user.getLastname()}`, fontWeight:'bold', fontSize:'15px'}}
            key={`marker_${user.getId()}`}
            />
          )
        } else if (user.getAddress() || user.getZip()) {
          const geocode = new google.maps.Geocoder();
          let address = "";
          if (user.getAddress()) {
            address = user.getAddress();
          } else if (user.getZip()) {
            address = user.getZip();
          }
          try {
            const results = await geocode.geocode({address});
            const lat = results.results[0].geometry.location.lat();
            const lng = results.results[0].geometry.location.lng();
            props.handleGeocodeUpdate("user", user.getId(), {lat, lng});
            return ( <Marker
              position={{lat, lng}}
              icon={icon}
              label={{text: `${user.getFirstname()} ${user.getLastname()}`, fontWeight:'bold', fontSize:'15px'}}
              key={`marker_${user.getId()}`}
              />
            )
          } catch (err) {
            console.error(err);
            return ( <Marker position={{lat: 0, lng: 0}} key={`marker_${user.getId()}`}/>)
          }
        } else { // If no address or zip, notify user
          if (props.handleError) {
            // props.handleError(`No Address or Zip found for ${user.getFirstname()} ${user.getLastname()}!`, 'info', "DispatchMapUser");
          }
          return ( <Marker position={{lat: 0, lng: 0}} key={`marker_${user.getId()}`}/>)
        }
      })
      setUserMarkers(await Promise.all(markers));
    }
  }, [props.users])

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
        try {
          const results = await geocode.geocode({address: tech.getPropertyCity()});
          return ( <Marker
              position={{lat: results.results[0].geometry.location.lat(), lng: results.results[0].geometry.location.lng()}}
              icon={icon}
              label={{text: tech.getTechname(), fontWeight:'bold', fontSize:'15px'}}
              // onClick={() => props.handleMapClick(tech, new DispatchCall())}
              key={`marker_${tech.getUserId()}`}
            />
          )
        } catch (err) {
          console.error(err);
          return ( <Marker position={{lat: 0, lng: 0}} key={`marker_${tech.getUserId()}`}/>)  
        }
      } else {
        if (props.handleError) {
          // props.handleError(`No Address found for ${tech.getTechname()}`, "info", "DispatchMapTech");
        }
        return ( <Marker position={{lat: 0, lng: 0}} key={`marker_${tech.getUserId()}`}/>)
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
          onClick={() => props.handleMapClick(call, false, new DispatchableTech())}
          key={`marker_${call.getId()}`}
        />
        )
      } else if (call.getPropertyAddress()) {
        const geocode = new google.maps.Geocoder();
        try {
          const results = await geocode.geocode({address: call.getPropertyAddress()});
          const lat = results.results[0].geometry.location.lat();
          const lng = results.results[0].geometry.location.lng();
          props.handleGeocodeUpdate("property", call.getPropertyId(), {lat, lng});
          return ( <Marker
            position={{lat, lng}}
            icon={icon}
            label={{text: `${index + 1}`, fontWeight:'bold', fontSize:'15px'}}
            onClick={() => props.handleMapClick(call, false, new DispatchableTech())}
            key={`marker_${call.getId()}`}
          />
        )
        } catch (err) {
          console.error(err);
          return ( <Marker position={{lat: 0, lng: 0}} key={`marker_${call.getId()}`}/>)
        }
      } else {
        if (props.handleError) {
          // props.handleError(`No Address found for ${call.getPropertyId()}`, "info", "DispatchMapCall");
        }
        return ( <Marker position={{lat: 0, lng: 0}} key={`marker_${call.getId()}`}/>)
      }
    })
    setCallMarkers(await Promise.all(markers));
  }, [props.calls])

  useEffect(() => {
    // console.log("Dispatch Map");
    if (isLoaded) {
      // console.log("DispatchMap Loaded");
      if (props.isFirstCall) {
        buildUserMarkers();
      } else {
        buildTechMarkers();
      }
      buildCallMarkers();
    }
  }, [buildTechMarkers, buildUserMarkers, buildCallMarkers, props.apiKey, props.isFirstCall, isLoaded]);

  return (
    <div style={{textAlign: "center"}}>
      {props.loading && (
        <div style={{textAlign: 'center', paddingTop: '20px'}}>
          <CircularProgress />
        </div>
      )}
      {isLoaded && (
        <GoogleMap
          id="dispatch_map"
          mapContainerStyle={{width:"98%", height:`${window.innerHeight * 0.7}px`}}
          center={props.center}
          zoom={props.zoom}
          options={{streetViewControl: false}}
        >
          {userMarkers}
          {techMarkers}
          {callMarkers}
        </GoogleMap>
      )}
    </div>
  )
}