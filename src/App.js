import React, { useState } from 'react'
import './App.css';
import '@radix-ui/themes/styles.css';
import {Theme, ThemePanel } from '@radix-ui/themes';
import  Dashboard  from './customCards/Dashboard';

function App() {
  const [userCountry, setUserCountry] = useState();

  const fetchCountry = async () => {
    try {
      const response = await fetch('https://ipinfo.io/json?token=9688c89c2903a2');
      const data = await response.json();
      setUserCountry(data.country);
      
    } catch (error) {
      console.error('Error fetching country:', error);
    }
  };
  fetchCountry();

  return (
    <Theme appearance="dark" panelBackground='solid'>
      <Dashboard country={userCountry}/>
    </Theme> 
  );
}

export default App;
