import React, { useState } from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    panelDetails: {
      flexDirection: 'column',
    },
  }),
);

type MapList = {
  [key: string]: string,
}

type Props = {
  title: string;
  options: MapList;
  values: string[];
  handleChange: (value: string) => void;
  handleToggleAll: (value: boolean) => void;
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
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const allChecked = Object.keys(options).length === values.length;
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography className={classes.heading}>{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.panelDetails}>
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
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default SearchableList;
