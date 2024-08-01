import '@radix-ui/themes/styles.css';
import { useState } from 'react';
import { Flex, Box, Card, Button } from '@radix-ui/themes';
import { FilterCard } from './FilterCard'; // Ensure the path is correct

export function FilterCol() {
  const [cards, setCards] = useState([]);
  const [showColumn, setShowColumn] = useState(true);

  const addCard = () => {
    const nextNumber = cards.length > 0 ? Math.max(...cards.map(c => c.number)) + 1 : 1;
    setCards([...cards, { number: nextNumber, locked: true }]);
  };

  const purgeCards = () => {
    setCards(cards.filter(card => !card.locked));
  };

  const toggleCardLock = (index) => {
    setCards(cards.map((card, i) => 
      i === index ? { ...card, locked: !card.locked } : card
    ));
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
                  <Button
                    variant="outline"
                    size="1"
                    radius="full"
                    onClick={handleHideClick}
                    style={{position: 'absolute',left: 0,top: 0}}
                  >
                    Hide
                  </Button>
                  <h1 style={{textAlign: 'center', fontSize:"20px"}} >
                    This is where you can see your filters!
                  </h1> 
              </Box>
              {cards.map((card, index) => (
                <FilterCard
                  key={index}
                  CountryName={`Country ${card.number}`}
                  isLocked={card.locked}
                  onToggleLock={() => toggleCardLock(index)}
                />
              ))}
              <Flex gapX="3">
                <Button variant="outline" onClick={addCard}>Add a new country</Button>
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
