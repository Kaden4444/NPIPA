import React from 'react'
import './App.css';
import '@radix-ui/themes/styles.css';
import {Theme, ThemePanel } from '@radix-ui/themes';
import  Dashboard  from './customCards/Dashboard';

function App() {
  return (
    <Theme>
    <Dashboard/>
    </Theme> 
  );
}

export default App;
