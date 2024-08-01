import '@radix-ui/themes/styles.css';
import { Flex, Box, Card, Inset } from '@radix-ui/themes';
import { ChartView } from './chartView.js';

export function ChartCard(){
    return(
<Box width="350px" maxWidth="400px" height="400">
      <Card size="3">
        <Box>
        <Inset clip="padding-box" side="top" pb="current">
            <ChartView/>
        </Inset>
          
        </Box>
        </Card>
        </Box>
    );
}

