import React from 'react';
import logo from './logo.svg';
import uuidv1 from "uuid/v1";
import './App.css';
import { Block } from "./Block";
import { WritingArea } from "./WritingArea";
import { BlockProvider } from './BlockContext';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.setMovedBlock = this.setMovedBlock.bind(this);
    this.resetMovedBlock = this.resetMovedBlock.bind(this);
    this.addNewBlock = this.addNewBlock.bind(this);
    
    this.state = {
      movedBlock: {
        currBlockId: '',
        prevParentId: '',
        newParentId: '',
      },
      setMovedBlock: this.setMovedBlock,
      resetMovedBlock: this.resetMovedBlock,
      addNewBlock: this.addNewBlock,
      newBlock: {
        currBlockId: '',
        newParentId: ''
      },
      topLevelBlocks: []  // top-level blocks
    };
  }

  componentDidMount() {
    this.initBlocks();
  }

  setMovedBlock(currBlockId, prevParent, newParent) {
    this.setState({
      movedBlock: {
        currBlockId: currBlockId,
        prevParentId: prevParent ? prevParent.id : '',
        newParentId: newParent ? newParent.id : ''
      }
    });
  }

  resetMovedBlock() {

  }

  newBlock() {
    return({ id: uuidv1(), body: '' });
  }

  initBlocks() {
    this.setState({ topLevelBlocks: [...this.state.topLevelBlocks, this.newBlock()] });
  }

  addNewBlock(currBlockId, parentBlock) {
    // top level
    if (!parentBlock) {
      const currBlockIndex = this.state.topLevelBlocks.findIndex(block => {
        return block.id === currBlockId
      });
      const topLevelBlocks = this.state.topLevelBlocks;

      this.setState({ topLevelBlocks: [...topLevelBlocks.slice(0, currBlockIndex+1), this.newBlock(), ...topLevelBlocks.slice(currBlockIndex+1, topLevelBlocks.length)] });
      return;
    }  
  }

  buildBlocks() {
    return this.state.topLevelBlocks.map(obj => {
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
        // <WritingArea>
        // </WritingArea>
    return(
      <BlockProvider 
        value={this.state}
      >
        { this.buildBlocks() }
      </BlockProvider>    
    );
  }
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}
