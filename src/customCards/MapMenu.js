import React from 'react';
import * as Select from '@radix-ui/react-select';
import { Flex, Box, Card, IconButton, Tooltip } from '@radix-ui/themes';
import { MagnifyingGlassIcon, BarChartIcon, QuestionMarkIcon  } from '@radix-ui/react-icons';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import Draggable from 'react-draggable';
import SelectDemo from './Select';

const MapMenu = ({metricChangeCallback}) => (
        <Flex style={{position:"fixed", left:'60%', top:'3%', zIndex : 10}}>
            <Flex width={"200px"} height={"160px"}>
                <SelectDemo handleMetricChange={metricChangeCallback}> </SelectDemo>
            </Flex>
        </Flex>
);

export default MapMenu;
