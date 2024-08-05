import { Box, Card, Button, Flex, Text } from '@radix-ui/themes';
import { FaLock, FaUnlock, FaTrash} from 'react-icons/fa'; // Importing lock icons from react-icons
import React, { useState, useEffect } from 'react';
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
var hasSearched = false;

export default function TestComponent({ CountryName, isLocked, onToggleLock, onIspSelect, card_index}) {
    const [ispSearch, setIspSearch] = useState('');
    const [ispOptions, setIspOptions] = useState([]);

    const handleIspSelect = (isp) => {
        hasSearched = true;
        setIspSearch(isp); // Update the input to the selected ISP name
        setIspOptions([]); // Clear the options
        onIspSelect(CountryName, isp, card_index); // Call the parent function with the selected ISP
      };
    
      const handleInputChange = (e)=>{
        setIspSearch(e.target.value)
        if(hasSearched){
          hasSearched = false;
        }
      }
      useEffect(() => {
      if (ispSearch.length >= 1 && !hasSearched) { // Fetch only if more than 1 characters are entered
        axios.get(`https://CadeSayner.pythonanywhere.com/getISPs?country=${reversedMapping[CountryName]}&search=${ispSearch}`)
          .then(response => setIspOptions(response.data)) //
          .catch(error => console.error(error));
      } else {
        setIspOptions([]); // Clear options if search term is too short
      }
      }, [ispSearch]);

    return (
    <Box width="350px">
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
                <Button variant="soft" color='red'><FaTrash /></Button>
                <Button onClick={onToggleLock}>{isLocked ? <FaLock /> : <FaUnlock />}</Button>
              </Flex>
            </Box>

            <Flex>
              <input type="text" placeholder="Search City..." style={{ width: '100%', padding: '3px', marginTop: '5px' }} />
            </Flex>

            <Flex>
              <input type="text" placeholder="Search ISP..."value={ispSearch} onChange={handleInputChange} style={{ width: '100%', padding: '3px', marginTop: '5px' }} />
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
