import React from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@radix-ui/react-navigation-menu';
import { Flex, Box, Text, Card, IconButton, Tooltip } from '@radix-ui/themes';
import { FaGlobeAfrica } from 'react-icons/fa';
import { MagnifyingGlassIcon, BarChartIcon, QuestionMarkIcon  } from '@radix-ui/react-icons';
import { FaEarthAfrica } from "react-icons/fa6";

function Navbar({ showChartCol, toggleChartCol, showFilterCol, toggleFilterCol, showHelp, toggleShowHelp }) {

  return (
    <Box as="header" style={{ width: '100%', backgroundColor: 'black', zIndex: 1000, position: "fixed"}}>
      <Flex 
        as="nav" 
        align="center" 
        justify="space-between" 
        padding="1rem" 
        style={{ height: '5rem' }} // Use rem for relative sizing
      >
        <FaGlobeAfrica style={{color : 'white', fontSize: '2rem' }} />
        <Text size="6" weight="bold" style={{ color: 'white', fontSize: '1.5rem' }}>NPIPA</Text>
        <NavigationMenu>
          <NavigationMenuList style={{ display: 'flex', gap: '2rem' }}>  {/* Using rem for spacing */}
            
            {/* This is the ComponentBar (visibility control) */}
            <NavigationMenuItem style={{ color: 'white', cursor: 'pointer', fontSize : '1.25rem' }}> 
              <Flex width={"10rem"} height={"3rem"}> {/* Using rem for size */}
                <Card size={2} align="center" variant='classic'>
                  <Flex direction={"row"} gapX={"0.5rem"} align="center"> {/* Using rem for gap */}
                    
                    <Tooltip content="Selected Countries">
                      <IconButton onClick={toggleFilterCol} variant={showFilterCol ? "solid" : "outline"} radius='full'>
                        <FaEarthAfrica width="18" height="18" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip content="Connectivity Data">
                      <IconButton onClick={toggleChartCol} variant={showChartCol ? "solid" : "outline"} radius='full'>
                        <BarChartIcon width="18" height="18" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip content="Help">
                      <IconButton onClick={toggleShowHelp} variant={showHelp ? "solid" : "outline"} radius='full'>
                        <QuestionMarkIcon width="18" height="18" />
                      </IconButton>
                    </Tooltip>
                    
                  </Flex>
                </Card>
              </Flex>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </Flex>
    </Box>
  );
}

export default Navbar;
