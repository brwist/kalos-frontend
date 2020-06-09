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
  status?: Status;
}

const useStyles = makeStyles(theme => ({
  printWrapper: {
    display: 'none',
  },
}));

export const PrintPage: FC<Props> = ({
  headerProps,
  footerProps,
  buttonProps = {},
  onPrint,
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
    }
  }, [status]);
  return (
    <div>
      <Button
        label="Print"
        onClick={onPrint || handlePrint!}
        {...buttonProps}
        children={
          status === 'loading' && (
            <CircularProgress
              style={{ color: '#FFF', marginRight: 8 }}
              size={16}
            />
          )
        }
        disabled={status === 'loading'}
      />
      <div className={classes.printWrapper}>
        <div ref={printRef}>
          {headerProps && <PrintHeader {...headerProps} />}
          {children}
          {footerProps && <PrintFooter {...footerProps} />}
        </div>
      </div>
    </div>
  );
};
