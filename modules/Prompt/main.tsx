import React, { useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { Tooltip } from '../ComponentsLibrary/Tooltip';
import { Button } from '../ComponentsLibrary/Button';
import { Form, Schema } from '../ComponentsLibrary/Form';

interface props {
  disabled?: boolean;
  Icon?(props: SvgIconProps): JSX.Element;
  defaultValue?: string;
  confirmFn(str: string): void;
  multiline?: boolean;
  text: string;
  prompt: string;
}

type Form = {
  value: string;
};

export function Prompt({
  disabled,
  text,
  Icon,
  prompt,
  confirmFn,
  defaultValue = '',
  multiline = false,
}: props) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = useCallback(() => setIsOpen(!isOpen), [setIsOpen, isOpen]);

  const handleConfirm = useCallback(
    ({ value }: Form) => {
      confirmFn(value);
      setIsOpen(false);
    },
    [confirmFn, setIsOpen],
  );

  const SCHEMA: Schema<Form> = [
    [{ name: 'value', label: prompt, multiline, required: true }],
  ];

  const button = Icon ? (
    <Tooltip content={text} placement="bottom">
      <IconButton size="small" onClick={toggleOpen} disabled={disabled}>
        <Icon />
      </IconButton>
    </Tooltip>
  ) : (
    <Button
      label={text}
      variant="outlined"
      fullWidth
      onClick={toggleOpen}
      disabled={disabled}
      compact
    />
  );
  return (
    <Tooltip
      open={isOpen}
      controlled
      maxWidth={400}
      content={
        <Form<Form>
          title=" "
          schema={SCHEMA}
          data={{ value: defaultValue }}
          onClose={toggleOpen}
          onSave={handleConfirm}
          submitLabel="Confirm"
          stickySectionBar={false}
          fullWidth
        />
      }
      placement="bottom"
      noPadding
    >
      <span>{button}</span>
    </Tooltip>
  );
}
