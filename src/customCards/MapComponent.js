import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import africaGeoJson from '../json/africa_boundaries.json'; // Adjust the path to your GeoJSON file
import { Flex, Box, Card } from '@radix-ui/themes';
const countryMapping = {
    AO: "Angola",
    BF: "Burkina Faso",
    BI: "Burundi",
    BJ: "Benin",
    BW: "Botswana",
    CD: "Dem. Rep. Congo",
    CF: "Central African Rep.",
    CG: "Congo",
    CI: "Côte d'Ivoire",
    CM: "Cameroon",
    CV: "Cape Verde",
    DJ: "Djibouti",
    DZ: "Algeria",
    EG: "Egypt",
    EH: "W. Sahara",
    ER: "Eritrea",
    ET: "Ethiopia",
    GA: "Gabon",
    GH: "Ghana",
    GM: "Gambia",
    GN: "Guinea",
    GQ: "Eq. Guinea",
    GW: "Guinea-Bissau",
    KE: "Kenya",
    KM: "Comoros",
    LR: "Liberia",
    LS: "Lesotho",
    LY: "Libya",
    MA: "Morocco",
    MG: "Madagascar",
    ML: "Mali",
    MR: "Mauritania",
    MU: "Mauritius",
    MW: "Malawi",
    MZ: "Mozambique",
    NA: "Namibia",
    NE: "Niger",
    NG: "Nigeria",
    RE: "Réunion",
    RW: "Rwanda",
    SC: "Seychelles",
    SD: "Sudan",
    SH: "Saint Helena",
    SL: "Sierra Leone",
    SN: "Senegal",
    SO: "Somaliland",
    SOM: "Somalia",
    SS: "S. Sudan",
    ST: "São Tomé and Príncipe",
    SZ: "Swaziland",
    TD: "Chad",
    TG: "Togo",
    TN: "Tunisia",
    TZ: "Tanzania",
    UG: "Uganda",
    YT: "Mayotte",
    ZA: "South Africa",
    ZM: "Zambia",
    ZW: "Zimbabwe"
};

const downloadSpeedToHexColor = {
    "0-5": "#E55B5B",       // Darker Pastel Red
    "5-10": "#E5944C",      // Darker Peach Puff
    "10-20": "#E3E54F",     // Darker Light Yellow
    "20-50": "#7CD68F",     // Darker Pastel Green
    "50-100": "#4CAF50",    // Darker Light Green
    "100+": "#1B8C1A"       // Darker Green
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


function getHexColorForSpeed(speed) {
    if (speed === null) return "#808080"; // Gray for missing data
    if (speed < 5) return downloadSpeedToHexColor["0-5"];
    if (speed < 10) return downloadSpeedToHexColor["5-10"];
    if (speed < 20) return downloadSpeedToHexColor["10-20"];
    if (speed < 50) return downloadSpeedToHexColor["20-50"];
    if (speed < 100) return downloadSpeedToHexColor["50-100"];
    return downloadSpeedToHexColor["100+"];
}
// Example API call function
const fetchCountryColors = async () => {
  // Replace with your API endpoint
  const response = await fetch('https://CadeSayner.pythonanywhere.com/getGeoData');
  const data = await response.json();
  return createColorsObject(data); // Expected format: { "Country Name": "#ff0000", ... }
};

function MapComponent({ onCountryClick}) {
  const [map, setMap] = useState(null);
  const [countryColors, setCountryColors] = useState({});
  const [hoverState, setHoverState] = useState(null); // hover state = [countryName, mousePosition : []]
  console.log(hoverState)

  useEffect(() => {
    if (map) {
      // Center the map on Africa and set zoom level
      //map.setView([0, 20], 5); // Latitude and Longitude for Africa, zoom level 3
    }
  }, [map]);

  useEffect(() => {
    const loadColors = async () => {
      const colors = await fetchCountryColors();
      setCountryColors(colors);
    };
    loadColors();
  }, []);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        // Pass the name of the country or other relevant data to the parent
        onCountryClick(feature.properties.NAME);
      },
      mouseover: (e) => {
        layer.setStyle({ fillOpacity: 0.8 });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 1,
        });
        // setHoverState(null)
      }
    });
    // Add a tooltip to each layer
    const tooltipContent = `<div class="leaflet-tooltip-style"><strong>${feature.properties.NAME}</strong></div>`;
    layer.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'auto',
      className: 'leaflet-tooltip-style'
    });
  };

  const style = (feature) => ({
    color: 'white',
    weight: 0.7,
    opacity: 1,
    fillColor: countryColors[feature.properties.NAME] || 'grey', // Use the color from API data or default to grey
    fillOpacity: 1,
  });

  const bounds = [
    [-45, -60], // Southwest corner of the bounds
    [50, 80]   // Northeast corner of the bounds
  ];

  return (
    <MapContainer
    whenCreated={setMap}
    style={{ height: '100vh', width: '100%', backgroundColor: "#c8d4e3"}}
    center={[0, 20]} // Center of Africa
    zoom={3.5} // Zoom level to focus on Africa
    scrollWheelZoom={true}
    minZoom={3} // Minimum zoom level
    maxZoom={3.5} // Maximum zoom level
    dragging={true}
    maxBounds={bounds}
    maxBoundsViscosity={1} // Make the bounds strict (0.0 - 1.0)
  >
    <GeoJSON
      data={africaGeoJson}
      onEachFeature={onEachFeature}
      style={style}
    />
  </MapContainer>
  );
}

export default MapComponent;
