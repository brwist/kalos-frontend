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
import { User } from '@kalos-core/kalos-rpc/User';
import { Button } from '../../ComponentsLibrary/Button';
import { newBugReport, newBugReportImage, BugReportImage } from '../../../helpers';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

type Props = {
  user: User.AsObject,
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

const ReportBugForm: FC<Props> = ({ user,  onClose }: Props): JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [editorState, setEditorState] = useState(
    () => EditorState.createWithContent(stateFromMarkdown(template)),
  );
  const [images, setImages] = useState<BugReportImage[]>([]);
  const handleSubmit = async () => {
    if (!title) {

    }
    let body = `_Submitted by ${user.firstname} ${user.lastname}_\n`;
    body += stateToMarkdown(editorState.getCurrentContent());
    if (images.length) {
      const result = await newBugReportImage(user, images) || [];
      const urls = result.map(i => `![${i.filename}](${i.url})`).join('\n');
      body += `
## Attached Images
${urls}
      `
    };
    const res = await newBugReport({
      title: title,
      body,
    });
    onClose();
  };
  const handleCancel = () => {
    onClose();
  };
  const handleAttachImage = (img: BugReportImage) => {
    const data = [...images];
    data.unshift(img);
    setImages(data);
  };

  const handleDetachImage = (label: string) => {
    const data = [...images];
    const index = data.findIndex(i => i.label === label);
    data.splice(index, 1);
    setImages(data);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Title"
          onChange={e => setTitle(e.target.value)}
          margin="normal"
        />
        <Typography variant="caption">
          Please provide a clear and concise description of what the bug is. Include screenshots if needed.
        </Typography>
        <RichTextEditor editorState={editorState} setEditorState={setEditorState} />
        <ImageUploader images={images} attachImage={handleAttachImage} detachImage={handleDetachImage} />
      </DialogContent>
      <DialogActions>
        <Button label="Cancel" variant="outlined" onClick={handleCancel} />
        <Button label="Submit" onClick={handleSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default ReportBugForm;