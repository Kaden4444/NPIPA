
import React, { useEffect,useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvent, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import africa from '../json/africa_boundaries.json'
import iso_metrics from '../json/iso_metrics.json'
import countryMapping from '../json/countries.json'
import country_metrics from '../json/country_metrics.json'
import 'react-flagpack/dist/style.css'
import Vec2 from '../classes/Vec2';

const downloadSpeedToHexColor = {
    "0-5": "#FF6F6F",       // Brighter Red
    "5-10": "#FF9A5B",      // Brighter Peach
    "10-20": "#F9F93F",     // Brighter Yellow
    "20-50": "#9CFE9F",     // Brighter Green
    "50-100": "#66C466",    // Brighter Light Green
    "100+": "#4CAF50"       // Brighter Green
};

const reversedMapping = {};
for (const [code, name] of Object.entries(countryMapping)) {
    reversedMapping[name] = code;
}

function createCountryColorsObject(metric){
    var object = {}
    for(var item in country_metrics){
        if(metric === "average"){
          object[countryMapping[item]] = getHexColorForSpeed((country_metrics[item].average_download + country_metrics[item].average_upload)/2)
        }
        else if(metric === "download"){
          object[countryMapping[item]] = getHexColorForSpeed((country_metrics[item].average_download))
        }
        else if(metric === "upload"){
          object[countryMapping[item]] = getHexColorForSpeed((country_metrics[item].average_upload))
        }
        else{
          object[countryMapping[item]] = getHexColorForSpeed((country_metrics[item].average_download + country_metrics[item].average_upload)/2)
        }
    }
    object["Somalia"] = object["Somaliland"]
    return object

}

function createProvinceColorsObject(metric){
    let p_object = {}
    for(var item in iso_metrics){
      if(metric === "average"){
        p_object[item] = getHexColorForSpeed((parseInt(iso_metrics[item][0]) + parseInt(iso_metrics[item][1]))/2)
      }
      else if(metric == "download"){
        p_object[item] = getHexColorForSpeed((parseInt(iso_metrics[item][0])))
      }
      else if(metric == "upload"){
        p_object[item] = getHexColorForSpeed((parseInt(iso_metrics[item][1])))
      }
      else{
        p_object[item] = getHexColorForSpeed((parseInt(iso_metrics[item][0]) + parseInt(iso_metrics[item][1]))/2)
      }
    }
    return p_object;
}

function getHexColorForSpeed(speed) {
    if (speed === null) return "#808080"; // Gray for missing data
    if (speed < 5) return downloadSpeedToHexColor["0-5"];
    if (speed < 10) return downloadSpeedToHexColor["5-10"];
    if (speed < 20) return downloadSpeedToHexColor["10-20"];
    if (speed < 50) return downloadSpeedToHexColor["20-50"];
    if (speed < 100) return downloadSpeedToHexColor["50-100"];
    return downloadSpeedToHexColor["100+"];
}

function SetViewOnClick() {
    const map = useMapEvent('click', (e) => {
      const layer = e.target; // Access the layer that was clicke
      const bounds = layer.getBounds(); // Get the bounds of the clicked feature
      let southWest = new Vec2(bounds._southWest.lat, bounds._southWest.lng)
      let northEast = new Vec2(bounds._northEast.lat, bounds._northEast.lng)
      let center = southWest.add(northEast.subtract(southWest).scale(1/2))
      console.log(center)
      map.fitBounds(bounds)
    })
    return null
}

function onCountryClick(feature, setFocusedData){
        fetch(`https://cadesayner.pythonanywhere.com/getCountryGeoJson?country=${feature.properties.NAME}`) 
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Parse JSON data from the response
        })
        .then(data => {
          setFocusedData(data);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
}

function calculatePolygonCentroid(polygonCoords) {
  let x = 0;
  let y = 0;
  let numPoints = 0;

  polygonCoords[0].forEach(([lng, lat]) => {
    x += lng;
    y += lat;
    numPoints += 1;
  });

  return [x / numPoints, y / numPoints];
}

function Map({metric, countryClickCallback, provinceClickCallback}) {
    const [focusedData, setFocusedData] = useState(null);
    const [countryColors, setCountryColors] = useState({});
    const [focusedColors, setFocusedColors] = useState({});
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [force, setForce] = useState(false)

    const provinceGeoJsonStyle = (feature)=>({
        fillColor: focusedColors[feature.properties.iso_3166_2] || 'grey',
        color: 'black',
        weight: 0.5,
        fillOpacity: 0.65,
        opacity: 0.5,
    });
    
    
    var countryGeoJsonStyle = (feature)=>({fillColor: countryColors[feature.properties.NAME] || 'grey',
      color: 'black',           // Border color
      weight: feature.properties.NAME === selectedFeature ? 2: 0.5,              
      opacity: feature.properties.NAME === selectedFeature ? 1: 0.5,
      fillOpacity: feature.properties.NAME === selectedFeature ? 0 : 0.65 })


    useEffect(() => {
        let c_colors = createCountryColorsObject(metric)
        setCountryColors(c_colors);
        let p_colors = createProvinceColorsObject(metric);
        setFocusedColors(p_colors);
      },
    [metric]);

    // useEffect(()=>{
    //   let c_colors = createCountryColorsObject(metric)
    //   setCountryColors(c_colors);
    // },[metric])

    useEffect(()=>{
        console.log("Focused data", focusedData)
        setForce(!force) // This is to force a rerender of the relevant feature, might not be necessary? 
    },[focusedData])

    const onEachFeature = (feature, layer) => {
        layer.on({
            click: (e) => {
              let centroid = [0,0]
              if(feature.geometry.type === "Polygon"){
                centroid = calculatePolygonCentroid(feature.geometry.coordinates)
              }
             
              else if(feature.geometry.type = "MultiPolygon"){
                centroid = calculatePolygonCentroid(feature.geometry.coordinates[0])
              }
              let map = e.sourceTarget._map 
              map.setView({lat:centroid[1], lng:centroid[0]}, 5.2)
              console.log(feature)
              if(feature != selectedFeature){
                onCountryClick(feature, setFocusedData);
                setSelectedFeature(feature.properties.NAME) // set the selected feature here
              }
                
              },
              
              mousedown: (e) =>{
                if (e.originalEvent.button === 1) {
                  countryClickCallback(feature.properties.NAME) // send data back so that it can populate the cards with that sweet sweet goodness
                }
              },

              // mouseover: (e) => {
              //   if(feature.properties.NAME != selectedFeature){
              //     layer.setStyle({ fillOpacity: 0.8});
              //   }
              // },
              // mouseout: (e) => {
              //   const layer = e.target;
              //   if(feature.properties.NAME != selectedFeature && layer.feature.properties.NAME != selectedFeature){
              //     console.log("changed")
              //     console.log(feature.properties.NAME, layer.feature.properties.NAME)
              //     layer.setStyle({
              //       fillOpacity: 0.65,
              //     });
              //   }
              // }
            });

            {/* <Flag code=${reversedMapping[feature.properties.NAME]}</Flag> */} //Need to get this flag into the tooltip, remake?
            const tooltipContent = `<div class="leaflet-tooltip-style">
            <strong>${feature.properties.NAME ? feature.properties.NAME : feature.properties.name}</strong>
            </div>`;
            layer.bindTooltip(tooltipContent, {
              permanent: false,
              direction: 'auto',
              className: 'leaflet-tooltip-style'
            });
    };

    const onEachFeatureProvince = (feature, layer) => {
      layer.on({

            mousedown: (e) =>{
              if (e.originalEvent.button === 1) {
                provinceClickCallback(feature.properties.admin, feature.properties.name) // send data back so that it can populate the cards with that sweet sweet goodness
              }
            },

            mouseover: (e) => {
              layer.setStyle({ fillOpacity: 0.8 });

            },
            mouseout: (e) => {
              const layer = e.target;
              layer.setStyle({
                fillOpacity: 0.65,
              });
            }
          });
        
          const tooltipContent = `<div class="leaflet-tooltip-style"><strong>${feature.properties.NAME ? feature.properties.NAME : feature.properties.name}</strong> <br>
           <p>Download Speed: ${iso_metrics[feature.properties.iso_3166_2] ? parseFloat(iso_metrics[feature.properties.iso_3166_2][0]).toFixed(2) : "No data"}</p>
           <p>Upload Speed: ${iso_metrics[feature.properties.iso_3166_2] ? parseFloat(iso_metrics[feature.properties.iso_3166_2][1]).toFixed(2): "No data"}</p>
           </div>`;
          layer.bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'auto',
            className: 'leaflet-tooltip-style'
          });
  };
    return (
      
      
        <MapContainer zoomControl={false} center={[0, 16]} maxBounds={[
          [-40, -40], // South-West corner
          [40, 75],   // North-East corner
        ]} zoom={4} minZoom={4} maxZoom={10} style={{position:"fixed", height: "100vh", width: "100%" }}>
           
        
          <GeoJSON 
            onEachFeature={(feature, layer) => onEachFeature(feature, layer)} 
            data={africa} 
            style={countryGeoJsonStyle}
          />

          {focusedData && (<GeoJSON 
            // onEachFeature={onEachFeature} 
            key={force}
            style={provinceGeoJsonStyle}
            onEachFeature={(feature, layer) => onEachFeatureProvince(feature, layer)}
            data={focusedData}/>)}

{  
        <TileLayer
            url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=NX3QDTlTJcKS9eKWCLUy"
            attribution='&copy; <a href="https://www.maptiler.com/copyright">MapTiler</a>'
        />
      }   

        <SetViewOnClick />
        </MapContainer>
    );
  }

export default Map