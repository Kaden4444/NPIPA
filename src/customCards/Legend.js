import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Flex, Box, Card } from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog';

function Legend() {
    return (
        <Card size={3} style={{position:'absolute', left:'485px', bottom:'2px', fontStyle:'italic', fontSize:'12px', height:'100px', display:'flex', alignItems:'center'}}>
            <Flex direction="column" >
                <Flex direction="row" style={{alignItems:'center', paddingRight:'10px'}} >
                    <Box style={{borderRadius:'10px', backgroundColor:"#FF6F6F", width:'15px', height:'15px'}}> </Box>
                    <span style={{marginLeft:'5px'}}> 1-5 mbps </span>
                    
                </Flex>
                <Flex direction="row" style={{alignItems:'center', paddingRight:'10px'}} >
                    <Box style={{borderRadius:'10px', backgroundColor:"#FF9A5B", width:'15px', height:'15px'}}> </Box>
                    <span style={{marginLeft:'5px'}}> 5-10 mbps </span>
                </Flex>
                <Flex direction="row" style={{alignItems:'center', paddingRight:'10px'}} >
                    <Box style={{borderRadius:'10px', backgroundColor:"#F9F93F", width:'15px', height:'15px'}}> </Box>
                    <span style={{marginLeft:'5px'}}>10-20 mbps </span>
                </Flex>
                <Flex direction="row" style={{alignItems:'center', paddingRight:'10px'}} >
                    <Box style={{borderRadius:'10px', backgroundColor:"#9CFE9F", width:'15px', height:'15px'}}> </Box>
                    <span style={{marginLeft:'5px'}}> 20-50 mbps</span>
                    
                </Flex>
                <Flex direction="row" style={{alignItems:'center', paddingRight:'10px'}} >
                    <Box style={{borderRadius:'10px', backgroundColor:"#66C466", width:'15px', height:'15px'}}> </Box>
                    <span style={{marginLeft:'5px'}}>50-100 mbps</span>
                </Flex>
            </Flex>
        </Card>
    )
}
export default Legend