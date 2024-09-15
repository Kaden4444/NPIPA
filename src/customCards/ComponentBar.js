import { Flex, Card, IconButton, Tooltip } from '@radix-ui/themes';
import { BarChartIcon, QuestionMarkIcon  } from '@radix-ui/react-icons';
import { FaEarthAfrica } from "react-icons/fa6";

import { FaMapMarkerAlt } from 'react-icons/fa';

function ComponentBar({ showChartCol, toggleChartCol, showFilterCol, toggleFilterCol, showHelp, toggleShowHelp, showMapSettings, toggleShowMapSettings}) {
    return(
            
        <Flex as="componentCard" padding="1rem" align ="center" style={{height: '5rem', position: "relative" }} >
                 <Card size={2} align="center" variant='classic' >
                   <Flex direction={"row"} gapX={"0.5rem"} align="center"> {/* Using rem for gap */}
                    
                     <Tooltip content="Connectivity Data">
                       <IconButton onClick={toggleChartCol} variant={showChartCol ? "solid" : "outline"} radius='full'>
                         <BarChartIcon width="18" height="18" />
                       </IconButton>
                     </Tooltip>

                     <Tooltip content="Map Settings">
                       <IconButton onClick={toggleShowMapSettings} variant={showMapSettings ? "solid" : "outline"} radius='full'>
                         <FaMapMarkerAlt width="18" height="18" />
                       </IconButton>
                     </Tooltip>

                     <Tooltip content="Selected Countries">
                       <IconButton onClick={toggleFilterCol} variant={showFilterCol ? "solid" : "outline"} radius='full'>
                         <FaEarthAfrica width="18" height="18" />
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

    )
    
    
}

export default ComponentBar