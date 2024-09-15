import React, { useState, useEffect } from 'react';
import { Flex, Button, Card } from '@radix-ui/themes';
import {test} from '@m-lab/ndt7/src/ndt7'

function NetworkTest(){
    const [downloadSpeed, setDownloadSpeed] = useState("-");
    const [uploadSpeed, setUploadSpeed] = useState("-");
    const [runTest, setRunTest] = useState(false)
    useEffect(()=>{
        if(runTest){
            test(
                {
                    userAcceptedDataPolicy: true,
                    downloadworkerfile: "../src/ndt7-download-worker.js",
                    uploadworkerfile: "../src/ndt7-upload-worker.js",
                    metadata: {
                        client_name: 'ndt7-html-example',
                    },
                },
                {
                    serverChosen: function (server) {
                        console.log('Testing to:', {
                            machine: server.machine,
                            locations: server.location,
                        });
                    },
                    downloadMeasurement: function (data) {
                        if (data.Source === 'client') {
                            setDownloadSpeed(data.Data.MeanClientMbps.toFixed(1));
                        }
                    },
                    downloadComplete: function (data) {
                        // (bytes/second) * (bits/byte) / (megabits/bit) = Mbps
                        if(data.LastServerMeasurement){
                            const serverBw = data.LastServerMeasurement.BBRInfo.BW * 8 / 1000000;
                            const clientGoodput = data.LastClientMeasurement.MeanClientMbps;
                            setDownloadSpeed(clientGoodput.toFixed(1));
                        }
                    },
                    uploadMeasurement: function (data) {
                        if (data.Source === 'server') {
                            setUploadSpeed((data.Data.TCPInfo.BytesReceived / data.Data.TCPInfo.ElapsedTime * 8).toFixed(1));
                        }
                    },
                    uploadComplete: function(data) {
                        if(data.LastServerMeasurement){
                            const bytesReceived = data.LastServerMeasurement.TCPInfo.BytesReceived;
                            const elapsed = data.LastServerMeasurement.TCPInfo.ElapsedTime;
                            // bytes * bits/byte / microseconds = Mbps
                            const throughput =
                            bytesReceived * 8 / elapsed;
                            console.log(
                                `Upload test completed in ${(elapsed / 1000000).toFixed(1)}s
                Mean server throughput: ${throughput} Mbps`);
                        }
                    },
                    error: function (err) {
                        console.log('Error while running the test:', err.message);
                    },
                },
            ).then((exitcode) => {
                console.log("ndt7 test completed with exit code:", exitcode)
                setRunTest(false);
            });
        }
    },[runTest])
    return ( 
        <Flex style={{ height:'3.5rem', fontWeight:'bold' , fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Card style={{backgroundColor:'#373f3d', width:'20vw', height:'3.5rem', fontWeight:'bold' , fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center'}}>  
            <Flex> <img style={{marginRight:'5px', width:'20px', height:'20px', fill:'white'}} src='imgs/download.png'/> {downloadSpeed} mbps </Flex>
            <span style={{width:'20px'}}> </span>
            <Flex> <img style={{marginRight:'5px', width:'20px', height:'20px', fill:'#ceecee'}} src='imgs/upload.png'/> {uploadSpeed} mbps </Flex>
            </Card>
            <Flex style={{justifyContent:'center', alignContent:'center', marginLeft:'20px'}}> <Button onClick={()=>setRunTest(true)} disabled={runTest} color='violet'> Begin Test </Button></Flex>
        </Flex>
        )
}

export default NetworkTest