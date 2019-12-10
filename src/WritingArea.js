import React from "react";
import { Block } from "./Block";
import uuidv1 from "uuid/v1";

export class WritingArea extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.addNewBlock = this.addNewBlock.bind(this);
    this.state = {
    	blocks: []
    };
  }

  componentDidMount() {
  	this.addNewBlock();
  }

  // newBlock() {
  // 	return(
  // 		<Block 
  // 			addNewBlock={this.addNewBlock}
  // 			parentBlocks={this.state.blocks}
  // 		/>
  // 	);
  // }

  // initBlocks() {
  // 	return [this.newBlock()];
  // }

  // getLastBlock() {
  // 	return this.state.blocks[this.state.blocks.length-1];
  // }

  addNewBlock() {
  	const newBlock = { id: uuidv1(), body: '' };
  	this.setState({ blocks: [...this.state.blocks, newBlock] });
  }

  // indentChild(blockId) {
  // 	// remove a child
  // 	// TODO - nest it under the right child
  // 	const blocks = this.state.blocks.filter(obj => {
  // 		return obj.id !== blockId;
  // 	});

  // 	console.log("in indentChild", blocks, blockId);

  // 	this.setState({ blocks: blocks });
  // }

  buildBlocks() {
  	return this.state.blocks.map(obj => {
  		return (
  			<Block 
  				key={obj.id}
  				blockId={obj.id}
	  			addNewBlock={this.addNewBlock}
	  			indentChild={this.indentChild}
	  			parentBlocks={this.state.blocks}
	  		/>
	  	);
  	});
  }

  render() {
    return(
    	<div>
    	  Welcome

    	  { this.buildBlocks() }
    	</div>
    );
  }
}
