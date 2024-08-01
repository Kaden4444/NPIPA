import React from 'react'
import './App.css';
import '@radix-ui/themes/styles.css';
import {Theme, ThemePanel } from '@radix-ui/themes';
import { ChartCol } from './customCards/chartCol';
import { FilterCol } from './customCards/FilterCol';
import Canvas from './customCards/Canvas';
import { Flex, Box, Card, Inset } from '@radix-ui/themes';
// npm i react-chartjs-2 chart.js

//<ChartCol/>
//<FilterCol/>
//<ThemePanel />

//<Flex>
//<Box width="250" height="250" left="9" top="5">
 // <Canvas/>
//</Box>  
//</Flex>

function App() {
  return (
    <Theme>
    <ChartCol/>
    <FilterCol/>
    <ThemePanel />yt
    </Theme>
  );
}

export default App;
