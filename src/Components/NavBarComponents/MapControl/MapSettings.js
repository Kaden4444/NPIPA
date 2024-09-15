import { Flex, Card, Button } from '@radix-ui/themes';
import Legend from './Legend'
import MapMenu from './MapMenu';
import { Cross1Icon } from '@radix-ui/react-icons';

function MapSettings({metricChangeCallback, closeCallback}){
    return (
        <Card
  size={3}
  variant='classic'
  content='center'
  style={{
    position: 'fixed',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, 0)',
    height: '250px',
    width: '200px', // Use viewport width for better responsiveness
    overflowY: 'auto', // Enable vertical scrolling
    padding: '20px', // Adjust padding for better spacing
    border: '1px solid #ccc',
    borderRadius: '16px', // Add rounded corners for a softer look
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add subtle shadow for depth
    backgroundColor: '#000', // Ensure background color contrasts with content
  }}
>       <Flex gapX = "2" style={{alignContent:'center', justifyContent:'center', fontWeight:'bold', marginBottom:'20px', marginRight:"10px"}}>
           Map Settings: 
           <Button variant="soft" color='purple' size={'1'} onClick={closeCallback} style={{justifySelf:"end"}}><Cross1Icon/></Button> 
        </Flex>
        <Flex style={{alignContent:'center', justifyContent:'center', fontWeight:'bold', marginBottom:'20px'}}>
                <MapMenu metricChangeCallback={metricChangeCallback}/>
        </Flex>
        <Legend/>
    </Card>

    )
}

export default MapSettings;