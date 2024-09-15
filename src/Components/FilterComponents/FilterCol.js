import '@radix-ui/themes/styles.css';
import { Flex, Box, Card, Button, ScrollArea, AlertDialog  } from '@radix-ui/themes';
import { FilterCard } from './FilterCard'; // Ensure the path is correct
import { motion } from 'framer-motion';

export function FilterCol({countryFilters, onCountryLockChange, filter_change_callback, purgeCards, onCountryDeleteCallback, onCountryCopyCallback}) {
  const screenWidth = window.innerWidth;
  const card_style = {minWidth:'23vw', height:"90vh" ,position:"fixed", padding: '25px', borderRight: '1px solid #ccc', right: "0", marginTop: "4rem"}
  if(screenWidth >= 1000 && screenWidth <=1440){
    card_style.minWidth='30vw'
  }
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
        <motion.div initial={{ x: '120vw', opacity: 0 }}  // Start from offscreen left
        animate={{ x: '100vw', opacity: 1 }}     // Animate to visible position
        exit={{ x: -300, opacity: 0 }}      // Animate out back to the left
        transition={{ duration: 0.5 }}>  
        <Card  size={2} variant='surface' content='center' style={card_style} >
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
                    screenwidth={card_style.minWidth}
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
        </motion.div>
  );
}
