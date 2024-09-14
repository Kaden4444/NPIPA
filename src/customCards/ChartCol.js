import '@radix-ui/themes/styles.css';
import { Flex, Box, Card, Button, ScrollArea, SegmentedControl, Portal, Theme} from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {FaSave} from 'react-icons/fa'; 
import ChartCard from './ChartCard';
import countryMapping from '../json/countries.json'
import axios from 'axios';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { jsPDF } from "jspdf";
import html2pdf from 'html2pdf.js';

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

  const graphLineColors_alpha = [
    'rgba(255, 111, 97, 0.1)',  // Coral
    'rgba(107, 91, 149, 0.1)',  // Purple
    'rgba(136, 176, 75, 0.1)',  // Lime Green
    'rgba(247, 202, 201, 0.1)',  // Light Pink
    'rgba(146, 168, 209, 0.1)',  // Light Blue
    'rgba(246, 213, 92, 0.1)',  // Bright Yellow
    'rgba(255, 154, 139, 0.1)',  // Peach
    'rgba(213, 170, 255, 0.1)',  // Lavender
    'rgba(109, 157, 197, 0.1)',  // Sky Blue
    'rgba(255, 191, 0, 0.1)',    // Golden Yellow
    'rgba(185, 217, 235, 0.1)',  // Light Sky Blue
    'rgba(255, 111, 145, 0.1)',  // Hot Pink
    'rgba(136, 192, 216, 0.1)',  // Pastel Blue
    'rgba(242, 141, 53, 0.1)',   // Bright Orange
    'rgba(249, 168, 37, 0.1)'    // Bright Amber
];

function vecAdd(v1, v2, scalar){
  let res = []
  for(let i = 0; i < v1.length; i++){
    if(v1[i] !== null && v2[i] !== null){
      res[i] = scalar*(v1[i] + v2[i]);
    }
    else{
      res[i] = null;
    }
  }
  return res;
}

function getChartData(cards, timeScale, metric){
  var out = []
  for(var i =0; i < cards.length; i++)
  {
      let data = metric==="DOWNLOAD" ? cards[i].countryData[parseInt(timeScale)].download_data : metric === "UPLOAD" ? 
      cards[i].countryData[parseInt(timeScale)].upload_data : metric==="DOWNLOAD_L" ? cards[i].countryData[parseInt(timeScale)].download_latency_data :
      metric==="UPLOAD_L" ? cards[i].countryData[parseInt(timeScale)].upload_latency_data : vecAdd(cards[i].countryData[parseInt(timeScale)].download_data, 
      cards[i].countryData[parseInt(timeScale)].upload_data, 0.5);

      data = data.map((item)=>item?.toFixed(2)); // Round everything to 2 

      let label = cards[i].countryName;

      if (cards[i].city != "ALL"){
        label += `-${cards[i].city}`
      }
      if (cards[i].isp != "ALL"){
        label += `-${cards[i].isp}`
      }
      const item = {
          borderColor: graphLineColors[i],
          backgroundColor: graphLineColors_alpha[i],
          pointRadius: 1,
          label: label,
          data:data,
          fill:true,
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
  const [throughputChartData, setThroughputChartData] = useState([]);

  const [timeScale, setTimeScale] = useState("0");
  const [labels, setLabels] = useState([]); // The labels used by all charts in this column
  const [selectedValue, setSelectedValue] = useState("0")

  const screenWidth = window.innerWidth;
  const card_style = {width:'25vw',position:"fixed", display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '90vh', padding: '10px', marginTop: "4rem" }
  if(screenWidth >= 1000 && screenWidth <=1440){
    card_style.width='30vw'
  }

  useEffect(() => {
      setDownloadChartData(getChartData(countryFilters, timeScale,"DOWNLOAD"))
      setUploadChartData(getChartData(countryFilters, timeScale, "UPLOAD"))
      setDownloadLatencyChartData(getChartData(countryFilters, timeScale, "DOWNLOAD_L"))
      setUploadLatencyChartData(getChartData(countryFilters, timeScale, "UPLOAD_L"))
      setThroughputChartData(getChartData(countryFilters, timeScale, "THROUGHPUT"))

      axios.get(`https://cadesayner.pythonanywhere.com/getLabels?q=${timeScaleIndexToQueryMap[timeScale]}`)
      .then(response => setLabels(response.data)) //
      .catch(error => console.error(error));

  }, [countryFilters, timeScale]);

  useEffect(()=>
  {
    setTimeScale(selectedValue)
  },[selectedValue])

  return (
        <motion.div
          initial={{ x: -300, opacity: 0 }}  // Start from offscreen left
          animate={{ x: 0, opacity: 1 }}     // Animate to visible position
          exit={{ x: -300, opacity: 0 }}      // Animate out back to the left
          transition={{ duration: 0.5 }}      // Animation duration
        >

<Card size={3} variant='classic' style={card_style} >
          <div>
            <h1 style={{textAlign: 'center', fontSize:"30px"}} >Charts</h1> 
          </div>
          <Flex style={{width:'100%', right:"0", left:"0"} } direction={"row"} justify={'center'} align={'center'}>
            
            <SegmentedControl.Root variant="classic"  size="1"  id="timeScaleSelect" value={selectedValue} onValueChange={e => setSelectedValue(e)} >
              <SegmentedControl.Item value="0">Last 5 Years</SegmentedControl.Item>
              <SegmentedControl.Item value="2">Last 12 Months</SegmentedControl.Item >
              <SegmentedControl.Item value="1">Last 6 Months</SegmentedControl.Item >
            </SegmentedControl.Root>
            
          </Flex>
          
          <ScrollArea  type="hover" scrollbars="vertical" style={{ height:"85vh", width:'100%', flex:1}}>
            <div id="chart-group-1">
              <div id="chart-1" style={{ width:'100%', flex:1}}><ChartCard  chartTitle={"Download Speed"} chartData={downloadChartData} labels={labels}/></div>
              <div id="chart-2" style={{ width:'100%', flex:1}}><ChartCard  chartTitle={"Upload Speed"} chartData={uploadChartData} labels={labels}/></div>
              <br></br>
              </div>
            <div id="chart-group-2"> 
              <div id="chart-3" style={{ width:'100%', flex:1}}><ChartCard  chartTitle={"Download Latency"} chartData={downloadLatencyChartData} labels={labels}/></div>
              <div id="chart-4" style={{ width:'100%', flex:1}}><ChartCard  chartTitle={"Upload Latency"} chartData={uploadLatencyChartData} labels={labels}/></div> 
              <div id="chart-5" style={{ width:'100%', flex:1}}><ChartCard  chartTitle={"Average Throughput"} chartData={throughputChartData} labels={labels}/></div>             
             <br></br>
            </div>
          </ScrollArea>
        </Card>
        </motion.div>
          
);
  
} 