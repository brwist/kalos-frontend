import React, { FC, useState } from 'react';
import { EditorState } from 'draft-js';
// @ts-ignore
import { stateToMarkdown } from 'draft-js-export-markdown';
// @ts-ignore
import { stateFromMarkdown } from 'draft-js-import-markdown';
import 'draft-js/dist/Draft.css';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import TextField  from '@material-ui/core/TextField';
import { Button } from '../../ComponentsLibrary/Button';
import { newBugReport } from '../../../helpers';
import RichTextEditor from './RichTextEditor';

type Props = {
  onClose: () => void,
};

const template = `## Steps To Reproduce

1. ...
2. ...

## The current behavior
...

## The expected behavior
...
`;

const ReportBugForm: FC<Props> = ({ onClose }: Props): JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [editorState, setEditorState] = useState(
    () => EditorState.createWithContent(stateFromMarkdown(template)),
  );
  const handleSubmit = async () => {
    const res = await newBugReport({
      title: title,
      body: stateToMarkdown(editorState.getCurrentContent()),
      // ![alt](https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg)
    });
    onClose();
  };
  const handleCancel = () => {
    onClose();
  };
  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Title"
          onChange={e => setTitle(e.target.value)}
        />
        <Typography variant="caption">
          Please provide a clear and concise description of what the bug is. Include screenshots if needed.
        </Typography>
        <RichTextEditor editorState={editorState} setEditorState={setEditorState} />
      </DialogContent>
      <DialogActions>
        <Button label="Cancel" variant="outlined" onClick={handleCancel} />
        <Button label="Submit" onClick={handleSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default ReportBugForm;