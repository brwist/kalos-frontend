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
import { Field, Value } from '../Field';
import { Actions, ActionsProps } from '../Actions';
import './styles.less';

export type Pagination = {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (page: number) => void;
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
  asideContentFirst?: boolean;
  small?: boolean;
  onCheck?: (checked: number) => void;
  checked?: number;
  loading?: boolean;
  uncollapsable?: boolean;
  sticky?: boolean;
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
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggleCollapsed = useCallback(
    () => (uncollapsable ? 0 : children ? setCollapsed(!collapsed) : 0),
    [collapsed, setCollapsed, uncollapsable, children],
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
                  className="SectionBarTitleSubtitle"
                  onClick={handleToggleCollapsed}
                >
                  {subtitle}
                </Typography>
              )}
            </div>
            {pagination && pagination.count > 0 && !collapsed && (
              <TablePagination
                classes={{
                  root: 'SectionBarToolbarRoot',
                  toolbar: 'SectionBarToolbar',
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
          <div className="SectionBarActions">
            {asideContentFirst && asideContent}
            {actions.length > 0 && (
              <Actions actions={actions} fixed={fixedActions} />
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
