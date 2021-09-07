import React, { ReactNode, useEffect, useState, CSSProperties } from 'react';
import ModalUI from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { Loader } from '../../Loader/main';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import './styles.less';

interface Props {
  classname?: string;
  styles?: CSSProperties;
  label?: string;
  buttonLabel: string;
  anchorElement: React.RefObject<HTMLDivElement>;
  onClick?: () => Promise<string>;
  onClose?: () => void;
}

export const PopoverComponent = ({
  label,
  buttonLabel,
  anchorElement,
  onClick,
  onClose,
  styles = {},
}: Props) => {
  const [labelString, setLabelString] = useState<string>('Loading...');
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  if (label) {
    setLabelString(label);
  }

  useEffect(() => {
    async function getLabel() {
      if (onClick && open) {
        console.log('here');
        const link = await onClick();
        setLabelString(link);
        setLoading(false);
      }
    }
    if (!loading && open) {
      console.log('loading and open');
      setLoading(true);
      getLabel();
    }
  }, [loading, onClick, open]);

  return (
    <>
      <Button
        key={'PopoverButton'}
        variant="contained"
        onClick={() => setOpen(!open)}
      >
        {buttonLabel === '' ? 'No Information Provided' : buttonLabel}
      </Button>
      <Popover
        key={'PopoverElement' + anchorElement.current?.accessKey}
        open={open}
        onClose={onClose}
        onScroll={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        anchorEl={anchorElement.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {
          <Typography style={{ padding: 10 }} key="PopUpInfo">
            {labelString}
          </Typography>
        }
      </Popover>
    </>
  );
};
