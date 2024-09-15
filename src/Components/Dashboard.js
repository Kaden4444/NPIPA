/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import '@radix-ui/themes/styles.css';
import { ChartCol } from './ChartComponents/ChartCol.js';
import { FilterCol } from './FilterComponents/FilterCol.js';
import { Flex} from '@radix-ui/themes';
import Navbar from './NavBarComponents/Navbar.js';
import MapMenu from './NavBarComponents/MapControl/MapMenu.js'
import axios from 'axios';
import countryMapping from '../json/countries.json'
import Map from './MapComponents/Map.js';
import regions from '../json/regions.json'
import region_name_iso from '../json/region_name_to_iso366.json';
import Leaderboard from './MapComponents/Leaderboard.js'
import Help from './NavBarComponents/Tutorial/Help.js';
import MapSettings from './NavBarComponents/MapControl/MapSettings.js';

const api_endpoint = "https://cadesayner.pythonanywhere.com"

const reversedMapping = {};
for (const [code, name] of Object.entries(countryMapping)) {
  reversedMapping[name] = code;
}
reversedMapping["Central African Republic"] = "CF";
reversedMapping["Democratic Republic of the Congo"] = "CD";
reversedMapping["Somalia"] = "SO";
reversedMapping["United Republic of Tanzania"] = "TZ";

