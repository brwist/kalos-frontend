import React, { FC, useCallback, useState } from 'react';
import { EditorState } from 'draft-js';
// @ts-ignore
import { stateToMarkdown } from 'draft-js-export-markdown';
// @ts-ignore
import { stateFromMarkdown } from 'draft-js-import-markdown';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { User } from '@kalos-core/kalos-rpc/User';
import { Button } from '../../ComponentsLibrary/Button';
import {
  newBugReport,
  newBugReportImage,
  BugReportImage,
} from '../../../helpers';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import './reportBugForm.less';

type Props = {
  user: User.AsObject;
  onClose: () => void;
};

const template = `## Steps To Reproduce

1. ...
2. ...

## The current behavior
...

## The expected behavior
...
`;

const ReportBugForm: FC<Props> = ({ user, onClose }: Props): JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(stateFromMarkdown(template)),
  );
  const [images, setImages] = useState<BugReportImage[]>([]);
  const [ignoreImages, setIgnoreImages] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const isValid = useCallback(
    content => {
      const invalid = [];
      if (!title) {
        invalid.push('Title is a required field');
      }
      if (!content.trim().length) {
        invalid.push('Add description of the bug');
      }
      if (!ignoreImages && !images.length) {
        invalid.push('Upload at least one screenshot');
      }
      setErrors(invalid);
      return Boolean(!invalid.length);
    },
    [title, images, ignoreImages, setErrors],
  );

  const handleSubmit = async () => {
    const content = stateToMarkdown(editorState.getCurrentContent());
    if (!isValid(content)) return;
    setLoading(true);
    try {
      let body = `_Submitted by ${user.firstname} ${user.lastname}_\n`;
      body += content;
      if (!ignoreImages) {
        const result = (await newBugReportImage(user, images)) || [];
        const urls = result.map(i => `![${i.filename}](${i.url})`).join('\n');
        body += `
  ## Attached Images
  ${urls}
        `;
      }
      await newBugReport({
        title: title,
        body,
      });
      onClose();
    } catch (err) {
      setErrors(err);
      setLoading(false);
    }
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
      {Boolean(errors.length) && (
        <Box className="ReportBugFormErrors">
          <ul>
            {errors.map(err => (
              <Typography
                key={err}
                component="li"
                className="ReportBugFormErrorField"
              >
                {err}
              </Typography>
            ))}
          </ul>
        </Box>
      )}
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Title"
          onChange={e => setTitle(e.target.value)}
          margin="normal"
          disabled={loading}
        />
        <Typography variant="caption">
          Please provide a clear and concise description of what the bug is.
          Include screenshots if needed.
        </Typography>
        <RichTextEditor
          editorState={editorState}
          setEditorState={setEditorState}
          loading={loading}
        />
        <ImageUploader
          images={images}
          attachImage={handleAttachImage}
          detachImage={handleDetachImage}
          ignoreImages={ignoreImages}
          setIgnoreImages={setIgnoreImages}
          loading={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button
          label="Cancel"
          variant="outlined"
          onClick={handleCancel}
          disabled={loading}
        />
        <Button label="Submit" onClick={handleSubmit} disabled={loading} />
      </DialogActions>
    </Dialog>
  );
};

export default ReportBugForm;
