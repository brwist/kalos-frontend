import React, { FC } from 'react';
import clsx from 'clsx';
import { Editor, EditorState, RichUtils, ContentBlock } from 'draft-js';
import Box from '@material-ui/core/Box';
import './RichTextEditor.module.less';

function getBlockStyle(block: ContentBlock) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return '';
  }
}

type StyleButtonProps = {
  active: boolean;
  style: string;
  label: string;
  onToggle: (style: string) => void;
};

const StyleButton: FC<StyleButtonProps> = ({
  active,
  style,
  label,
  onToggle,
}: StyleButtonProps) => (
  <span
    className={clsx('BugReportRichTextEditorButton', active && 'active')}
    onMouseDown={e => {
      e.preventDefault();
      onToggle(style);
    }}
  >
    {label}
  </span>
);

type StyleControlsProps = {
  editorState: EditorState;
  onToggle: (type: string) => void;
};

const BLOCK_TYPES = [
  { label: 'Title', style: 'header-one' },
  { label: 'Subtitle', style: 'header-two' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
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
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
];

const InlineStyleControls: FC<StyleControlsProps> = ({
  editorState,
  onToggle,
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
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  loading: boolean;
};

const RichTextEditor: FC<Props> = ({
  editorState,
  setEditorState,
  loading,
}) => {
  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  return (
    <Box className="BugReportRichTextEditorContainer">
      <Box className="BugReportRichTextEditorBlock">
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      </Box>
      <Box className="BugReportRichTextEditorWrapper">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          blockStyleFn={getBlockStyle}
          readOnly={loading}
        />
      </Box>
    </Box>
  );
};

export default RichTextEditor;
