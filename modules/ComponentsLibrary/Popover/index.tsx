import React, {
  createRef,
  useEffect,
  useState,
  CSSProperties,
  RefObject,
} from 'react';
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
  stringList?: string[];
  buttonLabel: string;
  onClick?: () => Promise<string[]>;
  onClose?: () => void;
}

export const PopoverComponent = ({
  stringList,
  buttonLabel,
  onClick,
  onClose,
  styles = {},
}: Props) => {
  const [labelString, setLabelString] = useState<string[]>(['Loading...']);
  const [loaded, setLoaded] = useState<boolean>(false);
  const anchorEl = createRef<HTMLDivElement>();
  const [anchor, setAnchor] = useState<RefObject<HTMLDivElement>>(anchorEl);

  const [open, setOpen] = useState<boolean>(false);
  if (stringList) {
    setLabelString(stringList);
  }
  useEffect(() => {
    async function getLabel() {
      if (onClick && open) {
        console.log('here');
        const link = await onClick();
        setLabelString(link);
      }
    }
    if (!loaded && open) {
      console.log('loading and open');
      setLoaded(true);
      getLabel();
    }
  }, [loaded, onClick, open]);

  return (
    <div key="AnchorEl" ref={anchor}>
      <Button
        key={'PopoverButton'}
        variant="contained"
        onClick={() => setOpen(!open)}
      >
        {buttonLabel === '' ? 'No Information Provided' : buttonLabel}
      </Button>
      <Popover
        key={'PopoverElement' + anchorEl.current?.accessKey}
        open={open}
        onClose={onClose}
        onScroll={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        anchorEl={anchor.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {labelString.map(label => (
          <Typography
            style={{ padding: 10 }}
            variant="body2"
            key={'PopUpInfo' + label}
          >
            {label}
          </Typography>
        ))}
      </Popover>
    </div>
  );
};
