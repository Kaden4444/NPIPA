import { Card, Inset, Flex, ScrollArea} from "@radix-ui/themes";
import Draggable from "react-draggable";

function  Help(){
    return(
        <Draggable>
            <Card size={3} variant='classic' content='center' style={{ height:"50vh", width:"40vh", position:"fixed", padding: '25px', borderRight: '1px solid #ccc', right: "50%", left:"50%", top: "30%"}} >
                <Flex  direction={"column"} gap={"2"} > 

                    <title>Welcome to NPIP!</title>
                    <Inset clip="border-box" side="top" pb="current">
                        <img src="../imgs/Select.png" alt="Select" style={{display: 'flex', objectFit: 'contain', width: '100%', height: "100%", backgroundColor: 'var(--gray-5)'}}/>
                        <h1>Select your country on the map!</h1>
                    </Inset>
                    
                    <Inset clip="padding-box" side="top" pb="current">
                        <img src="../imgs/Country.png" alt="Filter" style={{display: 'flex', objectFit: 'cover', width: '100%', height: "100%", backgroundColor: 'var(--gray-5)'}}/>
                        <h1>See your selections on the right!</h1>
                    </Inset>

                    <Inset clip="padding-box" side="top" pb="current">
                        <img src="../imgs/Chart.png" alt="Chart" style={{display: 'flex', objectFit: 'cover', width: '100%', height: "100%", backgroundColor: 'var(--gray-5)'}}/>
                        <h1>See their data on the left!</h1>
                    </Inset>
                </Flex>
            </Card>

        </Draggable>
        
    )
}

export default Help;