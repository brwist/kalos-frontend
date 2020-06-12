import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

type Tag = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

type Style = {
  tag?: Tag;
};

interface Props extends Style {
  align?: 'left' | 'center' | 'right';
}

const getFontSizeByTag = (tag: Tag) =>
  ({
    div: 10,
    h1: 18,
    h2: 16,
    h3: 14,
    h4: 12,
    h5: 10,
  }[tag]);

const useStyles = makeStyles(theme => ({
  wrapper: ({ tag }: Style) => ({
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: getFontSizeByTag(tag!),
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
    fontWeight: tag !== 'div' ? 900 : 400,
  }),
}));

export const PrintParagraph: FC<Props> = ({
  tag = 'div',
  align = 'left',
  children,
}) => {
  const classes = useStyles({ tag });
  return (
    <div className={classes.wrapper} style={{ textAlign: align }}>
      {children}
    </div>
  );
};
