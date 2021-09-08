import React, { FC, useState, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import { SectionBar } from '../SectionBar';
import { LoremIpsumList } from '../helpers';
import { PopoverComponent } from './';

type Props = {
  button: string;
  compact?: boolean;
  fullScreen?: boolean;
  fullHeight?: boolean;
};

const PopoverExample: FC<Props> = ({
  button,
  fullScreen = false,
  fullHeight = false,
}) => {
  const anchorEl = React.createRef<HTMLDivElement>();

  return (
    <div ref={anchorEl}>
      <PopoverComponent
        buttonLabel="Press to see testing stuff"
        stringList={['Testing stuff', 'Testing other stuff']}
      />
    </div>
  );
};

export default () => (
  <>
    <PopoverExample button="Modal">
      <LoremIpsumList />
    </PopoverExample>
    <PopoverExample button="Compact Modal" compact>
      <Typography>Lorem ipsum dolor sit amet</Typography>
    </PopoverExample>
    <PopoverExample button="Full Screen Modal" fullScreen>
      {Array.from(Array(10)).map((_, idx) => (
        <LoremIpsumList key={idx} />
      ))}
    </PopoverExample>
    <PopoverExample button="Open Popover" fullHeight>
      <LoremIpsumList />
    </PopoverExample>
  </>
);
