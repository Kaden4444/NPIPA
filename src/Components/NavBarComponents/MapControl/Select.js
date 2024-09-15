
import React from 'react';
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import '../../../index.css';



const SelectDemo = ({handleMetricChange}) => (
  // Handler function to update the selected value

  <Select.Root onValueChange={handleMetricChange} defaultValue='average' >
    <Select.Trigger className="SelectTrigger" aria-label="Metrics" color='black'>
      <Select.Value placeholder="Metrics" color='black' />
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content color='black' className="SelectContent">
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">
          <Select.Group>
            <SelectItem value="download" color='black'>Download Speed</SelectItem>
            <SelectItem value="upload" color='black'>Upload Speed</SelectItem>
            <SelectItem value="average" color='black'>Average</SelectItem>
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="SelectScrollButton">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root >

);

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

export default SelectDemo;
