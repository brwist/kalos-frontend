import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import NotesIcon from '@material-ui/icons/NotesSharp';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';

interface props {
  text: string;
  onOpen?(): Promise<void>;
  iconButton?: boolean;
  notes: string;
  disabled?: boolean;
}

export function TxnNotes({ text, onOpen, iconButton, disabled, notes }: props) {
  const [isOpen, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const toggleOpen = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(!isOpen);
    setAnchorEl(event.currentTarget);
    if (onOpen && !isOpen) {
      try {
        await onOpen();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const button = iconButton ? (
    <Tooltip content={text}>
      <span>
        <IconButton size="small" onClick={toggleOpen} disabled={disabled}>
          <NotesIcon />
        </IconButton>
      </span>
    </Tooltip>
  ) : (
    <Button
      variant="outlined"
      size="large"
      style={{ height: 44, marginBottom: 10 }}
      fullWidth
      startIcon={<NotesIcon />}
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
          alignItems="center"
          justifyContent="flex-start"
          wrap="nowrap"
          style={{ maxWidth: 600, padding: 30 }}
        >
          <Typography>{notes}</Typography>
        </Grid>
      </Popover>
    </>
  );
}
