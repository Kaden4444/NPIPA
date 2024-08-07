import '@radix-ui/themes/styles.css';
import { Flex, Box, Card, Button, ScrollArea, SegmentedControl, Portal} from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
import DownloadChart from './/DownloadChart';
import UploadChart from './UploadChart';
import UploadLatencyChart from './UploadLatencyChart';
import DownloadLatencyChart from './DownloadLatencyChart';

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
  

function getDownloadChartData(cards, timeScale){ // Needs to return an array of arrays 
    var out = []
    for(var i =0; i < cards.length; i++)
    {
        let download_data = cards[i].countryData[parseInt(timeScale)].download_data
        const item = {
            borderColor: graphLineColors[i],
            backgroundColor: graphLineColors[i],
            pointRadius: 1,
            label: cards[i].countryName,
            data:download_data,
            tension:0.15
        }
        out.push(item)
    }
    return out
}

function getUploadChartData(cards, timeScale){
  var out = []
  for(var i =0; i < cards.length; i++)
  {
      let upload_data = cards[i].countryData[parseInt(timeScale)].upload_data
      const item = {
          borderColor: graphLineColors[i],
          backgroundColor: graphLineColors[i],
          pointRadius: 1,
          label: cards[i].countryName,
          data:upload_data,
          tension:0.15
      }
      out.push(item)
  }
  return out
}

function getUploadLatencyChartData(cards, timeScale){
  var out = []
  for(var i =0; i < cards.length; i++)
  {
      let upload_latency_data = cards[i].countryData[parseInt(timeScale)].upload_latency_data
      const item = {
          borderColor: graphLineColors[i],
          backgroundColor: graphLineColors[i],
          pointRadius: 1,
          label: cards[i].countryName,
          data:upload_latency_data,
          tension:0.15
      }
      out.push(item)
  }
  return out
}

function getDownloadLatencyChartData(cards, timeScale){
  var out = []
  for(var i =0; i < cards.length; i++)
  {
      let download_latency_data = cards[i].countryData[parseInt(timeScale)].download_latency_data
      const item = {
          borderColor: graphLineColors[i],
          backgroundColor: graphLineColors[i],
          pointRadius: 1,
          label: cards[i].countryName,
          data:download_latency_data,
          tension:0.15
      }
      out.push(item)
  }
  return out
}

const timeScaleIndexToQueryMap = {
  '0' : '5',
  '1' : '6',
  '2' : '1'
}

export function ChartCol({countryFilters}) {
    // data for both charts
  const [downloadChartData, setDownloadChartData] = useState([]);
  const [uploadChartData, setUploadChartData] = useState([]);
  const [downloadLatencyChartData, setDownloadLatencyChartData] = useState([]);
  const [uploadLatencyChartData, setUploadLatencyChartData] = useState([]);
  const [showColumn, setShowColumn] = useState(true);
  const [timeScale, setTimeScale] = useState("0");
  const [labels, setLabels] = useState([]); // The labels used by all charts in this column
  const [selectedValue, setSelectedValue] = useState("0")

  const handleHideClick = () => {
    setShowColumn(false);
  };

  const handleShowClick = () => {
    setShowColumn(true);
  };

  const expandGraph = (value) => {
    
      <Portal.Root >
        <Box width="50vh" height="50vh" top="5" left="5">
          <DownloadChart chartData={downloadChartData} labels={labels}/>
        </Box>  
      </Portal.Root>;  
    
  }

  useEffect(() => {
      console.log("URGENT", timeScaleIndexToQueryMap[timeScale])
      setDownloadChartData(getDownloadChartData(countryFilters, timeScale))
      setUploadChartData(getUploadChartData(countryFilters, timeScale))
      setDownloadLatencyChartData(getDownloadLatencyChartData(countryFilters, timeScale))
      setUploadLatencyChartData(getUploadLatencyChartData(countryFilters, timeScale))

      axios.get(`http://localhost:5000/getLabels?q=${timeScaleIndexToQueryMap[timeScale]}`)
      .then(response => setLabels(response.data)) //
      .catch(error => console.error(error));
  }, [countryFilters, timeScale]);

  useEffect(()=>
  {
    console.log("changing time scale to", selectedValue)
    setTimeScale(selectedValue)
  },[selectedValue])

  useEffect(()=>
    {
      console.log(labels)
    },[labels])


  return (
    <>
    {showColumn ? (
      <Flex direction="column"  style={{ width: '45%', padding: '25px', borderRight: '1px solid #ccc'}}> 
        
          <Button variant="outline" size="1" radius="full" onClick={handleHideClick} style={{position: 'absolute',left: 0,top: 0}}>
          Hide
          </Button> 
          <h1 style={{textAlign: 'center', fontSize:"20px"}} >Your Charts</h1> 

          <SegmentedControl.Root id="timeScaleSelect" defaultValue="inbox" onChange={e => setSelectedValue(e.target.value)}>
            <SegmentedControl.Item value="0">Last 5 Years</SegmentedControl.Item>
            <SegmentedControl.Item value="2">Last 12 Months</SegmentedControl.Item >
            <SegmentedControl.Item value="1">Last 6 Months</SegmentedControl.Item >
          </SegmentedControl.Root>

          {/*  
          <select
            id="timeScaleSelect"
            value={selectedValue}
            onChange={e => setSelectedValue(e.target.value)}
          >
            <option value="2">Last 12 Months</option>
            <option value="1">Last 6 months</option>
            <option value="0">Last 5 years</option>
          </select> 
          */}
 

  

          <ScrollArea type="hover" scrollbars="vertical" style={{ height:"85vh" }}>
            <Box>
              <Box onClick={expandGraph(0)}> {/* Attempted Portal */}
                <DownloadChart chartData={downloadChartData} labels={labels}/>
              </Box>
            
            <UploadChart chartData={uploadChartData} labels={labels} />
            <DownloadLatencyChart chartData={downloadLatencyChartData} labels={labels}/>
            <UploadLatencyChart chartData={uploadLatencyChartData} labels={labels}/>
          </Box>
        </ScrollArea>
      </Flex>
  ) : (
        <Button  variant="solid" size="1" radius="full"  style={{position: 'fixed',top: 0,left: 0,zIndex: 30}} onClick={handleShowClick}>
          Charts 
        </Button>
      )}
    </>
  );
  
} 