import React, { FC, useState, useCallback } from 'react';
import clsx from 'clsx';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, Props as ButtonProps } from '../Button';
import './Actions.module.less';

export type ActionsProps = (ButtonProps & {
  desktop?: boolean;
  burgeronly?: number; // Number as a workaround to a bug involving spreads
  // Read more here: https://stackoverflow.com/a/49786272
  fixed?: boolean;
})[];

type Style = {
  responsiveColumn?: boolean;
};

interface Props extends Style {
  fixed?: boolean;
  actions: ActionsProps;
  className?: string;
  disabled?: boolean;
  onClickAction?: (
    actionClicked: ButtonProps & {
      desktop?: boolean;
      burgeronly?: number; // Number as a workaround to a bug involving spreads
      // Read more here: https://stackoverflow.com/a/49786272
      fixed?: boolean;
    },
  ) => any;
}

export const Actions: FC<Props> = ({
  fixed = false,
  actions,
  className,
  responsiveColumn = false,
  disabled,
  onClickAction,
}) => {
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
  let burgerOnly = false;
  actions.forEach(action => {
    if (action.burgeronly == 1) burgerOnly = true;
    if (action.fixed) fixed = true;
  });
  if (burgerOnly || (matches && !fixed))
    return (
      <>
        <span
          className="ActionsBurger"
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
                    {
                      label,
                      onClick,
                      url,
                      desktop,
                      className,
                      compact,
                      ...props
                    },
                    idx,
                  ) => (
                    <MenuItem
                      key={idx}
                      {...props}
                      dense
                      onClick={event => {
                        if (onClickAction) onClickAction(actions[idx]);
                        handleSetAnchorEl(null)();
                        if (onClick) {
                          onClick(event);
                        }
                        if (url) {
                          window.open(url, '_blank');
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
  // console.log({ actions });
  return (
    <div className={clsx('Actions', className)}>
      {actions.length > 0 && (
        <div className={clsx('ActionsActions', { responsiveColumn })}>
          {actions
            .filter(({ desktop }) => desktop === undefined || desktop === true)
            .map(({ desktop, onClick, ...props }, idx) => (
              <Button
                key={idx}
                onClick={(e: any) => {
                  if (onClickAction) onClickAction(actions[idx]);
                  if (onClick) onClick(e);
                }}
                {...props}
                className={clsx('ActionsButton', { responsiveColumn })}
                disabled={disabled || props.disabled}
              />
            ))}
        </div>
      )}
    </div>
  );
};
