import React, {
  FC,
  useCallback,
  CSSProperties,
  useState,
  ReactNode,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import TablePagination from '@material-ui/core/TablePagination';
import { Field, Value } from '../Field';
import { Actions, ActionsProps } from '../Actions';
import './styles.css';

export type Pagination = {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (page: number) => void;
};

type Styles = {
  collapsable?: boolean;
  collapsed?: boolean;
  fixedActions?: boolean;
  small?: boolean;
};

interface Props {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ActionsProps;
  className?: string;
  pagination?: Pagination;
  styles?: CSSProperties;
  fixedActions?: boolean;
  footer?: ReactNode;
  asideContent?: ReactNode;
  small?: boolean;
  onCheck?: (checked: number) => void;
  checked?: number;
  loading?: boolean;
  uncollapsable?: boolean;
}

const useStyles = makeStyles(theme => ({
  wrapper: ({ collapsable, collapsed, small }: Styles) => ({
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: theme.palette.grey[300],
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    display: 'flex',
    justifyContent: 'space-between',
    justifyItems: 'center',
    minHeight: small ? 0 : 46,
    flexDirection: 'column',
    boxSizing: 'border-box',
    marginBottom: collapsable && collapsed ? theme.spacing() : 0,
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      minHeight: 0,
    },
  }),
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  titleWrapper: ({ collapsable, small }: Styles) => ({
    cursor: collapsable ? 'pointer' : 'default',
    userSelect: 'none',
    width: '100%',
    marginTop: theme.spacing(small ? 0.5 : 1),
    marginBottom: theme.spacing(small ? 0.5 : 1),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
  }),
  title: ({ small }: Styles) => ({
    display: 'flex',
    alignItems: 'center',
    ...theme.typography[small ? 'subtitle1' : 'h6'],
    lineHeight: 1,
    [theme.breakpoints.down('xs')]: {
      ...theme.typography.subtitle1,
      lineHeight: 1,
    },
  }),
  subtitle: ({ small }: Styles) => ({
    marginTop: theme.spacing(0.25),
    color: theme.palette.grey[600],
    ...theme.typography[small ? 'subtitle2' : 'subtitle1'],
    lineHeight: 1,
    [theme.breakpoints.down('xs')]: {
      ...theme.typography.subtitle2,
      lineHeight: 1,
    },
  }),
  toolbarRoot: {
    flexShrink: 0,
  },
  toolbar: {
    minHeight: 0,
    color: theme.palette.common.black,
  },
  footer: {
    marginBottom: theme.spacing(),
    ...theme.typography.body1,
  },
  checkbox: {
    marginBottom: 0,
    width: 42,
  },
}));

export const SectionBar: FC<Props> = ({
  title = '',
  subtitle,
  actions = [],
  className = '',
  pagination,
  styles,
  fixedActions = false,
  footer,
  asideContent,
  small = false,
  children,
  onCheck,
  checked,
  loading = false,
  uncollapsable = false,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const classes = useStyles({
    collapsable: !!children && !uncollapsable,
    collapsed,
    fixedActions,
    small,
  });
  const handleToggleCollapsed = useCallback(
    () => (uncollapsable ? 0 : setCollapsed(!collapsed)),
    [collapsed, setCollapsed, uncollapsable],
  );
  const handleChangePage = useCallback(
    (_, page) => {
      if (pagination) {
        pagination.onChangePage(page);
      }
    },
    [pagination],
  );
  const handleCheckChange = useCallback(
    (checked: Value) => {
      if (onCheck) {
        onCheck(+checked);
      }
    },
    [onCheck],
  );
  return (
    <>
      <div className={className + ' ' + classes.wrapper} style={styles}>
        <div className={classes.headerWrapper}>
          <div className={classes.header}>
            {onCheck && (
              <Field
                name="check"
                value={checked}
                type="checkbox"
                onChange={handleCheckChange}
                className={classes.checkbox + ' ' + 'SectionBarCheckbox'}
                disabled={loading}
              />
            )}
            <div className={classes.titleWrapper}>
              <Typography
                variant="h5"
                className={classes.title}
                onClick={handleToggleCollapsed}
              >
                {title}{' '}
                {children &&
                  !uncollapsable &&
                  (collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
              </Typography>
              {!collapsed && subtitle && (
                <Typography
                  variant="h6"
                  className={classes.subtitle}
                  onClick={handleToggleCollapsed}
                >
                  {subtitle}
                </Typography>
              )}
            </div>
            {pagination && pagination.count > 0 && !collapsed && (
              <TablePagination
                classes={{
                  root: classes.toolbarRoot,
                  toolbar: classes.toolbar,
                }}
                component="div"
                rowsPerPageOptions={[]}
                {...pagination}
                onChangePage={handleChangePage}
                backIconButtonProps={{ size: 'small' }}
                nextIconButtonProps={{ size: 'small' }}
              />
            )}
          </div>
          <div className={classes.actions}>
            {actions.length > 0 && (
              <Actions actions={actions} fixed={fixedActions} />
            )}
            {asideContent}
          </div>
        </div>
        {!collapsed && footer && <div className={classes.footer}>{footer}</div>}
      </div>
      {!collapsed && children}
    </>
  );
};
