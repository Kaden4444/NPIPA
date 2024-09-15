import React from 'react';
import { Flex, Theme } from '@radix-ui/themes';
import SelectDemo from './Select';

const MapMenu = ({metricChangeCallback, closeCallback}) => {
    const windowSize = window.innerWidth;
    const right = (3/703)*windowSize + 12.506;
    console.log(right)
    const Style = {
        zIndex : 10,
    }
    return(
    <Theme appearance='dark'>
        <Flex style={Style}>
            <SelectDemo handleMetricChange={metricChangeCallback}> </SelectDemo>
        </Flex>
        </Theme>
    )
};

export default MapMenu;
