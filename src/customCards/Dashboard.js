import React, {useState} from 'react'
import '@radix-ui/themes/styles.css';
import {Theme, ThemePanel } from '@radix-ui/themes';
import { ChartCol } from './chartCol';
import { FilterCol } from './FilterCol';
import MapComponent from './MapComponent';
import { Flex, Box, Card } from '@radix-ui/themes';
import axios from 'axios';

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

const reversedMapping = {};
for (const [code, name] of Object.entries(countryMapping)) {
  reversedMapping[name] = code;
}

function Dashboard() {
    const [countryFilters, setCountryFilters] = useState([]);

    const pushCountry = (data, countryName) =>{
      setCountryFilters((prevCards) => [
        ...prevCards,
        { countryName, locked: false, isp:"ALL", populated:false, countryData:data}
      ]);
    }
    const addCountryFilter = (countryName) => {
      axios.get(`https://CadeSayner.pythonanywhere.com/getCountryData?country=${reversedMapping[countryName]}&isp=ALL`)
      .then(response => pushCountry(response.data, countryName)) //
      .catch(error => console.error(error));
    };
    
    // Set the filters locked value to the value passed here
    function onCountryLockChange(index, value){
        setCountryFilters(prevCards =>
            prevCards.map((card, i) =>
              i === parseInt(index) ? { countryName : card.countryName, locked:value,isp:card.isp,populated:card.populated, countryData:card.countryData} : card
            )
          );
    }

    const insertCountry = (countryName, id, data,isp) =>{
      setCountryFilters(prevCards =>
        prevCards.map((card, i) =>
          i === parseInt(id) ? { countryName, locked:false, isp:isp, countryData:data} : card
        )
      );
    }

    function onCountryFilterChange(countryName, isp, id){
      axios.get(`https://CadeSayner.pythonanywhere.com/getCountryData?country=${reversedMapping[countryName]}&isp=${isp}`)
      .then(response => insertCountry(countryName, id, response.data, isp)) //
      .catch(error => console.error(error));
    }

    function onPurge(){
        let lockedCards = countryFilters.filter(card => card.locked);
        setCountryFilters(lockedCards)
    }

    return (
      <Flex > 
        <ChartCol countryFilters={countryFilters}/>
        <MapComponent onCountryClick={addCountryFilter}/>
        <FilterCol countryFilters={countryFilters} onCountryLockChange={onCountryLockChange} filter_change_callback={onCountryFilterChange} purgeCards={onPurge}/>
      </Flex>  
    );
  }
  
export default Dashboard;
