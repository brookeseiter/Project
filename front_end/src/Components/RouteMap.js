import { GoogleMap, DirectionsService, DirectionsRenderer, DistanceMatrixService, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { React, useCallback, useEffect, useRef, useState } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
  } from "@reach/accordion";
import "@reach/accordion/styles.css";

const Directions = props => {
  const [directions, setDirections] = useState();
  const { origin, destination, waypoints, handleDistChange } = props;
  const count = useRef(0);

  const options = {
    polylineOptions: {
      strokeWeight: 6,
      strokeOpacity: 0.8
    }
  };
  
  useEffect(() => {
    count.current = 0;
  }, [origin, destination, waypoints]);

  const directionsCallback = (result, status) => {
    if (status === "OK" && count.current === 0) {
      count.current += 1;
      setDirections(result);
      console.log(result);
      const distList = [];
      const timeList = [];
      for (const directionLeg of result.routes[0].legs) {
        const legDist = parseInt(directionLeg.distance.text.slice(0, -3));
        const legTime = directionLeg.duration.value;
        distList.push(legDist);
        timeList.push(legTime);
      }
      console.log(timeList);
      // const total = [0, 0, 0]; // days, hours, minutes
      // for(let i = 0; i < timeList.length; i++){
      //     if(timeList[0].includes("day ")){
      //         total[0]++;
      //     }else if(timeList[i].includes("days")){
      //         total[0] += parseInt(timeList[i].substring(0, timeList[i].indexOf(" days")));
      //     }
      //     if(timeList[i].includes("hour ")){
      //         total[1]++;
      //     }else if(timeList[i].includes("hours")){
      //         if(timeList[i].indexOf(" hours") <= 3){
      //             total[1] += (parseInt(timeList[i].substring(0, timeList[i].indexOf(" hours")))) * 60;
      //         }else{
      //             if(timeList[i].includes("days")){
      //                 total[1] += parseInt(timeList[i].substring(timeList[i].lastIndexOf("days ")) + 5, timeList[i].indexOf(" hours"));
      //             }else{
      //                 total[1] += parseInt(timeList[i].substring(timeList[i].lastIndexOf("day ")) + 4, timeList[i].indexOf(" hours"));
      //             }
      //         }
      //     }
      //     if(timeList[i].includes("min ")){
      //         total[2]++;
      //         console.log(total[2]);
      //     }else if(timeList[i].includes("mins")){
      //         if(timeList[i].indexOf(" mins") <= 3){
      //             total[2] += parseInt(timeList[i].substring(0, timeList[i].indexOf(" mins")));
      //             console.log(total[2]);
      //         }else{
      //             if(timeList[i].includes("hours")){
      //                 total[2] += parseInt(timeList[i].substring(timeList[i].indexOf("hours ") + 6, timeList[i].indexOf(" mins")));
      //                 console.log(total[2]);
      //             }else{
      //                 total[2] += parseInt((timeList[i].substring(timeList[i].indexOf("hour ") + 5, timeList[i].indexOf(" mins"))));
      //             }
      //         }
      //     }
      // }
      // console.log(total[0] + " days in mins " + total[1] + " hours in mins " + total[2] + " mins.");
      // const totalMins = total[1] + total[2];
      // console.log(total[1] + total[2]);
      // console.log(totalMins);

      let distSum = 0;
      distList.forEach( num => {
        distSum += num;
      });
      handleDistChange(distSum);
    }
  };

  return (
     <div className="Directions">
        <DirectionsService
          options={{
            destination,
            origin,
            travelMode: "DRIVING",
            waypoints,
            optimizeWaypoints: true
          }}
          callback={directionsCallback}
        />
        <DirectionsRenderer 
          directions={directions} 
          options={options} 
          panel={document.getElementById('panel')} 
        />
    </div>
  );
};

const center = {
  lat: 37.733795, 
  lng: -122.446747
};

