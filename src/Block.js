import React from "react";
import "./css/Block.css";
import uuidv1 from "uuid/v1";
import BlockContext from './BlockContext';

export class Block extends React.Component {
  static contextType = BlockContext;

  constructor(props, context) {
    super(props, context);

    this.contentRef = React.createRef();
    this.handlekeyPress = this.handlekeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.increaseIndent = this.increaseIndent.bind(this);
    
    this.state = {
      body: '',
      childrenBlocks: [],
      parentBlock: this.props.parentBlock || null
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
    // console.log("componentDidUpdate: ", prevProps, this.props);
  }

  handlekeyPress(event) {
    if (event.key === 'Enter'){
      event.preventDefault();
      this.context.addNewBlock(this.props.blockId, this.state.parentBlock);
    }
  }

  // needed for Tab key
  handleKeyDown(event) {
    if (event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      this.decreaseIndent();
    }
    else if (event.key === 'Tab') {
      event.preventDefault();
      this.increaseIndent();
    }
  }

  increaseIndent() {
    // at the top level
    if (this.state.parentBlock === null) {
      // this.context.setMovedBlock(this.props.blockId, this.props);
    }


    // update its own parentBlock


    // TODO - provide the old and new parentBlock ID 


    // find previous sibling from parentBlock's childrenBlocks
    // to parentBlock's childrenBlocks

    // this.props
    // this.props.indentChild(this.props.blockId);

      // TODO - append to childrenBlocks of the element before this 

      // we need reference to the current parentBlock
  }

  decreaseIndent() {

  }

  addNewBlock() {
    // const newBlock = { id: uuidv1(), body: '' };
    // this.setState({ childrenBlocks: [...this.state.childrenBlocks, newBlock] });
  }

  buildChildren() {
    console.log("context in buildChildren", this.context);


    return this.state.childrenBlocks.map(obj => {
      return (
        <Block 
          key={obj.id}
          blockId={obj.id}
          addNewBlock={this.addNewBlock}
          // parentBlocks={this.state.childrenBlocks}
        />
      );
    });
  }

  render() {
    // TODO - add padding for childrenBlocks container
    return(
    	<div className="block">
        <div className="bullet">
          <svg viewBox="0 0 18 18" fill="currentColor" className=" _uhlm2"><circle cx="9" cy="9" r="3.5"></circle></svg>
        </div>
        <div className="block-content" 
          ref={this.contentRef}
          contentEditable="true"
          onKeyPress={this.handlekeyPress}
          onKeyDown={this.handleKeyDown}></div>
        { this.buildChildren() }
    	</div>
    );
  }
}
