import React, { FC, useCallback, CSSProperties, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import TablePagination from '@material-ui/core/TablePagination';
import { Props as ButtonProps } from '../Button';
import { Actions, ActionsProps } from '../Actions';

type Pagination = {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (page: number) => void;
};

type Styles = {
  collapsable?: boolean;
  collapsed?: boolean;
  fixedActions?: boolean;
};

interface Props {
  title: string;
  actions?: ActionsProps;
  className?: string;
  pagination?: Pagination;
  styles?: CSSProperties;
  fixedActions?: boolean;
}

const useStyles = makeStyles(theme => ({
  wrapper: ({ collapsable, collapsed }: Styles) => ({
    backgroundColor: theme.palette.grey[300],
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 46,
    boxSizing: 'border-box',
    marginBottom: collapsable && collapsed ? theme.spacing() : 0,
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      minHeight: 0,
    },
  }),
  header: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  title: ({ collapsable, fixedActions }: Styles) => ({
    display: fixedActions ? 'block' : 'flex',
    alignItems: 'center',
    cursor: collapsable ? 'pointer' : 'default',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
    },
  }),
  toolbar: {
    minHeight: 0,
  },
}));

export const SectionBar: FC<Props> = ({
  title,
  actions = [],
  className = '',
  pagination,
  styles,
  fixedActions = false,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const classes = useStyles({
    collapsable: !!children,
    collapsed,
    fixedActions,
  });
  const handleToggleCollapsed = useCallback(() => setCollapsed(!collapsed), [
    collapsed,
    setCollapsed,
  ]);
  const handleChangePage = useCallback(
    (_, page) => {
      if (pagination) {
        pagination.onChangePage(page);
      }
    },
    [pagination],
  );
  return (
    <>
      <div className={className + ' ' + classes.wrapper} style={styles}>
        <div className={classes.header}>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={handleToggleCollapsed}
          >
            {title}{' '}
            {children && (collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
          </Typography>
          {pagination && pagination.count > 0 && !collapsed && (
            <TablePagination
              classes={{ toolbar: classes.toolbar }}
              component="div"
              rowsPerPageOptions={[]}
              {...pagination}
              onChangePage={handleChangePage}
              backIconButtonProps={{ size: 'small' }}
              nextIconButtonProps={{ size: 'small' }}
            />
          )}
        </div>
        {actions.length > 0 && (
          <Actions actions={actions} fixed={fixedActions} />
        )}
      </div>
      {!collapsed && children}
    </>
  );
};
