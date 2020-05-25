import React, { FC } from 'react';
import clsx from 'clsx';
import { EditorState, RichUtils, ContentBlock } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import { newBugReportImage } from '../../../helpers';

const blockDndPlugin = createBlockDndPlugin();
const decorator = composeDecorators(
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

const plugins = [
  blockDndPlugin,
  imagePlugin
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {},
    stylesBlock: {
      background: theme.palette.primary.light,
    },
    styleButton: {
      color: theme.palette.grey.A400,
      cursor: 'pointer',
      marginRight: theme.spacing(2),
      padding: '2px 0',
      display: 'inline-block',
      '&.active': {
        color: 'red',
      },
    },
  }),
);

function getBlockStyle(block: ContentBlock) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}

type StyleButtonProps = {
  active: boolean,
  style: string,
  label: string,
  onToggle: (style: string) => void,
};

const StyleButton: FC<StyleButtonProps> = ({ active, style, label, onToggle }: StyleButtonProps) => {
  const classes = useStyles();
  return (
    <span
      className={clsx(classes.styleButton, active && 'active')}
      onMouseDown={e => {
        e.preventDefault();
        onToggle(style);
      }}>
      {label}
    </span>
  );
}

type StyleControlsProps = {
  editorState: EditorState,
  onToggle: (type: string) => void,
};

const BLOCK_TYPES = [
  {label: 'Title', style: 'header-one'},
  {label: 'Subtitle', style: 'header-two'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
];

const BlockStyleControls: FC<StyleControlsProps> = ({
  editorState,
  onToggle,
  handleUploadImage,
}: StyleControlsProps): JSX.Element => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
      <label htmlFor="bug-report-image">
        <InsertPhotoIcon />
      </label>
      <input type="file" id="bug-report-image" style={{display: 'none'}} onChange={handleUploadImage} />
    </div>
  );
};

const INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
];

const InlineStyleControls: FC<StyleControlsProps> = ({
 editorState,
 onToggle
}: StyleControlsProps): JSX.Element => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

type Props = {
  editorState: EditorState,
  setEditorState: (state: EditorState) => void,
};

const RichTextEditor: FC<Props> = ({ editorState, setEditorState }) => {
  const classes = useStyles();
  const handleChange = (state: EditorState) => {
    setEditorState(state);
  };
  const toggleBlockType = (blockType: string) => {
    setEditorState(
      RichUtils.toggleBlockType(editorState, blockType),
    );
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(
      RichUtils.toggleInlineStyle(editorState, inlineStyle),
    );
  };

  const handleUploadImage = e => {
      const file = e.target.files[0],
        reader = new FileReader();

      reader.onloadend = function () {
        const imgBase64 = reader.result.replace(/^data:.+;base64,/, '');
        newBugReportImage(imgBase64);
      };

      reader.readAsDataURL(file);
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.stylesBlock}>
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
          handleUploadImage={handleUploadImage}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      </Box>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        blockStyleFn={getBlockStyle}
        plugins={plugins}
      />
    </Box>
  );
};

export default RichTextEditor;
