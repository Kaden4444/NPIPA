import '@radix-ui/themes/styles.css';
import { useState } from 'react';
import { Flex, Box, Card, Button } from '@radix-ui/themes';
import { FilterCard } from './FilterCard'; // Ensure the path is correct

export function FilterCol({countryFilters, onCountryLockChange, filter_change_callback}) {
  const [cards, setCards] = useState([]);
  const [showColumn, setShowColumn] = useState(true);
  console.log(countryFilters)

  function onIspSelect(countryName, isp, id){
    console.log("selected" + isp + "for" + countryName + "for card" + id)
    // on_card_change_callback(countryName, isp, id)
    filter_change_callback(countryName,isp,id)
  }

  const purgeCards = () => {
    // Needs to be altered here to remove data from the cards
    setCards(cards.filter(card => !card.locked));
  };

  const toggleCardLock = (index) => {
    // Needs to instead update the shared countryFilter state
    onCountryLockChange(index, !countryFilters[index].locked)
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
        <Box
          style={{ width: '400px', zIndex: 20, transform: showColumn ? 'translateX(0)' : 'translateX(100%)', position: 'fixed',top: 0,right: 0,height: '100vh',overflow: 'auto',transitionProperty: 'transform',transitionDuration: '300ms',transitionTimingFunction: 'ease-in-out' }}>
          <Card size="3">
            <Flex gap="5" align="center" direction="column" >
              <Box width="350px" maxWidth="400px">
                  {/* You can add this back!}
                  {/* <Button
                    variant="outline"
                    size="1"
                    radius="full"
                    onClick={handleHideClick}
                    style={{position: 'absolute',left: 0,top: 0}}
                  >
                    Hide
                  </Button> */}

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
                <Button variant="soft" color='red' onClick={purgeCards}>Purge</Button>
              </Flex>
            </Flex>
          </Card>
        </Box>
      ) : (
        <Button variant="outline" size="1" radius="full" style={{position: 'fixed',top: 0,right: 0,zIndex: 30}} onClick={handleShowClick}>
          Show
        </Button>
      )}
    </>
  );
}
