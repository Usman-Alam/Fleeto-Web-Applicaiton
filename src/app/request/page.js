"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import{useMapsLibrary, Map, APIProvider, useMap} from "@vis.gl/react-google-maps";
export default function RequestPage (){
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
        const sourceAddress = localStorage.getItem("shopAddress");
        if(!directionservice || !directionsRenderer) return;
        directionservice.route(
          {
            origin: sourceAddress,
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