import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

type Style = {
  tag?: 'div' | 'h1';
};

interface Props extends Style {
  align?: 'left' | 'center' | 'right';
}

const useStyles = makeStyles(theme => ({
  wrapper: ({ tag }: Style) => ({
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: tag === 'h1' ? 18 : 10,
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
    fontWeight: tag === 'h1' ? 900 : 400,
  }),
}));

export const PrintParagraph: FC<Props> = ({
  tag = 'div',
  align = 'left',
  children,
}) => {
  const classes = useStyles({ tag });
  return (
    <p className={classes.wrapper} style={{ textAlign: align }}>
      {children}
    </p>
  );
};
