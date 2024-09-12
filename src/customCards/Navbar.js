import React from 'react';
import { Flex, Box, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Logo from './logo';
import ComponentBar from './ComponentBar';
import NetworkTest from './NetworkTest';



function Navbar({ showChartCol, toggleChartCol, showFilterCol, toggleFilterCol, showHelp, toggleShowHelp }) {
  return (
    <Flex
      as="header"
      direction="row"
      align="center"
      justify="between"
      style={{ width: '100%', backgroundColor: '#18191b', padding: '1rem', height: '4rem', zIndex: 1, position: "fixed" }}
    >
      {/* Left item */}
      <Box style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Logo />
      </Box>

      {/* Center item */}
      <Box maxWidth={"300px"} 
        style={{
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          textAlign: 'center',
          marginLeft:'20vw',
          zIndex: 20
        }}>

          {/* Add the autocomplete here */}
          <TextField.Root size="3" radius="large" placeholder="Search for a place..." >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
      </Box>

      {/* Right item */}
      <Flex style={{ backgroundColor: 'black', height: '50px', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '1rem'}}>
        <NetworkTest/>
        <span style={{width:'20px'}}></span>
        <ComponentBar showChartCol={showChartCol} toggleChartCol={toggleChartCol} showFilterCol={showFilterCol} toggleFilterCol={toggleFilterCol} showHelp={showHelp} toggleShowHelp={toggleShowHelp}></ComponentBar>
      </Flex>
    </Flex>
  );
}

export default Navbar;
