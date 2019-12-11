import React from "react";
import uuidv1 from "uuid/v1";
import { Block } from "./Block";

export class WritingArea extends React.Component {
	constructor(props, context) {
    super(props, context);

    this.addNewBlock = this.addNewBlock.bind(this);
    this.state = {
    	childrenBlocks: []
    };
  }

  componentDidMount() {
  	this.addNewBlock();
  }

  addNewBlock() {
  	// const newBlock = { id: uuidv1(), body: '' };
  	// this.setState({ childrenBlocks: [...this.state.childrenBlocks, newBlock] });
  }

  buildBlocks() {
  	return this.state.childrenBlocks.map(obj => {
  		return (
  			<Block 
  				key={obj.id}
  				blockId={obj.id}
	  			addNewBlock={this.addNewBlock}
	  			// parent={this}
	  		/>
	  	);
  	});
  }

  render() {
    	  // { this.buildBlocks() }
    return(
    	<div>
    	  Welcome

    	</div>
    );
  }
}
