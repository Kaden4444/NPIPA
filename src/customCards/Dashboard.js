import React, {useState} from 'react'
import '@radix-ui/themes/styles.css';
import { ChartCol } from './ChartCol';
import { FilterCol } from './FilterCol';
import { Flex } from '@radix-ui/themes';
import axios from 'axios';
import countryMapping from '../json/countries.json'
import Map from './Map';
import regions from '../json/regions.json'
import region_name_iso from '../json/region_name_to_iso366.json'

const api_endpoint = "https://cadesayner.pythonanywhere.com"

const reversedMapping = {};
for (const [code, name] of Object.entries(countryMapping)) {
  reversedMapping[name] = code;
}

function Dashboard() {
    const [countryFilters, setCountryFilters] = useState([]);

    const pushCountry = (data, countryName,regionName="ALL") =>{
      setCountryFilters((prevCards) => [
        ...prevCards,
        { countryName, locked: false, isp:"ALL", countryData:data, city:regionName}
      ]);
    }

    const addCountryFilter = (countryName) => {
      console.log(countryName)
      axios.get(`${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=ALL&city=ALL&region=ALL`)
      .then(response => pushCountry(response.data, countryName)) //
      .catch(error => console.error(error));
    }

    const addCountryFilter_Region = (countryName, regionName) => {
      console.log(countryName, regionName)
      let request_endpoint = `${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=ALL&city=ALL&region=${region_name_iso[regionName]}`
      axios.get(request_endpoint)
      .then(response => pushCountry(response.data, countryName, regionName)) //
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
      let request_endpoint = ''
      if(regions.includes(city)){
        console.log("we got a region!!")
        console.log(region_name_iso[city])
        request_endpoint = `${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=${isp}&city=ALL&region=${region_name_iso[city]}`
      }
      else{
        request_endpoint = `${api_endpoint}/getCountryData?country=${reversedMapping[countryName]}&isp=${isp}&city=${city}&region=ALL`
      }
      console.log(request_endpoint)
      axios.get(request_endpoint)
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
        <Map countryClickCallback={addCountryFilter} provinceClickCallback={addCountryFilter_Region}/>
        <FilterCol countryFilters={countryFilters} onCountryLockChange={onCountryLockChange} filter_change_callback={onCountryFilterChange} purgeCards={onPurge} onCountryDeleteCallback={onCountryDeleteCallback}/>
      </Flex>  
    );
  }
  
export default Dashboard;
