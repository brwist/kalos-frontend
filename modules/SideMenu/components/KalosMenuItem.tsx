import React, { FC } from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { MenuItem } from '../constants';
import './KalosMenuItem.module.less';

type Props = {
  item: MenuItem;
  userId: number;
  onClick?: () => void;
};

const KalosMenuItem: FC<Props> = ({
  item,
  userId,
  onClick,
}: Props): JSX.Element => {
  if (item.type === 'divider') {
    return <Divider />;
  }
  const children = (
    <>
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.title} />
    </>
  );
  return (
    <>
      {item.button ? (
        <ListItem
          className="KalosMenuItem"
          button
          onClick={item.onClick || onClick}
        >
          {children}
        </ListItem>
      ) : (
        <ListItem
          className="KalosMenuItem"
          button
          href={typeof item.href === 'function' ? item.href(userId) : item.href}
          component="a"
          target={item?.target}
        >
          {children}
        </ListItem>
      )}
    </>
  );
};

export default KalosMenuItem;
