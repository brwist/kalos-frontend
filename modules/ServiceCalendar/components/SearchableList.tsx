import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

type MapList = {
  [key: string]: string,
}

type Props = {
  title: string;
  options: MapList;
  values: string[];
  handleChange: (value: string) => void;
  handleToggleAll?: (value: boolean) => void;
  noSearch?: boolean;
  loading?: boolean;
}

const SearchableList = ({
  title,
  options,
  values,
  handleChange,
  handleToggleAll,
  noSearch,
  loading,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const allChecked = Object.keys(options).length === values.length;
  return (
    <>
      {!noSearch && (
        <TextField label="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      )}
      <List>
        {!noSearch && (
          <ListItem dense button onClick={() => handleToggleAll(!allChecked)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={allChecked}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={`All ${title}`} />
          </ListItem>
        )}
        {Object.entries(options).map(([id, name]) => {
          if (!searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return (
              <ListItem key={`title-${id}`} dense button onClick={() => handleChange(id)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={values.indexOf(id) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            );
          }
          return null;
        })}
      </List>
    </>
  );
};

export default SearchableList;
