import React, { FC } from 'react';
import clsx from 'clsx';
import { EditorState, RichUtils, ContentBlock } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

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
    container: {
      margin: `${theme.spacing(2)}px 0`,
      border: `1px solid ${theme.palette.grey['400']}`,
      borderRadius: theme.spacing(0.5),
    },
    stylesBlock: {
      background: theme.palette.grey['200'],
      padding: theme.spacing(1),
      borderBottom: `1px solid ${theme.palette.grey['400']}`,
    },
    styleButton: {
      cursor: 'pointer',
      marginRight: theme.spacing(2),
      display: 'inline-block',
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
      borderRadius: theme.spacing(0.5),
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
      '&.active': {
        background: theme.palette.grey['400'],
      },
    },
    editorWrapper: {
      padding: theme.spacing(1),
      fontSize: 14,
      fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
      '& p, & h1, & h2, & ol, & ul, & blockquote': {
        marginBottom: 16,
      },
      '& h1, & h2': {
        marginTop: 24,
        marginBottom: 16,
        fontWeight: 600,
        lineHeight: 1.25,
      },
      '& h2': {
        paddingBottom: '.3em',
        borderBottom: '1px solid #eaecef',
      },
      '& ol, & ul': {
        paddingLeft: '2em',
        '& li': {
          marginLeft: '0 !important',
        },
        '& li + li': {
          marginTop: '.25em',
        },
      },
      '& blockquote': {
        margin: 0,
        padding: '0 1em',
        color: '#6a737d',
        borderLeft: '.25em solid #dfe2e5',
      },
    },
  }),
);

function getBlockStyle(block: ContentBlock) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return ''
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
  loading: boolean,
};

const RichTextEditor: FC<Props> = ({ editorState, setEditorState, loading }) => {
  const classes = useStyles();
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

  return (
    <Box className={classes.container}>
      <Box className={classes.stylesBlock}>
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      </Box>
      <Box className={classes.editorWrapper}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          blockStyleFn={getBlockStyle}
          plugins={plugins}
          readOnly={loading}
        />
      </Box>
    </Box>
  );
};

export default RichTextEditor;
