
import React, { useEffect,useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvent, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import africa from '../json/africa_boundaries.json'
import iso_metrics from '../json/iso_metrics.json'
import countryMapping from '../json/countries.json'
import 'react-flagpack/dist/style.css'

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

function createColorsObject(data){
    var object = {}
    for(var item in data){
        object[countryMapping[item]] = getHexColorForSpeed((data[item].average_download + data[item].average_download)/2)
    }
    object["Somalia"] = object["Somaliland"]
    return object
}

function createProvinceColorsObject(){
    let p_object = {}
    for(var item in iso_metrics){
        p_object[item] = getHexColorForSpeed(parseInt(iso_metrics[item][0]) + parseInt(iso_metrics[item][1]))
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

const fetchCountryColors = async () => {
    // Replace with your API endpoint
    const response = await fetch('https://cadesayner.pythonanywhere.com/getGeoData');
    const data = await response.json();
    return createColorsObject(data); // Expected format: { "Country Name": "#ff0000", ... }
};

function SetViewOnClick() {
    const map = useMapEvent('click', (e) => {
      map.setView(e.latlng, 4.5, {
        animate: true,
      })
    })
    return null
}

function onCountryClick(feature, setFocusedData){
        fetch(`https://cadesayner.pythonanywhere.com/getCountryGeoJson?country=${feature.properties.NAME}`) // Replace with your API URL
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

function Map({countryClickCallback, provinceClickCallback}) {
    const [focusedData, setFocusedData] = useState(null);
    const [countryColors, setCountryColors] = useState({});
    const [focusedColors, setFocusedColors] = useState({});
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [force, setForce] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const provinceGeoJsonStyle = (feature)=>({
        fillColor: focusedColors[feature.properties.iso_3166_2] || 'grey',
        color: 'black',
        weight: 0.5,
        fillOpacity: 0.65,
        opacity: 0.5,
    });

    useEffect(() => {
        const loadColors = async () => {
          const colors = await fetchCountryColors();
          setCountryColors(colors);
        };
        loadColors();
        let p_colors = createProvinceColorsObject();
        setFocusedColors(p_colors);
      },
    []);

    useEffect(()=>{
        setRefresh(!refresh); // Need this to get the chartjs component to wake up
    },[selectedFeature])

    useEffect(()=>{
        console.log("Focused data", focusedData)
        setForce(!force) // This is to force a rerender of the relevant feature, might not be necessary? 
    },[focusedData])

    const onEachFeature = (feature, layer) => {
        layer.on({
            click: () => {
                onCountryClick(feature, setFocusedData);
                setSelectedFeature(feature.properties.NAME) // set the selected feature here
                countryClickCallback(feature.properties.NAME) // send data back so that it can populate the cards with that sweet sweet goodness
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
            click: () => {
                provinceClickCallback(feature.properties.admin, feature.properties.name) // send data back so that it can populate the cards with that sweet sweet goodness
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
      
        <MapContainer zoomControl={false} center={[0, 16]} zoom={3.4} minZoom={3.4} maxZoom={10} style={{position:"fixed", height: "100vh", width: "100%" }}>
           
       {  
        <TileLayer
            url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=NX3QDTlTJcKS9eKWCLUy"
            attribution='&copy; <a href="https://www.maptiler.com/copyright">MapTiler</a>'
        />
      }     

          <GeoJSON onEachFeature={(feature, layer) => onEachFeature(feature, layer)} data={africa} 
          style={(feature) => ({
            key:{refresh},
            fillColor: countryColors[feature.properties.NAME] || 'grey',
            color: 'black',           // Border color
            weight: feature.properties.NAME === selectedFeature ? 2: 0.5,                // Border thickness
            opacity: feature.properties.NAME === selectedFeature ? 1: 0.5,
            
            fillOpacity: feature.properties.NAME === selectedFeature ? 0 : 0.65 // Hide specific country
          })}
          />

          {focusedData && (<GeoJSON 
            // onEachFeature={onEachFeature} 
            key={force}
            style={provinceGeoJsonStyle}
            onEachFeature={(feature, layer) => onEachFeatureProvince(feature, layer)}
            data={focusedData}/>)}
          
        <SetViewOnClick />
        </MapContainer>
      
    );
  }

export default Map