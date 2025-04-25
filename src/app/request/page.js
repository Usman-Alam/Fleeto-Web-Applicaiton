"use client";

import React, { use } from 'react';
import { useEffect, useState } from 'react';
import{useMapsLibrary, Map, APIProvider, useMap} from "@vis.gl/react-google-maps";
export default function RequestPage (){
    const containerStyle = {
        width: '100%',
        height: '90vh',
      }

      // const options = {
      //   mapId: "3c5594bda824c5c5"

      // }
      const center = {
        lat: 31.470560140195342,
        lng: 74.41088976026865,
      };
      // const { isLoaded } = useJsApiLoader({
      //   id: 'google-map-script',
      //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      // })
    
      //const [map, setMap] = React.useState(null)
    
      // const onLoad = React.useCallback(function callback(map) {
      //   // This is just an example of getting and using the map instance!!! don't just blindly copy!
      //   const bounds = new window.google.maps.LatLngBounds(center)
      //   map.fitBounds(bounds)
    
      //   setMap(map)
      // }, [])
    
      // const onUnmount = React.useCallback(function callback(map) {
      //   setMap(null)
      // }, [])
    
// function MarkerClicked(event) {
//         console.log(event.latLng.lat());
//         console.log(event.latLng.lng())
//       }

//       function MarkerFinishedDrag(event) {
//         console.log(event.latLng.lat());
//         console.log(event.latLng.lng())
//       }

      return (
        <div style={{ height: '90vh', width: '100%' }}>
        <APIProvider apiKey="AIzaSyA7uTDYEbG1tCIAdIonbbFLv1c81mMZ-Uo">
        <Map
  
  mapId="3c5594bda824c5c5"
>
          {/* Child components, such as markers, info windows, etc. */}
          <Directions />
        </Map>
        </APIProvider>
        </div>

        
      );
    }

    function Directions() {
      const map = useMap();
      const routesLibrary = useMapsLibrary('routes');
      const [directionservice, setDirectionService] = useState();
      const [directionsRenderer, setDirectionsRenderer] = useState();
      const [routes, setRoutes]= useState([]);
      const [routeIndex, setRouteIndex]= useState(0);
      const selected= routes[routeIndex];
      const leg = selected?.legs[0];
      useEffect (() => {
      
        if(!routesLibrary || !map) return;
        setDirectionService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
      }, [routesLibrary, map]);
      useEffect (() => {
        if(!directionservice || !directionsRenderer) return;
        directionservice.route(
          {
            origin: "Sultan Shawarma Dha",
            destination: "Lahore University of Management Sciences, Lahore",
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
          }).then((response)=> {
            directionsRenderer.setDirections(response);
            setRoutes(response.routes);

          })
      }, [directionservice, directionsRenderer]);

console.log(routes);

useEffect(() => {

  if(!directionsRenderer) return;
  directionsRenderer.setRouteIndex(routeIndex);
}, [routeIndex, directionsRenderer])

if (!leg) return null;
return <div className="direction">
  <h2>{selected.summary}</h2>
  <p>{leg.start_address.split(",")[0] } to {leg.end_address.split(",")[0]}</p>
  <p>Distance: {leg.distance?.text}</p>
  <p>Duration: {leg.duration?.text}</p>
  <h2>Other Routes</h2>
  <ul>
  {routes.map((route, index) => <li key={route.summary}><button onClick={()=>setRouteIndex(index)}>{route.summary}</button></li> )}
  </ul>
</div>
    }