import '@radix-ui/themes/styles.css';
import { Flex, Box, Card } from '@radix-ui/themes';
import {ChartCard} from './ChartCard';

export function ChartCol(){
    return(
    <Box position="absolute" left="0" >
        <Card size="3">
    
            <Flex gap="5"  align="center" direction="column" height="1000px">
          
                <Box width="350px" maxWidth="400px" height="400">
                    <Box>
                        <h1 className='text-center'>This is where you can see your countries data!</h1>
                    </Box>   
                </Box>
                <ChartCard />
                <ChartCard />
                <ChartCard />
                <ChartCard />
   
            </Flex>
        </Card>
  </Box>    
    );
}