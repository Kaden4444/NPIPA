import '@radix-ui/themes/styles.css';
import { Flex, Box, Card, Button, ScrollArea, SegmentedControl, Portal} from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
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


function getDownloadChartData(cards, timeScale){ // Needs to return an array of arrays 
    var out = []
    for(var i =0; i < cards.length; i++)
    {
        let download_data = cards[i].countryData[parseInt(timeScale)].download_data
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
            data:download_data,
            fill:true,
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
          data:upload_data,
          fill:true,
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
          fill:true,
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
          data:download_latency_data,
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

  const [timeScale, setTimeScale] = useState("0");
  const [labels, setLabels] = useState([]); // The labels used by all charts in this column
  const [selectedValue, setSelectedValue] = useState("0")


  const onSave = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(12);  // Set font size for the title
    pdf.text('Network Performance Insights Report', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
    htmlToImage.toPng(document.getElementById(`chart-group-1`), { quality: 1 })
        .then(function (dataUrl) {
          const imgProps= pdf.getImageProperties(dataUrl);
          const pdfWidth = pdf.internal.pageSize.getWidth()/2;
          const pdfHeight = ((imgProps.height * pdfWidth) / imgProps.width);
          pdf.addImage(dataUrl, 'PNG', 50, 25, pdfWidth, pdfHeight);
          pdf.addPage();
          htmlToImage.toPng(document.getElementById(`chart-group-2`), { quality: 1 })
        .then(function (dataUrl) {
          const imgProps= pdf.getImageProperties(dataUrl);
          const pdfWidth = pdf.internal.pageSize.getWidth()/2;
          const pdfHeight = ((imgProps.height * pdfWidth) / imgProps.width);
          pdf.addImage(dataUrl, 'PNG', 50, 10, pdfWidth, pdfHeight);
          let date = new Date().toString().split(' ');
          date = date[1] + '-' + date[2];
          pdf.save(`NPIP-Report-${date}.pdf`);
        })
        });

    

  }

  useEffect(() => {
      setDownloadChartData(getDownloadChartData(countryFilters, timeScale))
      setUploadChartData(getUploadChartData(countryFilters, timeScale))
      setDownloadLatencyChartData(getDownloadLatencyChartData(countryFilters, timeScale))
      setUploadLatencyChartData(getUploadLatencyChartData(countryFilters, timeScale))

      axios.get(`https://cadesayner.pythonanywhere.com/getLabels?q=${timeScaleIndexToQueryMap[timeScale]}`)
      .then(response => setLabels(response.data)) //
      .catch(error => console.error(error));

  }, [countryFilters, timeScale]);

  useEffect(()=>
  {
    setTimeScale(selectedValue)
  },[selectedValue])

  return (
    <>
 (
          <Card size={3} variant='classic' style={{width:'25vw', display: 'flex', flexDirection: 'column', gap: '10px', height: '100vh', padding: '10px' }} >
          <div>
            <h1 style={{textAlign: 'center', fontSize:"20px"}} >Your Charts</h1> 
            <Button style={{position:'relative'}} onClick={onSave}> <FaSave/></Button>
          </div>
          <Flex style={{width:'80%'}}>
            <SegmentedControl.Root variant="surface"  size="1" id="timeScaleSelect" value={selectedValue} onValueChange={e => setSelectedValue(e)} >
              <SegmentedControl.Item value="0">Last 5 Years</SegmentedControl.Item>
              <SegmentedControl.Item value="2">Last 12 Months</SegmentedControl.Item >
              <SegmentedControl.Item value="1">Last 6 Months</SegmentedControl.Item >
            </SegmentedControl.Root>
          </Flex>
          
          <ScrollArea  type="hover" scrollbars="vertical" style={{ height:"85vh", width:'100%', flex:1}}>
            <div id="chart-group-1">
              <div id="chart-1" style={{ width:'100%', flex:1}}><ChartCard  chartTitle={"Download Speed"} chartData={downloadChartData} labels={labels}/></div>
              <div id="chart-2" style={{ width:'100%', flex:1}}><ChartCard  chartTitle={"Upload Speed"} chartData={uploadChartData} labels={labels}/></div>
              <div id="chart-3" style={{ width:'100%', flex:1}}><ChartCard  chartTitle={"Download Latency"} chartData={downloadLatencyChartData} labels={labels}/></div>
              <br></br>
              </div>
            <div id="chart-group-2"> 
             <div id="chart-4" style={{ width:'100%', flex:1}}><ChartCard  chartTitle={"Upload Latency"} chartData={uploadLatencyChartData} labels={labels}/></div>        
             <br></br>
            </div>
          </ScrollArea>
        </Card>
      
  )</>);
  
} 