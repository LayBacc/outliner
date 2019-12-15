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

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    
    this.state = {
      editorState: EditorState.createWithContent(ContentState.createFromText(this.getBody()))
    };
  }

  componentDidMount() {
    // set focus to newly created block
    this.contentRef.current.focus();
    this.context.addRef(this.props.blockId, this);
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

    if (event.key === 'Backspace') {
      return 'backspace';
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
      this.moveCursorDown();
      return 'handled';
    }

    if (command === 'backspace') {
      this.handleBackspace();
      // continue with default behavior
    }

    return 'not-handled';
  }

  handleEditorChange(editorState) {
    const body = editorState.getCurrentContent().getPlainText();
    const cursorOffset = editorState.getSelection().getStartOffset();

    this.context.updateBlock(this.props.blockId, body, cursorOffset);
    this.setState({editorState});
  }

  // delete block if blank, otherwise use default behavior
  handleBackspace() {
    const cursorOffset = this.state.editorState.getSelection().getStartOffset();
    if (cursorOffset === 0) {
      this.context.removeBlock(this.props.blockId)
      return true;
    }

    return false;
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

  onDragStart(event) {
    event.stopPropagation();

    this.context.updateDraggedBlockId(this.props.blockId, true);
  }

  onDragEnd(event) {
    this.context.updateDraggedBlockId(this.props.blockId, false);
    this.context.updateUnderlinedBlock('', false)
  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();

    // TODO - control underlinedBlock in global context 
    console.log("drag over", this.props.blockId, this.getBody());

    this.context.updateUnderlinedBlock(this.props.blockId, true);
    // this.setState({ hasUnderline: true });
  }

  onDragLeave(event) {
    // event.stopPropagation();
    // event.preventDefault();

    console.log("drag leave", this.props.blockId, this.getBody());

    // this.setState({ hasUnderline: false }); 
    this.context.updateUnderlinedBlock(this.props.blockId, false);
  }

  onDrop(event, category) {
    this.context.updateMovedBlock(this.props.blockId);
    console.log("onDrop ", this.getBody());
  }

  isUnderlined() {
    return this.context.underlinedBlockId === this.props.blockId;
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
        // <div 
        //   className="drop-zone"
        //   droppable="true"
        //   onDragOver={this.onDragOver}
        //   onDragLeave={this.onDragLeave}
        // >&nbsp;
        // </div>

  render() {
    return(
      <div>
      	<div 
          className={`block ${this.isUnderlined() ? "underline" : ""}`}
          draggable="true"
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          droppable="true"
          onDrop={this.onDrop}
        >
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
      	</div>
        
        { this.buildChildren() }
      </div>
    );
  }
}
