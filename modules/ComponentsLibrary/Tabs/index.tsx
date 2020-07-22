import React, { FC, useState, useCallback, ReactNode } from 'react';
import AppBar from '@material-ui/core/AppBar';
import TabsUI from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

interface Props {
  tabs: {
    label: string;
    content: ReactNode;
  }[];
  defaultOpenIdx?: number;
  onChange?: (idx: number) => void;
}

const a11yProps = (idx: number) => ({
  id: `scrollable-auto-tab-${idx}`,
  'aria-controls': `scrollable-auto-tabpanel-${idx}`,
});

export const Tabs: FC<Props> = ({ tabs, defaultOpenIdx = 0, onChange }) => {
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
  return (
    <div>
      <AppBar position="relative" color="default">
        <TabsUI
          value={tabIdx}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {tabs.map((props, idx) => (
            <Tab key={idx} {...props} {...a11yProps(0)} />
          ))}
        </TabsUI>
      </AppBar>
      {tabs[tabIdx].content}
    </div>
  );
};
