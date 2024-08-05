import '@radix-ui/themes/styles.css';
import { useState } from 'react';
import { Flex, Box, Card, Button,  } from '@radix-ui/themes';
import * as ScrollArea from '@radix-ui/react-scroll-area' ;
import { FilterCard } from './FilterCard'; // Ensure the path is correct


export function FilterCol({countryFilters, onCountryLockChange, filter_change_callback, purgeCards, loading}) {
  const [cards, setCards] = useState([]);
  
  const [showColumn, setShowColumn] = useState(true);

  function onIspSelect(countryName, isp, id){
    // on_card_change_callback(countryName, isp, id)
    filter_change_callback(countryName,isp,id)
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

  const handleHideClick = () => {
    setShowColumn(false);
  };

  const handleShowClick = () => {
    setShowColumn(true);
  };

  return (
    <>
      {showColumn ? (
        <Flex>
          <Card size="3">
            <Flex gap="5" align="center" direction="column" >
              <Box width="350px" maxWidth="400px">
                  
                   <Button
                    variant="outline"
                    size="1"
                    radius="full"
                    onClick={handleHideClick}
                    style={{position: 'absolute',right: 0,top: 0}}
                  >
                    Hide
                  </Button> 

                  <h1 style={{textAlign: 'center', fontSize:"20px"}} >
                    Your Countries
                  </h1> 
              </Box>
              

              {countryFilters.map((country, index) => (
                <FilterCard
                  key={index}
                  card_index={index}
                  CountryName={`${country.countryName}`}
                  isLocked={country.locked}
                  onToggleLock={() => toggleCardLock(index)}
                  onIspSelect={onIspSelect}
                />
              ))}


              <Flex gapX="3">
                <Button disabled={loading} variant="soft" color='red' onClick={onPurgeCards}>Purge</Button>
              </Flex>
            </Flex>
          </Card>



        </Flex>
      ) : (
        <Button  variant="solid" size="1" radius="full" style={{position: 'fixed',top: 0,right: 0,zIndex: 30}} onClick={handleShowClick}>
          Countries 
        </Button>
      )}
    </>
  );
}
