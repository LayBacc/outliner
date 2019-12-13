import React from "react";
import "./css/Block.css";
import uuidv1 from "uuid/v1";
import BlockContext from './BlockContext';
import { Editor, EditorState, ContentState, getDefaultKeyBinding } from 'draft-js';

export class Block extends React.Component {
  static contextType = BlockContext;

  constructor(props, context) {
    super(props, context);

    this.contentRef = React.createRef();
    
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.increaseIndent = this.increaseIndent.bind(this);
    
    this.state = {
      editorState: EditorState.createWithContent(ContentState.createFromText(this.getBody()))
    };
  }

  componentDidMount() {
    // set focus to newly created block
    this.contentRef.current.focus();
  }

  // TODO - check if parentBlocks have changed
  componentDidUpdate(prevProps) {

  }

  getBlockData() {
    return this.context.docData[this.props.blockId];
  }

  getBody() {
    return this.getBlockData().body;
  }

  getParentBlockId() {
    return this.getBlockData().parentId;
  }

  getChildrenBlockIds() {
    return this.getBlockData().children || [];
  }

  keyBindingFn(event) {
    if (event.key === 'Enter'){
      return 'new-block';
    }

    if (event.shiftKey && event.key === 'Tab') {
      return 'unindent'; 
    }

    if (event.key === 'Tab') {
      return 'indent';
    }

    if (event.key === 'ArrowUp') {
      return 'arrow-up';
    }

    if (event.key === 'ArrowDown') {
      return 'arrow-down';
    }

    return getDefaultKeyBinding(event);
  }

  handleKeyCommand(command) {
    if (command === 'new-block') {
      this.context.addNewBlock(this.props.blockId, this.getParentBlockId());
      return 'handled';
    }

    if (command === 'indent') {
      this.increaseIndent();
      return 'handled';
    }

    if (command === 'unindent') {
      this.decreaseIndent();
      return 'handled';
    }

    if (command === 'arrow-up') {
      this.moveCursorUp();
      return 'handled';
    }

    if (command === 'arrow-down') {
      return 'handled';
    }

    return 'not-handled';
  }

  handleEditorChange(editorState) {
    const body = editorState.getCurrentContent().getPlainText();
    const cursorOffset = editorState.getSelection().getStartOffset();

    this.context.updateBlock(this.props.blockId, body, cursorOffset);
    this.setState({editorState});
  }

  increaseIndent() {
    this.context.indentBlock(this.props.blockId, this.getParentBlockId());
  }

  decreaseIndent() {
    this.context.unindentBlock(this.props.blockId, this.getParentBlockId());
  }

  moveCursorUp() {
    this.context.moveCursorUp(this.props.blockId);
  }

  moveCursorDown() {
    this.context.moveCursorDown(this.props.blockId);
  }

  buildChildren() {
    const childrenBlocks = this.getChildrenBlockIds().map(blockId => {
      return (
        <Block 
          ref={blockId}
          key={blockId}
          blockId={blockId}
          addNewBlock={this.addNewBlock}
        />
      );
    });

    return(
      <div className="children">
        { childrenBlocks }
      </div>
    );
  }

  render() {
    return(
    	<div className="block">
        <div className="bullet">
          <svg viewBox="0 0 18 18" fill="currentColor" className=" _uhlm2"><circle cx="9" cy="9" r="3.5"></circle></svg>
        </div>
        <div className="block-content">
          <Editor
            ref={this.contentRef}
            editorState={this.state.editorState}
            onChange={this.handleEditorChange}
            keyBindingFn={this.keyBindingFn}
            handleKeyCommand={this.handleKeyCommand}
          />
        </div>
        { this.buildChildren() }
    	</div>
    );
  }
}
