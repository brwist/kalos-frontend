import React, { FC, useRef, useEffect, useCallback, useState } from 'react';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import { useReactToPrint } from 'react-to-print';
import { PrintHeader, Props as HeaderProps } from '../PrintHeader';
import { PrintFooter, Props as FooterProps } from '../PrintFooter';
import { Button, Props as ButtonProps } from '../Button';
import { getUploadedHTMLUrl, setInlineStyles } from '../../../helpers';
import './styles.css';

export type Status = 'idle' | 'loading' | 'loaded';

interface Props {
  headerProps?: HeaderProps;
  footerProps?: FooterProps;
  buttonProps?: ButtonProps;
  onPrint?: () => void;
  onPrinted?: () => void;
  status?: Status;
  downloadPdfFilename?: string;
  className?: string;
  downloadLabel?: string;
  icons?: boolean;
  visible?: boolean;
}

export const PrintPage: FC<Props> = ({
  headerProps,
  footerProps,
  buttonProps = {},
  onPrint,
  onPrinted,
  children,
  status,
  downloadPdfFilename,
  className = '',
  downloadLabel = 'Download',
  icons = false,
  visible,
}) => {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState<boolean>(false);
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
  const handleDownload = useCallback(async () => {
    if (printRef.current) {
      setDownloading(true);
      // @ts-ignore
      setInlineStyles(printRef.current);
      // @ts-ignore
      const content = printRef.current.innerHTML;
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${downloadPdfFilename}</title>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `;
      const url = await getUploadedHTMLUrl(html, `${downloadPdfFilename}.pdf`);
      window.open(url, '_blank');
      setDownloading(false);
    }
  }, [printRef, setDownloading, downloadPdfFilename]);
  return (
    <>
      <span className={className}>
        {downloadPdfFilename &&
          (icons ? (
            <IconButton
              onClick={handleDownload}
              size="small"
              disabled={
                status === 'loading' || downloading || buttonProps.disabled
              }
            >
              {(status === 'loading' || downloading) && (
                <CircularProgress
                  style={{ position: 'absolute', color: '#FFF' }}
                  size={12}
                />
              )}
              <DownloadIcon />
            </IconButton>
          ) : (
            <Button
              onClick={handleDownload}
              children={
                (status === 'loading' || downloading) && (
                  <CircularProgress
                    style={{ color: '#FFF', marginRight: 8 }}
                    size={16}
                  />
                )
              }
              {...buttonProps}
              disabled={
                status === 'loading' || downloading || buttonProps.disabled
              }
              label={downloadLabel}
            />
          ))}
        {icons ? (
          <IconButton
            onClick={onPrint || handlePrint!}
            size="small"
            disabled={status === 'loading' || buttonProps.disabled}
          >
            <PrintIcon />
          </IconButton>
        ) : (
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
            {...buttonProps}
            disabled={status === 'loading' || buttonProps.disabled}
          />
        )}
      </span>
      <div className={clsx("PrintPage", visible && 'visible')}>
        <div ref={printRef}>
          {headerProps && <PrintHeader {...headerProps} />}
          <table className="PrintPage_table">
            <tbody>
              <tr>
                <td>{children}</td>
              </tr>
            </tbody>
            {footerProps && (
              <tfoot className="PrintPage_tfoot">
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
    </>
  );
};
