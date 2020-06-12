import React, { FC, useRef, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useReactToPrint } from 'react-to-print';
import { PrintHeader, Props as HeaderProps } from '../PrintHeader';
import { PrintFooter, Props as FooterProps } from '../PrintFooter';
import { Button, Props as ButtonProps } from '../Button';

export type Status = 'idle' | 'loading' | 'loaded';

interface Props {
  headerProps?: HeaderProps;
  footerProps?: FooterProps;
  buttonProps?: ButtonProps;
  onPrint?: () => void;
  onPrinted?: () => void;
  status?: Status;
}

const useStyles = makeStyles(theme => ({
  printWrapper: {
    display: 'none',
  },
  table: {
    width: '100%',
  },
  tfoot: {
    display: 'table-footer-group',
  },
}));

export const PrintPage: FC<Props> = ({
  headerProps,
  footerProps,
  buttonProps = {},
  onPrint,
  onPrinted,
  children,
  status,
}) => {
  const classes = useStyles();
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    copyStyles: true,
    pageStyle: '',
  });
  useEffect(() => {
    if (status === 'loaded') {
      handlePrint!();
      if (onPrinted) {
        onPrinted();
      }
    }
  }, [status, handlePrint, onPrinted]);
  return (
    <div>
      <Button
        label="Print"
        onClick={onPrint || handlePrint!}
        children={
          status === 'loading' && (
            <CircularProgress
              style={{ color: '#FFF', marginRight: 8 }}
              size={16}
            />
          )
        }
        disabled={status === 'loading'}
        {...buttonProps}
      />
      <div className={classes.printWrapper}>
        <div ref={printRef}>
          {headerProps && <PrintHeader {...headerProps} />}
          <table className={classes.table}>
            <tbody>
              <tr>
                <td>{children}</td>
              </tr>
            </tbody>
            {footerProps && (
              <tfoot className={classes.tfoot}>
                <tr>
                  <td>
                    <div style={{ height: footerProps.height }}>
                      <PrintFooter {...footerProps} />
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
