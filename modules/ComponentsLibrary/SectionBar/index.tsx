import React, { FC, useCallback, CSSProperties, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import TablePagination from '@material-ui/core/TablePagination';
import { Button, Props as ButtonProps } from '../Button';

type Pagination = {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (page: number) => void;
};

type Styles = {
  collapsable?: boolean;
  collapsed?: boolean;
};

interface Props {
  title: string;
  buttons?: ButtonProps[];
  className?: string;
  pagination?: Pagination;
  styles?: CSSProperties;
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
  }),
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  title: ({ collapsable }: Styles) => ({
    display: 'flex',
    alignItems: 'center',
    cursor: collapsable ? 'pointer' : 'default',
    userSelect: 'none',
  }),
  toolbar: {
    minHeight: 0,
  },
}));

export const SectionBar: FC<Props> = ({
  title,
  buttons = [],
  className = '',
  pagination,
  styles,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const classes = useStyles({ collapsable: !!children, collapsed });
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
        {buttons.length > 0 && (
          <div>
            {buttons.map((props, idx) => (
              <Button key={idx} {...props} />
            ))}
          </div>
        )}
      </div>
      {!collapsed && children}
    </>
  );
};
