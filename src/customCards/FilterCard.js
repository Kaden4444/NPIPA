import { Box, Card, Button, Flex, Text } from '@radix-ui/themes';
import {FaCopy, FaLock, FaUnlock, FaTrash} from 'react-icons/fa'; // Importing lock icons from react-icons
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import regions_cities from '../json/regions_and_cities.json';
import countryMapping from '../json/countries.json';
import Flag from 'react-flagpack';
import 'react-flagpack/dist/style.css'

function searchCities(countryCode, searchQuery) {
  const country = regions_cities.find(d => d.country_code === countryCode);
  if (!country) {
    return [];
  }
  const results1 = country.cities.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const results2 = country.regions.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );
  let results = new Set(results1.concat(results2))
  results = [...results]
  return results.slice(0, 5);
}

const reversedMapping = {};
for (const [code, name] of Object.entries(countryMapping)) {
    reversedMapping[name] = code;
}

export function FilterCard({ CountryName, isLocked, onToggleLock, onIspSelect, card_index, onDelete, initialRegion, initialISP, onCopy}) {
    const [ispSearch, setIspSearch] = useState('');
    const [ispOptions, setIspOptions] = useState([]);
    const [region_or_city_search, setCitySearch] = useState('');
    const [region_or_city_options, setCityOptions] = useState([]);
    const [current_city_or_region_selection, setCurrentRegionCity] = useState('');
    const [current_isp_selection, setCurrentISP] = useState('');
  
    const handleIspSelect = (isp) => {
        setIspSearch(''); // Update the input to the selected ISP name
        setCurrentISP(isp)
        setIspOptions([]); // Clear the options
        onIspSelect(CountryName, isp, card_index, current_city_or_region_selection); // Call the parent function with the selected ISP
      };

      const handleCitySelect = (region_city) => {
        setCitySearch(''); // Update the input to the selected ISP name
        setCurrentRegionCity(region_city)
        setCityOptions([]); // Clear the options
        onIspSelect(CountryName, current_isp_selection, card_index, region_city); // Call the parent function with the selected ISP
      };
    
      const handleISPInputChange = (e)=>{
        setIspSearch(e.target.value)
      }

      useEffect(()=>{
        // populate the region field if there is already a region
        if(initialRegion){
          setCurrentRegionCity(initialRegion)
        }
        if(initialISP){
          setCurrentISP(initialISP)
        }
      },[])

      useEffect(() => {
      if (ispSearch.length >= 1) { 
        axios.get(`https://cadesayner.pythonanywhere.com/getISPs?country=${reversedMapping[CountryName]}&search=${ispSearch}`)
          .then(response => setIspOptions(response.data)) 
          .catch(error => console.error(error));
      } else {
        setIspOptions([]); 
      }
      }, [ispSearch, CountryName]);

      const handleCityInputChange = (e)=>{
        setCitySearch(e.target.value)
      }
      
      useEffect(() => {
      if (region_or_city_search.length >= 1) { // Fetch only if more than 1 characters are entered
        setCityOptions(searchCities(reversedMapping[CountryName], region_or_city_search))
      } else {
        setCityOptions([]); // Clear options if search term is too short
      }
      }, [region_or_city_search, CountryName]);


    return (
    <Box width="20vw">
      <Card size="2" >
        <Box position="relative">
          <Flex direction="column" gap="1">
            <Flex direction="row" gap="2" minWidth="350px" width="350px">
              <Flex direction={"row"} gapX="2" align={"center"}>
                <Text as="div" size="2" weight="bold" >{CountryName}</Text>  
                <Flag hasDropShadow="true" code={reversedMapping[CountryName]} hasBorder="True"/>
              </Flex>
            </Flex>

            <Box position="absolute" top="0" right="0">
              <Flex direction="row" gap="2">
                <Button variant="soft" onClick={onCopy} color='purple' size={'1'}><FaCopy/></Button>
                <Button variant="soft" onClick={onDelete} color='red' size={'1'}><FaTrash /></Button>
                <Button onClick={onToggleLock} size={"1"} variant={ isLocked ? 'solid' : "outline"}   >{isLocked ? <FaLock /> : <FaUnlock />}</Button>
              </Flex>
            </Box>

            <Flex direction="column" gap="" align="left">
              <Text> City/Region: {current_city_or_region_selection}</Text>
              <input type="text" placeholder="Search City or Region" value={region_or_city_search} onChange={handleCityInputChange} style={{ width: '100%', padding: '3px', marginTop: '5px' }} />
            </Flex>

            <Flex gap="4" direction="column" style={{ marginTop: '10px' }}> 
              {region_or_city_options.length > 0 &&(
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, border: '5px solid #ddd', borderRadius: '5px', maxHeight: '150px', overflowY: 'auto' }}>
                  {region_or_city_options.map((city, index) => (
                    <li
                      key={index}
                      style={{ padding: '5px', cursor: 'pointer', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
                      onClick={() => handleCitySelect(city)}>
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </Flex>

            <Flex direction="column" gap="" align="left">
            <Text>ISP: {current_isp_selection}</Text>
              <input type="text" placeholder="Search ISP..."value={ispSearch} onChange={handleISPInputChange} style={{ width: '100%', padding: '3px', marginTop: '5px' }} />
            </Flex>
          </Flex>
        </Box>

        <Flex gap="4" direction="column" style={{ marginTop: '10px' }}> 
              {ispOptions.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, border: '5px solid #ddd', borderRadius: '5px', maxHeight: '150px', overflowY: 'auto' }}>
                  {ispOptions.map((isp, index) => (
                    <li
                      key={index}
                      style={{ padding: '5px', cursor: 'pointer', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
                      onClick={() => handleIspSelect(isp)}>
                      {isp}
                    </li>
                  ))}
                </ul>
              )}
            </Flex>
      </Card>
    </Box>
  );
}
