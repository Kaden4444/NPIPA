import { Card, Inset, Flex, ScrollArea} from "@radix-ui/themes";
import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import Draggable from "react-draggable";
import {Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@radix-ui/themes';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, Cross1Icon} from '@radix-ui/react-icons';
import iso_region_map from '../json/iso_to_region_name.json'
const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item className={classnames('SelectItem', className)} {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  });

function  Leaderboard({hide, data, Type}){
    const [selectedValue, setSelectedValue] = useState("Download Speed")
    const [lb_data, setLBData] = useState([])
    useEffect(()=>{
        if(selectedValue === "Download Speed"){
            const deepCopy = JSON.parse(JSON.stringify(data))
            deepCopy.sort((a, b) => b.download_speed - a.download_speed)
            setLBData(deepCopy)
        }
        else if(selectedValue === "Upload Speed"){
            const deepCopy = JSON.parse(JSON.stringify(data))
            deepCopy.sort((a, b) => b.upload_speed - a.upload_speed)
            setLBData(deepCopy)
        }
        else{
            console.error("Invalid selection");
        }

    },[selectedValue, data])


    function onSelectChange(metric){
        setSelectedValue(metric);
    }
    return(
        <Card
  size={3}
  variant='classic'
  content='center'
  style={{
    position: 'fixed',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, 0)',
    height: '50vh',
    width: '25vw', // Use viewport width for better responsiveness
    overflowY: 'auto', // Enable vertical scrolling
    padding: '20px', // Adjust padding for better spacing
    border: '1px solid #ccc',
    borderRadius: '8px', // Add rounded corners for a softer look
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add subtle shadow for depth
    backgroundColor: '#fff', // Ensure background color contrasts with content
  }}
>       <Flex>
            <Select.Root onValueChange={onSelectChange} defaultValue='Download Speed'>
                <Select.Trigger className="SelectTrigger" aria-label="Metrics">
                <Select.Value placeholder="Change Map Metrics" />
                <Select.Icon className="SelectIcon">
                    <ChevronDownIcon />
                </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                <Select.Content className="SelectContent">
                    <Select.ScrollUpButton className="SelectScrollButton">
                    <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="SelectViewport">
                    <Select.Group>
                        <SelectItem value="Download Speed">Download Speed</SelectItem>
                        <SelectItem value="Upload Speed">Upload Speed</SelectItem>
                    </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton className="SelectScrollButton">
                    <ChevronDownIcon />
                    </Select.ScrollDownButton>
                </Select.Content>
                </Select.Portal>
            </Select.Root>
            <Button style={{position:'absolute', left:'90%'}}variant="soft" onClick={hide} color='purple' size={'1'}><Cross1Icon/></Button>
        </Flex>
        <Table.Root>
        <Table.Header>
            <Table.Row>
            <Table.ColumnHeaderCell>{Type} Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{selectedValue}</Table.ColumnHeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body >
            {lb_data.map((entry, index) => (
            (Type!=="REGION" || entry.iso in iso_region_map) && (Type!=="ISP" || entry.isp_name) ?
            <Table.Row key={index}>
                <Table.RowHeaderCell>
                    <Flex style={{width:'100%'}}>
                    {`${index+1}) `} 
                    {(Type === "ISP" ? entry.isp_name : iso_region_map[entry.iso])}
                    {index === 0 && <img src="imgs/gold.png" style={{
                    maxHeight: '35px',
                    marginRight:'10px'
                    }}/>}
                    </Flex>
                </Table.RowHeaderCell>
                <Table.Cell> {selectedValue==="Download Speed"?entry.download_speed.toFixed(2):entry.upload_speed.toFixed(2)} mbps </Table.Cell>
            </Table.Row> : ''
            ))}
        </Table.Body>
        </Table.Root>

</Card>
    )
}
export default Leaderboard;