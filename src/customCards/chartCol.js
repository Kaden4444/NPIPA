import '@radix-ui/themes/styles.css';
import { Flex, Box, Card, Button} from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
import DownloadChart from './/DownloadChart';
import UploadChart from './UploadChart';

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

const graphLineColors = [
    '#FF6F61',  // Coral
    '#6B5B95',  // Purple
    '#88B04B',  // Lime Green
    '#F7CAC9',  // Light Pink
    '#92A8D1',  // Light Blue
    '#F6D55C',  // Bright Yellow
    '#FF9A8B',  // Peach
    '#D5AAFF',  // Lavender
    '#6D9DC5',  // Sky Blue
    '#FFBF00',  // Golden Yellow
    '#B9D9EB',  // Light Sky Blue
    '#FF6F91',  // Hot Pink
    '#88C0D8',  // Pastel Blue
    '#F28D35',  // Bright Orange
    '#F9A825'   // Bright Amber
  ];
  


function getDownloadChartData(cards){
    var out = []
    for(var i =0; i < cards.length; i++)
    {
        let download_data = cards[i].countryData.map(element => element.average_download)
        const item = {
            borderColor: graphLineColors[i],
            backgroundColor: graphLineColors[i],
            pointRadius: 1,
            label: cards[i].countryName,
            data:download_data,
            tension:0.1
        }
        out.push(item)
    }
    return out
}

function getUploadChartData(cards){
  var out = []
  for(var i =0; i < cards.length; i++)
  {
      let upload_data = cards[i].countryData.map(element => element.average_upload)
      const item = {
          borderColor: graphLineColors[i],
          backgroundColor: graphLineColors[i],
          pointRadius: 1,
          label: cards[i].countryName,
          data:upload_data,
          tension: 0.1, // Smooths the line
      }
      out.push(item)
  }
  return out
}

export function ChartCol({countryFilters}) {
    // data for both charts
  const [downloadChartData, setDownloadChartData] = useState([]);
  const [uploadChartData, setUploadChartData] = useState([]);
  const [showColumn, setShowColumn] = useState(true);

  const handleHideClick = () => {
    setShowColumn(false);
  };

  const handleShowClick = () => {
    setShowColumn(true);
  };

  console.log(countryFilters)
  useEffect(() => {
      setDownloadChartData(getDownloadChartData(countryFilters))
      setUploadChartData(getUploadChartData(countryFilters))
      console.log("trying to update graphs")
  }, [countryFilters]);

  return (
    <>
    {showColumn ? (
    <Flex direction="column"  style={{ width: '45%', padding: '25px', borderRight: '1px solid #ccc'}}> 
      <Button variant="outline" size="1" radius="full" onClick={handleHideClick} style={{position: 'absolute',left: 0,top: 0}}>
        Hide
      </Button> 
      <DownloadChart chartData={downloadChartData} />
      <UploadChart chartData={uploadChartData} />
    </Flex>
  ) : (
        <Button  variant="solid" size="1" radius="full"  style={{position: 'fixed',top: 0,left: 0,zIndex: 30}} onClick={handleShowClick}>
          Charts 
        </Button>
      )}
    </>
  );
  
} 