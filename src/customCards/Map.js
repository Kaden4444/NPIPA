
import React, { useEffect,useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvent, useMapEvents, ZoomControl } from 'react-leaflet';
import {Card, Flex} from '@radix-ui/themes';
import 'leaflet/dist/leaflet.css';
import africa from '../json/africa_boundaries.json'
import iso_metrics from '../json/iso_metrics.json'
import countryMapping from '../json/countries.json'
import country_metrics from '../json/country_metrics.json'
import * as ContextMenu from '@radix-ui/react-context-menu';
import 'react-flagpack/dist/style.css'
import Vec2 from '../classes/Vec2';
import '../index.css';

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
      console.log(bounds)
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

function Map({metric, countryClickCallback, provinceClickCallback, leaderboardCallback}) {
    const [focusedData, setFocusedData] = useState(null);
    const [countryColors, setCountryColors] = useState({});
    const [focusedColors, setFocusedColors] = useState({});
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [force, setForce] = useState(false)
    const [currentlyHovered, setCurrentlyHovered] = useState(null);
    const [canDisplayContextMenu, setCanDisplayContext] = useState(true);

    const [featureCounter, setFeatureCounter] = useState(0);
    const [contextCounter, setContextCounter] = useState(0);
    const countRef = useRef(contextCounter);
    // Context menu state
    const [contextMenuFeature, setCMFeature] = useState(null);
    const [contextMenuType, setContextMenuType] = useState(null);
    const [contextMenuAdmin, setCMAdmin] = useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    const provinceGeoJsonStyle = (feature)=>({
        fillColor: focusedColors[feature.properties.iso_3166_2] || 'grey',
        color: 'black',
        weight: 0.5,
        fillOpacity: 0.65,
        opacity: 0.5,
    });

    function contextMenuHandler(option){
        if(option === "Add"){
          if(contextMenuType === "COUNTRY"){
            countryClickCallback(contextMenuFeature);
          }
          else if(contextMenuType === "REGION"){
            provinceClickCallback(contextMenuAdmin, contextMenuFeature);
          }
        }
        else if(option === "ISP-Leaderboard"){
          if(option != "Add"){
            leaderboardCallback(contextMenuType, contextMenuFeature, "ISP")
          }
        }
        else if(option === "Region-Leaderboard"){
          leaderboardCallback(contextMenuType, contextMenuFeature, "REGION")
        }
        else{
          console.error("Invalid context menu selection.")
        }
    }
    function updateFeatureCounter(){
      setFeatureCounter(countRef.current + 1);
    }
    
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

    useEffect(() => {
      countRef.current = contextCounter
    },
    [contextCounter]);

    useEffect(() => {
      console.log(screenWidth)
    },
    [screenWidth]);

    useEffect(() => {
      if(contextCounter === featureCounter){
        setCanDisplayContext(true);
      }
      else{
        setCanDisplayContext(false);
      }
    },
    [contextCounter, featureCounter]);

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
             
              else if(feature.geometry.type === "MultiPolygon"){
                centroid = calculatePolygonCentroid(feature.geometry.coordinates[0])
              }
              let map = e.sourceTarget._map 
              map.setView({lat:centroid[1], lng:centroid[0]}, 5.2)
              if(feature !== selectedFeature){
                if(feature.properties.NAME !== "Eswatini" && feature.properties.NAME !== "S. Sudan" && feature.properties.NAME !== "Somaliland"){
                  onCountryClick(feature, setFocusedData);
                  setSelectedFeature(feature.properties.NAME) // set the selected feature here
                }
              }
                
              },
              
              mousedown: (e) =>{
                if(e.originalEvent.button === 2){
                  // Right click:
                  updateFeatureCounter()
                  setCMFeature(feature.properties.NAME)
                  setContextMenuType("COUNTRY")
                }
              },
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
                if(iso_metrics[feature.properties.iso_3166_2])
                {
                  provinceClickCallback(feature.properties.admin, feature.properties.name) // send data back so that it can populate the cards with that sweet sweet goodness
                }
              }
              if(e.originalEvent.button === 2){
                // Right click:
                updateFeatureCounter();
                setCMFeature(feature.properties.name);
                setCMAdmin(feature.properties.admin);
                setContextMenuType("REGION");
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
            <ContextMenu.Root>
              <ContextMenu.Trigger onContextMenu={() => setContextCounter(contextCounter+1)}>
                <MapContainer zoomControl={false} center={[0, 16]} maxBounds={[
                  [-40, -40], // South-West corner
                  [40, 75],   // North-East corner
                ]} 

                zoom={screenWidth > 1440 ? 4 : 3} minZoom={screenWidth > 1440 ? 4 : 3} maxZoom={10} style={{position:"fixed", height: "100vh", width: "100%" }}>
                  
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
              </ContextMenu.Trigger>
              <ContextMenu.Portal>
                {canDisplayContextMenu && (<ContextMenu.Content className='ContextMenuContent'>
                  <ContextMenu.Item className="ContextMenuItem" onSelect={() => {contextMenuHandler("Add")}}>
                    Add to Comparison
                  </ContextMenu.Item>
                  <ContextMenu.Item className="ContextMenuItem" onSelect={() => {contextMenuHandler("ISP-Leaderboard")}}>
                    ISP Rankings
                  </ContextMenu.Item>
                  <ContextMenu.Separator />
                  {contextMenuType==="COUNTRY" && <ContextMenu.Item className="ContextMenuItem" onSelect={() => contextMenuHandler("Region-Leaderboard")}>
                    Region Rankings
                  </ContextMenu.Item>}
                </ContextMenu.Content>)}
                </ContextMenu.Portal>
            </ContextMenu.Root>
    );
  }

export default Map