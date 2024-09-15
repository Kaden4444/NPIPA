import React from 'react';
import { Card, Text, Link, Flex, ScrollArea } from '@radix-ui/themes';

function Help() {
  return (
    <Card
      size={3}
      variant='classic'
      style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        height: '75vh',
        width: '25vw',
        overflow: 'hidden', // Prevents the Card from showing scrollbars
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#18191b'
      }}
    >
      <ScrollArea
        style={{
          height: '100%', // Ensure ScrollArea fills the Card
          width: '100%',
        }}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={{ height: '100%', overflowY: 'auto' }}
        >
          {/* Welcome message */}
          <Text as="h1" size="7" weight="bold" style={{ marginBottom: '20px' }}>
            Welcome to NPIPA
          </Text>

          {/* Web app description */}
          <Text as="p" size="5" style={{ textAlign: 'center', marginBottom: '40px' }}>
            This website allows you to see African country's connectivity data.
          </Text>

          {/* Features section */}
          <Flex direction="column" align="start" style={{ textAlign: 'left', marginBottom: '40px' }}>
            <Text as="h2" size="6" weight="medium" style={{ color: '#3498db' }}>
              Usage:
            </Text>

            <Text as="p" size="4" style={{ marginTop: '10px' }}>
              <strong>0.</strong> Left click to zoom into a country.
            </Text>

            <Text as="p" size="4" style={{ marginTop: '10px' }}>
              <strong>1.</strong> Right click a country/region and click "Add to Comparison", or search for a country in the search bar. Alternatively, you can view a country/regions rankings, based on the metric of your choice.
            </Text>
            
            <Text as="p" size="4" style={{ marginTop: '10px' }}>
              <strong>2.</strong> Your selection will appear in the Countries column, along with your selections data in the Graphs column. These graphs can be expanded and downloaded as pngs.
            </Text>

            <Text as="p" size="4" style={{ marginTop: '10px' }}>
              <strong>3.</strong> Repeat these 2 steps to compare different countries. You can change each country's region and ISP using the cards on the right.
            </Text>

            <Text as="h2" size="6" weight="medium" style={{ marginTop: '40px', color: '#3498db' }}>
              Metrics:
            </Text>
            
            <Text as="p" size="4" style={{ marginTop: '10px' }}>
              <strong>Download Speed:</strong> The rate at which data is received from the internet to your device, typically measured in megabits per second (Mbps).
            </Text>

            <Text as="p" size="4" style={{ marginTop: '10px' }}>
              <strong>Upload Speed:</strong> The rate at which data is sent from your device to the internet, also measured in megabits per second (Mbps).
            </Text>
            
            <Text as="p" size="4" style={{ marginTop: '10px' }}>
              <strong>Latency:</strong> The time it takes for data to travel from your device to its destination and back, often measured in milliseconds (ms).
            </Text>

            <Text as="p" size="4" style={{ marginTop: '10px' }}>
              <strong>Throughput:</strong> The actual rate of successful data transfer across a network, considering factors like network congestion and errors, measured in megabits per second (Mbps).
            </Text>

            <Text as="p" size="4" style={{ marginTop: '10px' }}>
              <strong>Note:</strong> You can run a speed test in the top left to see how your connection compares!
            </Text>

          </Flex>

          {/* Contributors section */}
          <Flex direction="column" align="center" style={{ marginTop: '20px' }}>
            <Text as="h2" size="6" weight="medium" style={{ color: '#3498db', marginBottom: '10px' }}>
              Developers:
            </Text>
            <Flex direction="column" gap="2">
              <Link href="https://github.com/Kaden4444" target="_blank" rel="noopener noreferrer">
                Kaden Carey
              </Link>
              <Link href="https://github.com/person2" target="_blank" rel="noopener noreferrer">
                Cade Sayner
              </Link>
              <Link href="https://github.com/person3" target="_blank" rel="noopener noreferrer" style={{ marginBottom: "40px" }}>
                Mujaahid Salie
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </ScrollArea>
    </Card>
  );
}

export default Help;
