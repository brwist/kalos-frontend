import React, { FC, useState, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, Props as ButtonProps } from '../Button';

export type ActionsProps = (ButtonProps & {
  desktop?: boolean;
})[];

type Style = {
  responsiveColumn?: boolean;
};

interface Props extends Style {
  fixed?: boolean;
  actions: ActionsProps;
  className?: string;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexShrink: 0,
  },
  burger: {
    cursor: 'pointer',
  },
  actions: ({ responsiveColumn }: Style) => ({
    display: 'flex',
    [theme.breakpoints.down('sm')]: responsiveColumn
      ? {
          flexDirection: 'column',
        }
      : {},
  }),
  button: ({ responsiveColumn }: Style) =>
    responsiveColumn ? { marginTop: 0 } : {},
}));

export const Actions: FC<Props> = ({
  fixed = false,
  actions,
  className,
  responsiveColumn = false,
}) => {
  const classes = useStyles({ responsiveColumn });
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null,
  );
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const handleSetAnchorEl = useCallback(
    (anchorEl: (EventTarget & HTMLElement) | null) => () =>
      setAnchorEl(anchorEl),
    [setAnchorEl],
  );
  if (matches && !fixed)
    return (
      <>
        <span
          className={classes.burger}
          onClick={({ currentTarget }: React.MouseEvent<HTMLElement>) =>
            handleSetAnchorEl(currentTarget)()
          }
        >
          <MenuIcon />
        </span>
        <Menu
          id="customized-menu"
          keepMounted
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSetAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          getContentAnchorEl={null}
        >
          {actions.length > 0 && (
            <div>
              {actions
                .filter(
                  ({ desktop }) => desktop === undefined || desktop === false,
                )
                .map(
                  (
                    { label, onClick, url, desktop, className, ...props },
                    idx,
                  ) => (
                    <MenuItem
                      key={idx}
                      {...props}
                      dense
                      onClick={event => {
                        handleSetAnchorEl(null)();
                        if (onClick) {
                          onClick(event);
                        }
                        if (url) {
                          document.location.href = url;
                        }
                      }}
                    >
                      {label}
                    </MenuItem>
                  ),
                )}
            </div>
          )}
        </Menu>
      </>
    );
  return (
    <div className={className + ' ' + classes.wrapper}>
      {actions.length > 0 && (
        <div className={classes.actions}>
          {actions
            .filter(({ desktop }) => desktop === undefined || desktop === true)
            .map(({ desktop, ...props }, idx) => (
              <Button key={idx} {...props} className={classes.button} />
            ))}
        </div>
      )}
    </div>
  );
};
