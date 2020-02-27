import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import { Button, Props as ButtonProps } from '../Button';

type Pagination = {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (page: number) => void;
};

interface Props {
  title: string;
  buttons?: ButtonProps[];
  className?: string;
  pagination?: Pagination;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: theme.palette.grey[300],
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 46,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  toolbar: {
    minHeight: 0,
  },
}));

export const SectionBar = ({
  title,
  buttons = [],
  className = '',
  pagination,
}: Props) => {
  const classes = useStyles();
  const handleChangePage = useCallback(
    (_, page) => {
      if (pagination) {
        pagination.onChangePage(page);
      }
    },
    [pagination]
  );
  return (
    <div className={className + ' ' + classes.wrapper}>
      <div className={classes.header}>
        <Typography variant="h6">{title}</Typography>
        {pagination && pagination.count > 0 && (
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
  );
};
