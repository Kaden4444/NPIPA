import React from 'react';
import { Flex, Theme } from '@radix-ui/themes';
import SelectDemo from './Select';

const MapMenu = ({metricChangeCallback}) => {
    const windowSize = window.innerWidth;
    const right = (3/703)*windowSize + 12.506;
    console.log(right)
    const Style = {
        position:"fixed", right:right+'%', bottom:'0%', zIndex : 10
    }
    return(
    <Theme appearance='light'>
        <Flex style={Style}>
            <Flex width={"200px"} height={"160px"}>
                <SelectDemo handleMetricChange={metricChangeCallback}> </SelectDemo>
            </Flex>
        </Flex>
        </Theme>
    )
};

export default MapMenu;
