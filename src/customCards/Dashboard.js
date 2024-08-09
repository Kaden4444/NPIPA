import React, {useState} from 'react'
import '@radix-ui/themes/styles.css';
import {Theme, ThemePanel } from '@radix-ui/themes';
import { ChartCol } from './chartCol';
import { FilterCol } from './FilterCol';
import MapComponent from './MapComponent';
import { Flex, Box, Card } from '@radix-ui/themes';
import axios from 'axios';
import countryMapping from '../json/countries.json'
import Map from './Map';

const api_endpoint = "https://cadesayner.pythonanywhere.com"

const reversedMapping = {};
for (const [code, name] of Object.entries(countryMapping)) {
  reversedMapping[name] = code;
}

function Dashboard() {
    const [countryFilters, setCountryFilters] = useState([]);

    const pushCountry = (data, countryName) =>{
      setCountryFilters((prevCards) => [
        ...prevCards,
        { countryName, locked: false, isp:"ALL", countryData:data, city:"ALL"}
      ]);
    }

    const addCountryFilter = (countryName) => {
      console.log(countryName)
      axios.get(`${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=ALL&city=ALL`)
      .then(response => pushCountry(response.data, countryName)) //
      .catch(error => console.error(error));
    }

    const insertCountry = (countryName, id, data, isp, city) =>{
      console.log("trying to enter the following data", data)
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
    
    function onCountryFilterChange(countryName, isp, id, city){
      axios.get(`${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=${isp}&city=${city}`)
      .then(response => insertCountry(countryName, id, response.data, isp, city)) //
      .catch(error => console.error(error));
    }

    function onPurge(){
        let lockedCards = countryFilters.filter(card => card.locked);
        setCountryFilters(lockedCards)
    }

    return (
      <Flex > 
        <ChartCol countryFilters={countryFilters}/>
        {/* <MapComponent onCountryClick={addCountryFilter}/> */}
        <Map countryClickCallback={addCountryFilter}/>
        <FilterCol countryFilters={countryFilters} onCountryLockChange={onCountryLockChange} filter_change_callback={onCountryFilterChange} purgeCards={onPurge} onCountryDeleteCallback={onCountryDeleteCallback}/>
      </Flex>  
    );
  }
  
export default Dashboard;
