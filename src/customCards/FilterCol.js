import '@radix-ui/themes/styles.css';
import { useState } from 'react';
import { Flex, Box, Card, Button, ScrollArea, AlertDialog  } from '@radix-ui/themes';
import { FilterCard } from './FilterCard'; // Ensure the path is correct


export function FilterCol({countryFilters, onCountryLockChange, filter_change_callback, purgeCards, onCountryDeleteCallback, onCountryCopyCallback}) {

  function onIspSelect(countryName, isp, id, city){
    // on_card_change_callback(countryName, isp, id)
    filter_change_callback(countryName,isp,id, city)
  }

  const onPurgeCards = () => {
    // Needs to be altered here to remove data from the cards
    purgeCards();
  };

  const toggleCardLock = (index) => {
    // Needs to instead update the shared countryFilter state
    onCountryLockChange(index, !countryFilters[index].locked)
    console.log(countryFilters)
  };

  function onDelete(index){
    onCountryDeleteCallback(index)
  } 

  function onCopy(index){
    onCountryCopyCallback(index)
  }

  return (
    <> 
        <Card size={2} variant='surface' content='center' style={{ height:"90vh" ,position:"fixed", padding: '25px', borderRight: '1px solid #ccc', right: "0", marginTop: "5rem"}} >
            <Flex gap="5" align="center" direction="column" >
              <Box maxWidth="400px">           

                  <h1 style={{textAlign: 'center', fontSize:"30px"}} >
                    Countries
                  </h1> 
                
              </Box>
              
              <ScrollArea type="hover" scrollbars="vertical" style={{ height:"75vh" }}>
                <Flex gap="5" align="center" direction="column" >
                  {countryFilters.map((country, index) => (
                  <FilterCard
                    key={index}
                    card_index={index}
                    initialRegion={country.city}
                    initialISP={country.isp}
                    CountryName={`${country.countryName}`}
                    isLocked={country.locked}
                    onToggleLock={() => toggleCardLock(index)}
                    onIspSelect={onIspSelect}
                    onDelete={() => onDelete(index)}
                    onCopy={() => onCopy(index)}
                  />
                  ))}
                  
                  <AlertDialog.Root>
            <AlertDialog.Trigger>
            <Button variant="classic" color='red' >Delete Unlocked Cards</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Delete Unlocked Cards</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Are you sure? This will delete all country cards not locked with the blue lock icon.
              </AlertDialog.Description>
                          
              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button variant="solid" color="red" onClick={onPurgeCards}>
                    Yes, Delete
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>  

                </Flex>
              </ScrollArea>
            </Flex>
          </Card>
    </>
  );
}
