import React, {useState} from 'react'
import '@radix-ui/themes/styles.css';
import {Theme, ThemePanel } from '@radix-ui/themes';
import { ChartCol } from './chartCol';
import { FilterCol } from './FilterCol';
import MapComponent from './MapComponent';
import { Flex, Box, Card } from '@radix-ui/themes';

function Dashboard() {
    const [countryFilters, setCountryFilters] = useState([]);

    const addCountryFilter = (countryName) => {
      setCountryFilters((prevCards) => [
        ...prevCards,
        { countryName, locked: false, isp:"ALL"}
      ]);
      console.log(countryFilters)
    };
    
    // Set the filters locked value to the value passed here
    function onCountryLockChange(index, value){
        console.log(index, value)
        setCountryFilters(prevCards =>
            prevCards.map((card, i) =>
              i === parseInt(index) ? { countryName : card.countryName, locked:value,isp:card.isp } : card
            )
          );
    }

    function onCountryFilterChange(countryName, isp, id){
      console.log(countryName + isp + id)
      setCountryFilters(prevCards =>
        prevCards.map((card, i) =>
          i === parseInt(id) ? { countryName, locked:false,isp:isp } : card
        )
      );
      console.log(countryFilters)
    }

    function  onPurge(){
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
