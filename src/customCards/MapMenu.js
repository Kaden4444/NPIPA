import React from 'react';
import { Flex, Theme } from '@radix-ui/themes';
import SelectDemo from './Select';

const MapMenu = ({metricChangeCallback}) => (
    <Theme appearance='light'>
        <Flex style={{position:"fixed", right:'20.7%', bottom:'0%', zIndex : 10}}>
            <Flex width={"200px"} height={"160px"}>
                <SelectDemo handleMetricChange={metricChangeCallback}> </SelectDemo>
            </Flex>
        </Flex>
        </Theme>
);

export default MapMenu;
