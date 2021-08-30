import React, { FC, useState, useCallback, ReactNode } from 'react';
import AppBar from '@material-ui/core/AppBar';
import TabsUI from '@material-ui/core/Tabs';

import Tab from '@material-ui/core/Tab';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface Props {
  vertical?: boolean;
  tabs: {
    label: string;
    content: ReactNode;
  }[];
  tabStyle?: React.CSSProperties;
  defaultOpenIdx?: number;
  onChange?: (idx: number) => void;
}

const a11yProps = (idx: number) => ({
  id: `scrollable-auto-tab-${idx}`,
  'aria-controls': `scrollable-auto-tabpanel-${idx}`,
});

export const VerticalTabs: FC<Props> = ({
  tabs,
  defaultOpenIdx = 0,
  onChange,
  vertical,
}) => {
  const [tabIdx, setTabIdx] = useState<number>(defaultOpenIdx);
  const handleChange = useCallback(
    (_, newValue: number) => {
      setTabIdx(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [setTabIdx, onChange],
  );
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      height: 224,
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  }));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TabsUI
        value={tabIdx}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        orientation={vertical === undefined ? 'horizontal' : 'vertical'}
        scrollButtons="auto"
        className={classes.tabs}
        aria-label="scrollable auto tabs example"
      >
        {tabs.map((props, idx) => (
          <Tab key={idx} {...props} {...a11yProps(0)} />
        ))}
      </TabsUI>
      {tabs[tabIdx].content}
    </div>
  );
};
