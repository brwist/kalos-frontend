import React, { FC, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useReactToPrint } from 'react-to-print';
import { PrintHeader, Props as HeaderProps } from '../PrintHeader';
import { PrintFooter, Props as FooterProps } from '../PrintFooter';
import { Button, Props as ButtonProps } from '../Button';

interface Props {
  headerProps?: HeaderProps;
  footerProps?: FooterProps;
  buttonProps?: ButtonProps;
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
  children,
}) => {
  const classes = useStyles();
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    copyStyles: true,
  });
  return (
    <div>
      <Button label="Print" onClick={handlePrint!} {...buttonProps} />
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
