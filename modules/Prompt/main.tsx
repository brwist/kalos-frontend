import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

interface props {
  disabled?: boolean;
  Icon?(props: SvgIconProps): JSX.Element;
  defaultValue?: string;
  confirmFn(str: string): void;
  multiline?: boolean;
  text: string;
  prompt: string;
}

export function Prompt({
  disabled,
  text,
  Icon,
  prompt,
  confirmFn,
  defaultValue,
  multiline,
}: props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const answer = React.createRef<HTMLInputElement>();

  const toggleOpen = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(!isOpen);
    setAnchorEl(event.currentTarget);
    try {
      answer.current && answer.current.focus();
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirm = () => {
    if (answer.current && answer.current.value !== '') {
      setIsOpen(false);
      confirmFn(answer.current.value);
    }
  };

  const button = Icon ? (
    <Tooltip title={text} placement="top">
      <IconButton onClick={toggleOpen} disabled={disabled}>
        <Icon />
      </IconButton>
    </Tooltip>
  ) : (
    <Button
      variant="outlined"
      size="small"
      fullWidth
      startIcon={Icon}
      onClick={toggleOpen}
      disabled={disabled}
    >
      {text}
    </Button>
  );
  return (
    <>
      {button}
      <Popover
        aria-labelledby="transition-modal-title"
        open={isOpen}
        anchorEl={anchorEl}
        onClose={toggleOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          style={{ padding: 10 }}
        >
          <Typography>{prompt}</Typography>
          <TextField
            inputRef={answer}
            variant="outlined"
            defaultValue={defaultValue || ''}
            multiline={multiline}
          />
          <Grid
            container
            item
            direction="row"
            justify="space-evenly"
            align-items="center"
            style={{ paddingTop: 10 }}
          >
            <Button onClick={toggleOpen}>Cancel</Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
}
