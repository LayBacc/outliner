import React from "react";
import "./css/Block.css";
import uuidv1 from "uuid/v1";

export class Block extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.contentRef = React.createRef();
    this.handlekeyPress = this.handlekeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.increaseIndent = this.increaseIndent.bind(this);
    
    this.state = {
      body: '',
      children: [],
      parent: null
    };
  }

  componentDidMount() {
    this.contentRef.current.focus();
  }

  // TODO - check if parentBlocks have changed
  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate: ", prevProps, this.props);
    // if parent blocks 

  }

  handlekeyPress(event) {
    if (event.key === 'Enter'){
      event.preventDefault();
      this.props.addNewBlock();
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
    

    // find previous sibling from parent's children
    // to parent's children

    // at the top level
    // if (this.state.parent === null) {
    //   // TODO - change the parent's children
    // }
    // this.props
    // this.props.indentChild(this.props.blockId);

      // TODO - append to children of the element before this 

      // we need reference to the current parent
  }

  decreaseIndent() {

  }

  addNewBlock() {
    const newBlock = { id: uuidv1(), body: '' };
    this.setState({ children: [...this.state.children, newBlock] });
  }

  buildChildren() {
    return this.state.children.map(obj => {
      return (
        <Block 
          key={obj.id}
          blockId={obj.id}
          addNewBlock={this.addNewBlock}
          parentBlocks={this.state.children}
        />
      );
    });
  }

  render() {
    // TODO - add padding for children container
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
