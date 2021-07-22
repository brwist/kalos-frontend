import React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

interface props {
  title?: string;
  contents: { primary: string; secondary?: string }[];
}

interface state {}

export class TextList_DEPRECATED extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
  }
  render() {
    const { title, contents } = this.props;
    return (
      <div className="flex-col">
        {title && <Typography variant="h6">{title}</Typography>}
        <List>
          {contents.map(c => (
            <ListItem key={c.primary}>
              <ListItemText
                style={{ display: 'block' }}
                primary={c.primary}
                primaryTypographyProps={{ variant: 'subtitle1' }}
                secondary={c.secondary}
                secondaryTypographyProps={{ variant: 'body1' }}
                inset
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}
