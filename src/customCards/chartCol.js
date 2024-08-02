import '@radix-ui/themes/styles.css';
import { Flex, Box, Card } from '@radix-ui/themes';
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
  

const fetchCardData = async (card_country_name, isp) => {
    console.log("trying")
    try {
      const response = await fetch(`https://CadeSayner.pythonanywhere.com/getCountryData?country=${reversedMapping[card_country_name]}&isp=${isp}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch card data:', error);
      return null;
    }
};

function getChartData(download_data, cards){
    var out = []
    for(var i =0; i < download_data.length; i++)
    {
        console.log(download_data[i])
        const item = {
            borderColor: graphLineColors[i],
            backgroundColor: graphLineColors[i],
            pointRadius: 1,
            label: cards[i].countryName,
            data:download_data[i]
        }
        out.push(item)
    }
    console.log(out)
    return out
}

export function ChartCol({ countryFilters }) {
    // data for both charts
  const [downloadChartData, setDownloadChartData] = useState([]);
  const [uploadChartData, setUploadChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dataPromises = countryFilters.map(card => fetchCardData(card.countryName, card.isp));
        const dataResults = await Promise.all(dataPromises);
        const download_data = dataResults.map(innerArray => 
            innerArray.map(item => item.average_download)
        );
        const upload_data = dataResults.map(innerArray => 
            innerArray.map(item => item.average_upload)
        );
       
        setDownloadChartData(getChartData(download_data,countryFilters))
        setUploadChartData(getChartData(upload_data,countryFilters))
      } catch (fetchError) {
        setError('Failed to fetch card data');
        console.error('Fetch error:', fetchError);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCardData();
  }, [countryFilters]);

  return (
    <Flex direction="column"  style={{ width: '35%', padding: '25px', borderRight: '1px solid #ccc'}}>
      <DownloadChart chartData={downloadChartData} />
      <UploadChart chartData={uploadChartData} />
    </Flex>
  );
} 