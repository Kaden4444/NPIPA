import { Flex, Card, IconButton, Tooltip } from '@radix-ui/themes';
import { MagnifyingGlassIcon, BarChartIcon, QuestionMarkIcon  } from '@radix-ui/react-icons';
import { FaE, FaEarthAfrica } from "react-icons/fa6";
import Draggable from 'react-draggable';

function ComponentBar({ showChartCol, toggleChartCol, showFilterCol, toggleFilterCol, showHelp, toggleShowHelp}) {
    return(
        <Draggable>
            
            <Flex width={"160px"} height={"50px"}>
                <Card size={2} align="center" variant='classic' >
                    <Flex direction={"row"} gapX={"1"} align="center" >

                        <Tooltip content="Selected Countries">
                        <IconButton onClick={toggleFilterCol} variant={showFilterCol ? "solid" : "outline"}  radius='full'><FaEarthAfrica width="18" height="18" /></IconButton>
                        </Tooltip>

                        <Tooltip content="Connectivity Data">
                        <IconButton onClick={toggleChartCol} variant={showChartCol ? "solid" : "outline"}  radius='full'><BarChartIcon width="18" height="18" /></IconButton>
                        </Tooltip>

                        <Tooltip content="Help">
                        <IconButton onClick={toggleShowHelp} variant={showHelp ? "solid" : "outline"}  radius='full'><QuestionMarkIcon width="18" height="18" /></IconButton>
                        </Tooltip>

                    </Flex>
                </Card>
            </Flex>
            
            </Draggable>
    )
    
    
}

export default ComponentBar