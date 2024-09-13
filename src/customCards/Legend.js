import React, { useState, useEffect } from 'react';
import { Flex, Box, Card } from '@radix-ui/themes';
import SelectDemo from './Select';

function Legend({}) {
    return (
        <Card size={3} style={{borderRadius:'5px', outline:'1px solid white', fontStyle:'italic', width:'120px', fontSize:'12px', marginLeft:'20px', height:'100px', display:'flex', alignItems:'center'}}>
            <Flex direction="column" >
                <Flex direction="row" style={{alignItems:'center', paddingRight:'10px'}} >
                    <Box style={{borderRadius:'10px', backgroundColor:"#FF6F6F", width:'15px', height:'15px'}}> </Box>
                    <span style={{marginLeft:'5px'}}> {'<'}5 mbps </span>
                    
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
                    <span style={{marginLeft:'5px'}}>{'>'}50 mbps</span>
                </Flex>
            </Flex>
        </Card>
    )
}
export default Legend