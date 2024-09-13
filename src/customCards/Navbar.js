import React, { useState } from 'react';
import { Flex, Box, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Logo from './logo';
import ComponentBar from './ComponentBar';
import NetworkTest from './NetworkTest';
import regions_cities from '../json/regions_and_cities.json';
import countryMapping from '../json/countries.json';
import Fuse from 'fuse.js';



const cities = regions_cities.map((country)=>{return country.cities.map((value)=>{return {name:value, country:country.country_code}})}).flat()
const regions = regions_cities.map((country)=>{return country.regions?.map((value)=>{return {name:value, country:country.country_code}})} ).flat()
const countries = Object.values(countryMapping).map((country)=>{return {name:country, country:''}})
const cities_names = cities.map((val)=>val?.name)
const region_names = regions.map((val)=>val?.name)
const country_names = countries.map((val)=>val?.name)

const regions_cities_names = cities.concat(regions).concat(countries)
function Navbar({ showChartCol, toggleChartCol, showFilterCol, toggleFilterCol, showHelp, toggleShowHelp, showMapSettings, toggleShowMapSettings, countryClickCallback, provinceClickCallback, cityClickCallback}) {
  const [searchQuery, setSearchQuery] = useState();
  const [searchResults, setSearchResults] = useState([]);

  function handleSearchChange(e){
    const search = e.target.value;
    setSearchQuery(search)
    const options = {
      keys:["name"],
      threshold: 0.6,  // Controls the fuzziness of the search, lower is stricter
    };
    const fuse = new Fuse(regions_cities_names, options);
    const result = fuse.search(search);
    setSearchResults(result.slice(0,5).map((feature)=>`${feature.item.name} ${feature.item.country}`))
  }

  function handleLocationSelect(region){
    const regionName = region.split(" ").slice(0,-1).join(" ");
    const countryCode = region.split(" ")[region.split(" ").length -1];
    console.log(regionName);
    console.log(countryCode);
    if(country_names.includes(regionName)){
      countryClickCallback(regionName);
    }
    else if(region_names.includes(regionName)){
      provinceClickCallback(countryMapping[countryCode], regionName)
    }
    else if(cities_names.includes(regionName)){
      cityClickCallback(countryMapping[countryCode], regionName)
    }

    else{
      alert("Invalid Region")
    }

    setSearchQuery("");
    setSearchResults([]);
  }

  return (
    <Flex
      as="header"
      direction="row"
      align="center"
      justify="between"
      style={{ width: '100%', backgroundColor: '#18191b', padding: '1rem', height: '4rem', zIndex: 1, position: "fixed" }}
    >
      {/* Left item */}
      <Box style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Logo />
      </Box>

      {/* Center item */}
      <Flex maxWidth={"300px"} 
        style={{
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          textAlign: 'center',
          marginLeft:'auto',
          zIndex: 20
        }}>

          {/* Add the autocomplete here */}
          <TextField.Root size="3" radius="large" placeholder="Search for a place..." onChange={handleSearchChange} value={searchQuery} >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          <Flex gap="4" direction="column" style={{marginTop: '10px', position:"fixed", top:'43px', width:'230px' }}> 
                    {searchResults.length > 0 &&(
                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0, border: '2px solid #444', borderRadius: '5px', maxHeight: '150px', overflowY: 'auto' }}>
                        {searchResults.map((city, index) => (
                          <li
                            key={index}
                            style={{display:'flex', padding: '5px', cursor: 'pointer', backgroundColor: index % 2 === 0 ? '#191919' : '#000' }}
                            onClick={() => handleLocationSelect(city)}>
                            <span style={{width:'80%', fontWeight:'bold'}}> {city.split(" ").slice(0,-1).join(" ")} </span> <span style={{color:'GrayText', fontWeight:'lighter'}}> {city.split(" ")[city.split(" ").length -1]} </span> 
                          </li>
                        ))}
                      </ul>
                    )}
            </Flex>
          </TextField.Root>
      </Flex>


      {/* Right item */}
      <Flex style={{ backgroundColor: 'black', height: '50px', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '1rem'}}>
        <NetworkTest/>
        <span style={{width:'20px'}}></span>
        <ComponentBar showMapSettings={showMapSettings} toggleShowMapSettings={toggleShowMapSettings} showChartCol={showChartCol} toggleChartCol={toggleChartCol} showFilterCol={showFilterCol} toggleFilterCol={toggleFilterCol} showHelp={showHelp} toggleShowHelp={toggleShowHelp}></ComponentBar>
      </Flex>
    </Flex>
  );
}

export default Navbar;
