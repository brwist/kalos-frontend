import React, {
  FC,
  useCallback,
  CSSProperties,
  useState,
  ReactNode,
} from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import TablePagination from '@material-ui/core/TablePagination';
import Pagination from '@material-ui/lab/Pagination';
import { Field, Value } from '../Field';
import { Actions, ActionsProps } from '../Actions';
import './styles.less';

export type PaginationType = {
  count: number;
  page: number;
  rowsPerPage?: number;
  onPageChange: (page: number) => void;
};

interface Props {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ActionsProps;
  className?: string;
  pagination?: PaginationType;
  styles?: CSSProperties;
  fixedActions?: boolean;
  footer?: ReactNode;
  asideContent?: ReactNode;
  asideContentFirst?: boolean;
  small?: boolean;
  onCheck?: (checked: number) => void;
  checked?: number;
  loading?: boolean;
  uncollapsable?: boolean;
  sticky?: boolean;
  actionsAndAsideContentResponsive?: boolean;
  disabled?: boolean;
}

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
  asideContentFirst = false,
  small = false,
  children,
  onCheck,
  checked,
  loading = false,
  uncollapsable = false,
  sticky = true,
  actionsAndAsideContentResponsive = false,
  disabled,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggleCollapsed = useCallback(
    () => (uncollapsable ? 0 : children ? setCollapsed(!collapsed) : 0),
    [collapsed, setCollapsed, uncollapsable, children],
  );
  const handleChangePage = useCallback(
    (_, page) => {
      if (pagination) {
        pagination.onPageChange(page);
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
  const collapsable = !!children && !uncollapsable;
  return (
    <>
      <div
        className={clsx(className, 'SectionBar', {
          collapsable,
          collapsed,
          fixedActions,
          small,
          sticky,
        })}
        style={styles}
      >
        <div className="SectionBarHeaderWrapper">
          <div className="SectionBarHeader">
            {onCheck && (
              <Field
                name="check"
                value={checked}
                type="checkbox"
                onChange={handleCheckChange}
                className="SectionBarCheckbox"
                disabled={loading}
              />
            )}
            <div
              className={clsx('SectionBarTitleWrapper', { collapsable, small })}
            >
              <Typography
                variant="h5"
                className={clsx('SectionBarTitle', { small })}
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
                  className="SectionBarSubtitle"
                  onClick={handleToggleCollapsed}
                >
                  {subtitle}
                </Typography>
              )}
            </div>
            {pagination &&
              pagination.count > 0 &&
              !collapsed &&
              (pagination.rowsPerPage ? (
                <TablePagination
                  classes={{
                    root: 'SectionBarToolbarRoot',
                    toolbar: 'SectionBarToolbar',
                  }}
                  component="div"
                  rowsPerPageOptions={[]}
                  {...pagination}
                  rowsPerPage={pagination.rowsPerPage}
                  onPageChange={handleChangePage}
                  backIconButtonProps={{ size: 'small' }}
                  nextIconButtonProps={{ size: 'small' }}
                />
              ) : (
                <Pagination
                  count={pagination.count}
                  page={pagination.page + 1}
                  onChange={(_, page) => pagination.onPageChange(page - 1)}
                  siblingCount={1}
                  boundaryCount={1}
                  variant="outlined"
                  color="primary"
                  className="SectionBarPagination"
                />
              ))}
          </div>
          <div
            className={clsx('SectionBarActions', {
              actionsAndAsideContentResponsive,
            })}
          >
            {asideContentFirst && asideContent}
            {actions.length > 0 && (
              <Actions
                actions={actions}
                fixed={fixedActions}
                disabled={disabled}
              />
            )}
            {!asideContentFirst && asideContent}
          </div>
        </div>
        {!collapsed && footer && (
          <div className="SectionBarFooter">{footer}</div>
        )}
      </div>
      {!collapsed && children}
    </>
  );
};