function Dashboard({country}) {
  const [showChartCol, setShowChartCol] = useState(false);
  const [showFilterCol, setShowFilterCol] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mapMenuMetric, setMapMenuMetric] = useState("average");
  const [countryFilters, setCountryFilters] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState(null);
  const [showMapSettings, setShowMapSettings] = useState(false);
  const toggleChartCol = () => {
      setShowChartCol(prevChartState => !prevChartState);
  };

  const toggleFilterCol = () => {
      setShowFilterCol(prevFilterState => !prevFilterState);
  };

  const toggleShowHelp = () => {
      setShowHelp(prevHelpState => !prevHelpState);
  }

  const toggleShowMapSettings= () => {
    setShowMapSettings(!showMapSettings);
  }
  
  useEffect(()=>{
    let previousSession = window.localStorage.getItem("countryFilters")
    if(previousSession != null){
      let sessionData = JSON.parse(previousSession)
      if(sessionData.length !== 0){
        setCountryFilters(JSON.parse(previousSession))
        setShowChartCol(true);
        setShowFilterCol(true);
      }
      else if(countryMapping[country]){
        addCountryFilter(countryMapping[country])
      }
    }
    else if(countryMapping[country]){
      addCountryFilter(countryMapping[country])
    }
  }, [country])


  useEffect(() => {
    console.log(leaderboardData)
  }, [leaderboardData]);

  useEffect(()=>{
    window.localStorage.setItem("countryFilters", JSON.stringify(countryFilters))
  },[countryFilters])


    const pushCountry = (data, countryName,regionName="ALL") =>{
      setCountryFilters((prevCards) => [
        ...prevCards,
        { countryName, locked: false, isp:"ALL", countryData:data, city:regionName}
      ]);
    }

    const addCountryFilter = (countryName) => {
      setShowChartCol(true);
      setShowFilterCol(true);
      axios.get(`${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=ALL&city=ALL&region=ALL`)
      .then(response => pushCountry(response.data, countryName)) //
      .catch(error => console.error(error));
    }

    const addCountryFilter_Region = (countryName, regionName) => {
      setShowChartCol(true);
      setShowFilterCol(true);
      let request_endpoint = `${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=ALL&city=ALL&region=${region_name_iso[regionName]}`
      axios.get(request_endpoint)
      .then(response => pushCountry(response.data, countryName, regionName)) //
      .catch(error => console.error(error));
    }

    const addCountryFilter_City = (countryName, cityName) => {
      setShowChartCol(true);
      setShowFilterCol(true);
      let request_endpoint = `${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=ALL&city=${cityName}&region=ALL`
      axios.get(request_endpoint)
      .then(response => pushCountry(response.data, countryName, cityName)) //
      .catch(error => console.error(error));
    }

    const insertCountry = (countryName, id, data, isp, city) =>{
      setCountryFilters(prevCards =>
        prevCards.map((card, i) =>
          i === parseInt(id) ? { countryName, locked:false, isp:isp, countryData:data, city:city} : card
        )
      );
    }
    // Set the filters locked value to the value passed here
    function onCountryLockChange(index, value){
        setCountryFilters(prevCards =>
            prevCards.map((card, i) =>
              i === parseInt(index) ? { countryName : card.countryName, locked:value,isp:card.isp, countryData:card.countryData, city:card.city} : card
            )
          );
    }

    function onCountryDeleteCallback(index){
      console.log("trying to delete", index)
      let del_arr = countryFilters.slice(0, index).concat(countryFilters.slice(index + 1));
      setCountryFilters(del_arr);
    }

    function onCountryCopy(index){
      setShowChartCol(true);
      let countryCard = countryFilters[index];
      setCountryFilters((prevCards) => [
        ...prevCards,
        countryCard
      ]);
    }
    
    function onCountryFilterChange(countryName, isp, id, city){
      let request_endpoint = ''
      if(regions.includes(city)){
        request_endpoint = `${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=${isp}&city=ALL&region=${region_name_iso[city]}`
      }
      else{
        request_endpoint = `${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=${isp}&city=${city}&region=ALL`
      }
      setShowChartCol(true);
      axios.get(request_endpoint)
      .then(response => insertCountry(countryName, id, response.data, isp, city)) //
      .catch(error => console.error(error));
    }

    function onPurge(){
        let lockedCards = countryFilters.filter(card => card.locked);
        setCountryFilters(lockedCards)
    }

    function onMapMenuMetricChange(metric){
      setMapMenuMetric(metric)
    }



    function hideLeaderboard(){
      setShowLeaderboard(false);
      setLeaderboardData([])
    }

    
    function leaderboardCallback(contextMenuType, featureName, leaderboardType){
      if (leaderboardType === "ISP")
      {
        if (contextMenuType === "COUNTRY"){
          let requestEndpoint = `${api_endpoint}/getCountryISPLeaderboard?country=${reversedMapping[featureName]}`;
          axios.get(requestEndpoint)
          .then(response => setLeaderboardData(response.data)) //
          .catch(error => console.error(error));
        }
        else if(contextMenuType === "REGION"){
          let requestEndpoint = `${api_endpoint}/getRegionISPLeaderboard?region=${region_name_iso[featureName]}`;
          axios.get(requestEndpoint)
          .then(response => setLeaderboardData(response.data)) //
          .catch(error => console.error(error));
        }
        setShowLeaderboard(true);
        setLeaderboardType("ISP");
      }
      else if (leaderboardType === "REGION"){
        if(contextMenuType === "REGION"){
          console.error("Region menu can only be requested by a country call back")
          return;
        }
        let requestEndpoint = `${api_endpoint}/getRegionLeaderboard?country=${reversedMapping[featureName]}`;
          axios.get(requestEndpoint)
          .then(response => setLeaderboardData(response.data)) //
          .catch(error => console.error(error));
        setShowLeaderboard(true);
        setLeaderboardType("REGION");
      }
          
    }

    return (
      <Flex > 
        <Navbar showMapSettings={showMapSettings} toggleShowMapSettings={toggleShowMapSettings} metricChangeCallback={onMapMenuMetricChange} showChartCol={showChartCol} 
        toggleChartCol={toggleChartCol} showFilterCol={showFilterCol} toggleFilterCol={toggleFilterCol} 
        showHelp={showHelp} toggleShowHelp={toggleShowHelp} countryClickCallback={addCountryFilter} 
        provinceClickCallback={addCountryFilter_Region} cityClickCallback={addCountryFilter_City}/>
        <Map metric={mapMenuMetric} countryClickCallback={addCountryFilter} provinceClickCallback={addCountryFilter_Region} leaderboardCallback={leaderboardCallback}/>
        {showChartCol && <ChartCol countryFilters={countryFilters}/>}
        {showFilterCol && <FilterCol countryFilters={countryFilters} onCountryLockChange={onCountryLockChange}
         filter_change_callback={onCountryFilterChange} purgeCards={onPurge} onCountryDeleteCallback={onCountryDeleteCallback} onCountryCopyCallback={onCountryCopy}/>}
        {showHelp && <Help/>}
        {showLeaderboard && <Leaderboard hide={hideLeaderboard} data={leaderboardData} Type={leaderboardType}/>}
        {showMapSettings && <MapSettings metricChangeCallback={onMapMenuMetricChange} closeCallback={toggleShowMapSettings}/>}
        <Flex style={{width:'auto', justifyContent:'center', alignContent:'center'}}>
          <Flex><MapMenu metricChangeCallback={onMapMenuMetricChange}></MapMenu></Flex>
        </Flex>
      </Flex>
    );
  }
  
export default Dashboard;
