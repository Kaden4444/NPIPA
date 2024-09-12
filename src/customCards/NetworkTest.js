import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Flex, Box, Card } from '@radix-ui/themes';
import {test} from '@m-lab/ndt7/src/ndt7'
function NetworkTest(){
    const [downloadSpeed, setDownloadSpeed] = useState("-");
    const [uploadSpeed, setUploadSpeed] = useState("-");

    useEffect(()=>{
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
                        setDownloadSpeed(data.Data.MeanClientMbps.toFixed(2));
                    }
                },
                downloadComplete: function (data) {
                    // (bytes/second) * (bits/byte) / (megabits/bit) = Mbps
                    const serverBw = data.LastServerMeasurement.BBRInfo.BW * 8 / 1000000;
                    const clientGoodput = data.LastClientMeasurement.MeanClientMbps;
                    console.log(
                        `Download test is complete:
    Instantaneous server bottleneck bandwidth estimate: ${serverBw} Mbps
    Mean client goodput: ${clientGoodput} Mbps`);
                    setDownloadSpeed(clientGoodput.toFixed(2));
                },
                uploadMeasurement: function (data) {
                    if (data.Source === 'server') {
                        setUploadSpeed((data.Data.TCPInfo.BytesReceived / data.Data.TCPInfo.ElapsedTime * 8).toFixed(2));
                    }
                },
                uploadComplete: function(data) {
                    const bytesReceived = data.LastServerMeasurement.TCPInfo.BytesReceived;
                    const elapsed = data.LastServerMeasurement.TCPInfo.ElapsedTime;
                    // bytes * bits/byte / microseconds = Mbps
                    const throughput =
                    bytesReceived * 8 / elapsed;
                    console.log(
                        `Upload test completed in ${(elapsed / 1000000).toFixed(2)}s
        Mean server throughput: ${throughput} Mbps`);
                },
                error: function (err) {
                    console.log('Error while running the test:', err.message);
                },
            },
        ).then((exitcode) => {
            console.log("ndt7 test completed with exit code:", exitcode)
        });
    },[])
    return ( 
        <Card style={{position:'absolute', left:'100px', top:'200px', fontWeight:'bold' , fontSize:'14px', height:'22px', display:'flex', alignItems:'center'}}> 
            <Flex> <img style={{width:'20px'}} src='imgs/download.svg'/> Download: {downloadSpeed} mbps </Flex>
            <Flex> <img style={{width:'20px'}} src='imgs/upload.svg'/>  Upload: {uploadSpeed} mbps </Flex>
        </Card>)
}

export default NetworkTest