export default function RouteMap () {
  const [libraries] = useState(['places']);
  const [inputs, setInputs] = useState({});
  const [mapData, setMapData] =useState([]);
  const [selected, setSelected] = useState(null);
  let [selectedWaypoints, setSelectedWaypoints] = useState([]);
  let [origin, setOrigin] = useState('');
  let [destination, setDestination] = useState('');
  let [waypoints, setWaypoints] = useState([]);
  const [totalDist, setTotalDist] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const handleDistChange = distSum => {
    setTotalDist(distSum);
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(values => ({...values, [name]: value}));
  }

  function onClick () {
    setOrigin(inputs.origin);
    setDestination(inputs.destination);
  }

  useEffect(() => {
    fetch('/api/stops/map_data')
        .then((response) => response.json())
        .then((data) => {
            setMapData(data);
        });
  }, []);

  const stopsObj = Object.entries(mapData).map(([key, value]) => ({key, value}));

  function addRouteStop () {
    let selectedWaypoint = {
      location: {
        lat: selected.value.stop_lat,
        lng: selected.value.stop_lng
      },
      stopover: true,
    };
    setWaypoints(waypoints => [...waypoints, selectedWaypoint]);
    setSelectedWaypoints(selectedWaypoints => [...selectedWaypoints, selected]);
  }

  function deleteRouteStop () {

    const routeWaypointCoords = {
      lat: selected.value.stop_lat,
      lng: selected.value.stop_lng
    };

    const indexOfRouteWaypoint = waypoints.findIndex(waypoint => {
      return waypoint.location.lat === routeWaypointCoords.lat;
    });

    waypoints.splice(indexOfRouteWaypoint, 1);
    setWaypoints(waypoints => [...waypoints]);

    const indexOfAccordionWaypoint = selectedWaypoints.findIndex(selectedWaypoint => {
      return selectedWaypoint.value.stop_lat === routeWaypointCoords.lat;
    });
    
    selectedWaypoints.splice(indexOfAccordionWaypoint, 1);
    setSelectedWaypoints(selectedWaypoints => [...selectedWaypoints]);
  }
  
  return (
    <div className='map'>
      <div className='map-settings'>
        <hr className='mt-0 mb-3' />

        <div className='row'>
          <div className='col-md-6 col-lg-4'>
            <div className='form-group'>
              <label htmlFor='ORIGIN'>Origin</label>
              <br />
              <input 
                  id='ORIGIN' 
                  className='form-control' 
                  type='text' 
                  name='origin'
                  value={inputs.origin || ""}
                  onChange={handleChange}
              />
            </div>
          </div>

          <div className='col-md-6 col-lg-4'>
            <div className='form-group'>
              <label htmlFor='DESTINATION'>Destination</label>
              <br />
              <input 
                  id='DESTINATION' 
                  className='form-control' 
                  type='text' 
                  name='destination'
                  value={inputs.destination || ""}
                  onChange={handleChange}
              />
            </div>
          </div>
          <button className='btn btn-primary' type='button' onClick={onClick}>
            Build Route
          </button>
          {
            (origin !== '') && (
              <DirectionsAccordion 
                origin={origin} 
                destination={destination} 
                waypoints={selectedWaypoints} 
              />
            )
          }
        </div>
        {
          origin !== '' ?
        
        (<GoogleMap
        id='direction-example'
        mapContainerStyle={{
          height: '400px',
          width: '500px'
        }}
        zoom={10}
        center={
          center
        }
        options={{
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          controlSize: 36,
          gestureHandling: "cooperative"
        }}
      >
        {origin !== '' &&
          destination !== '' && (
            <Directions 
              origin={origin} 
              destination={destination} 
              waypoints={waypoints} 
              handleDistChange={handleDistChange}
            />
          )}

          {stopsObj.map((stopObj) => (
                <MarkerF  
                    key={stopObj.key}
                    position={{ lat: stopObj.value.stop_lat, lng: stopObj.value.stop_lng}} 
                    onClick={() => {
                        setSelected(stopObj);
                        console.log(stopObj);
                    }}
                    visible={true}
                />
            ))}
            {selected ? (
                            <InfoWindowF
                                selected={selected}
                                position={{ lat: selected.value.stop_lat, lng: selected.value.stop_lng }} 
                                onCloseClick={() => {
                                    setSelected(null);
                                }}
                            >
                                <div>
                                    <h2>{selected.value.stop_name}</h2>
                                    <p>Category: {selected.value.stop_category}</p>
                                    <button onClick={addRouteStop}>Add to Route</button>
                                    <button onClick={deleteRouteStop}>Remove from Route</button>
                                </div>
                            </InfoWindowF>
                        ) : null
            }
      </GoogleMap>): null}
      <div className="route-info">
        <p>Total Distance: {totalDist} mi</p>
      </div>
      <div id="panel"></div>
      </div>
    </div>
  );
};


function DirectionsAccordion ({ origin, destination, waypoints }) { 

    return (
        <div className="DirectionsAccordion">
          <Accordion collapsible multiple>
            <AccordionItem>
              <h3>
                <AccordionButton>Origin</AccordionButton>
              </h3>
              <AccordionPanel>
                {origin}
              </AccordionPanel>
            </AccordionItem>
            {waypoints.map((waypoint) => ( 
              <AccordionItem key={waypoint.key}>
                <h3>
                  <AccordionButton>{waypoint.value.stop_name}</AccordionButton>
                </h3>
                <AccordionPanel>
                  <p>Category: {waypoint.value.stop_category}</p>
                  <p>Latitude: {waypoint.value.stop_lat}</p>
                  <p>Longitude: {waypoint.value.stop_lng}</p>
                </AccordionPanel>
              </AccordionItem>
            ))}
            <AccordionItem>
              <h3>
                <AccordionButton>Destination</AccordionButton>
              </h3>
              <AccordionPanel>
                {destination}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>
    )
}



