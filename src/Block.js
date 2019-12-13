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

    const context = this.context;
    console.log(context);
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

    return 'not-handled';
  }

  handleEditorChange(editorState) {
    const body = editorState.getCurrentContent().getPlainText();
    this.context.updateBlock(this.props.blockId, body);
    this.setState({editorState});
  }

  increaseIndent() {
    this.context.indentBlock(this.props.blockId, this.getParentBlockId());
  }

  decreaseIndent() {
    this.context.unindentBlock(this.props.blockId, this.getParentBlockId());
  }

  buildChildren() {
    const childrenBlocks = this.getChildrenBlockIds().map(blockId => {
      return (
        <Block 
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

        // <div className="block-content" 
        //   ref={this.contentRef}
        //   contentEditable="true"
        //   onKeyPress={this.handlekeyPress}
        //   onKeyDown={this.handleKeyDown}>
        //   { this.getBody() }
        // </div>
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
