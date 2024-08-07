import { Box, Card, Button, Flex, Text } from '@radix-ui/themes';
import { FaLock, FaUnlock, FaTrash} from 'react-icons/fa'; // Importing lock icons from react-icons
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cities from '../cities.json'
import countryMapping from '../countries.json'

function searchCities(countryCode, searchQuery) {
  const country = cities.find(d => d.country_code === countryCode);
  if (!country) {
    return [];
  }
  const results = country.cities.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return results.slice(0, 5);
}

const reversedMapping = {};
for (const [code, name] of Object.entries(countryMapping)) {
    reversedMapping[name] = code;
}
var hasSearchedISP = true;
var hasSearchedCity = true;

export function FilterCard({ CountryName, isLocked, onToggleLock, onIspSelect, card_index, onDelete}) {
    const [ispSearch, setIspSearch] = useState('ALL');
    const [ispOptions, setIspOptions] = useState([]);
    const [citySearch, setCitySearch] = useState("ALL");
    const [cityOptions, setCityOptions] = useState([]);

    const handleIspSelect = (isp) => {
        hasSearchedISP = true;
        setIspSearch(isp); // Update the input to the selected ISP name
        setIspOptions([]); // Clear the options
        onIspSelect(CountryName, isp, card_index, citySearch); // Call the parent function with the selected ISP
      };

      const handleCitySelect = (city) => {
        hasSearchedCity = true;
        setCitySearch(city); // Update the input to the selected ISP name
        setCityOptions([]); // Clear the options
        onIspSelect(CountryName, ispSearch, card_index, city); // Call the parent function with the selected ISP
      };
    
      const handleISPInputChange = (e)=>{
        setIspSearch(e.target.value)
        if(hasSearchedISP){
          hasSearchedISP = false;
        }
      }

      useEffect(() => {
      if (ispSearch.length >= 1 && !hasSearchedISP) { 
        axios.get(`https://CadeSayner.pythonanywhere.com/getISPs?country=${reversedMapping[CountryName]}&search=${ispSearch}`)
          .then(response => setIspOptions(response.data)) 
          .catch(error => console.error(error));
      } else {
        setIspOptions([]); 
      }
      }, [ispSearch]);

      const handleCityInputChange = (e)=>{
        setCitySearch(e.target.value)
        if(hasSearchedCity){
          hasSearchedCity = false;
        }
      }

      function handleIspFocus(){
        if(ispSearch === "ALL"){
          setIspSearch("");
        }
      }

      function handleCityFocus(){
        if(citySearch === "ALL"){
          setCitySearch("")
        }
      }

      useEffect(() => {
      if (citySearch.length >= 1 && !hasSearchedCity) { // Fetch only if more than 1 characters are entered
        setCityOptions(searchCities(reversedMapping[CountryName], citySearch))
      } else {
        setCityOptions([]); // Clear options if search term is too short
      }
      }, [citySearch]);


    return (
    <Box  width="350px">
      <Card size="3">
        <Box position="relative">
          <Flex direction="column" gap="2">
            <Flex direction="row" gap="2" minWidth="350px" width="350px">
              <Box>
                <Text as="div" size="2" weight="bold">{CountryName}</Text>
              </Box>
            </Flex>

            <Box position="absolute" top="0" right="0">
              <Flex direction="row" gap="2">
                <Button variant="soft" onClick={onDelete} color='red'><FaTrash /></Button>
                <Button onClick={onToggleLock}>{isLocked ? <FaLock /> : <FaUnlock />}</Button>
              </Flex>
            </Box>

            <Flex direction="row" gap="3" align="center">
              <Text> City:</Text>
              <input onFocus={handleCityFocus} type="text" placeholder="Search City..." value={citySearch} onChange={handleCityInputChange} style={{ width: '100%', padding: '3px', marginTop: '5px' }} />
            </Flex>

            <Flex gap="4" direction="column" style={{ marginTop: '10px' }}> 
              {cityOptions.length > 0 &&(
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, border: '5px solid #ddd', borderRadius: '5px', maxHeight: '150px', overflowY: 'auto' }}>
                  {cityOptions.map((city, index) => (
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

            <Flex direction="row" gap="3" align="center">
            <Text>ISP:</Text>
              <input onFocus={handleIspFocus} type="text" placeholder="Search ISP..."value={ispSearch} onChange={handleISPInputChange} style={{ width: '100%', padding: '3px', marginTop: '5px' }} />
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
