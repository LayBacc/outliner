import React from 'react';
import logo from './logo.svg';
import uuidv1 from "uuid/v1";
import './App.css';
import { Block } from "./Block";
import { WritingArea } from "./WritingArea";
import { BlockProvider } from './BlockContext';

import { Editor, EditorState, ContentState, RichUtils, getDefaultKeyBinding } from 'draft-js';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.updateBlock = this.updateBlock.bind(this);
    this.indentBlock = this.indentBlock.bind(this);
    this.unindentBlock = this.unindentBlock.bind(this);
    this.addNewBlock = this.addNewBlock.bind(this);


    this.handleSandboxKeyCommand = this.handleSandboxKeyCommand.bind(this);
    
    this.state = {
      docData: {},
      updateBlock: this.updateBlock,
      // todo - do we still need this? 
      // movedBlock: {
      //   currBlockId: '',
      //   prevParentId: '',
      //   newParentId: '',
      // },
      // newBlock: {
      //   currBlockId: '',
      //   newParentId: ''
      // },
      indentBlock: this.indentBlock,
      unindentBlock: this.unindentBlock,
      addNewBlock: this.addNewBlock,
      topLevelBlocks: [],  // top-level blocks

      editorState: EditorState.createEmpty() // draft.js editor sandbox
    };
  }

  componentDidMount() {
    this.initBlocks();
  }

  updateBlock(currBlockId, body) {
    this.setState(prevState => ({
      docData: {
        ...prevState.docData,
        [currBlockId]: {
          ...prevState.docData[currBlockId],
          body: body
        }
      }
    }));
  }

  indentBlock(currBlockId, prevParentId) {
    const docData = this.state.docData;
    const topLevelBlocks = this.state.topLevelBlocks;

    // Determine new parent

    // Top-level
    if (!prevParentId) {
      const currBlockIndex = this.state.topLevelBlocks.findIndex(block => {
        return block.id === currBlockId
      });
      // Can't indent the first block at the top-level 
      if (currBlockIndex === 0) return;

      let newParentData = topLevelBlocks[currBlockIndex-1];
      let currBlockData = this.getBlockData(currBlockId);
      
      // update current block
      currBlockData.parentId = newParentData.id;

      // update new parent      
      newParentData.children = [...newParentData.children, currBlockId];

      this.setState({
        docData: {
          ...docData,
          [currBlockId]: currBlockData,
          [newParentData.id]: newParentData
        },
        // update topLevelBlocks
        topLevelBlocks: [...topLevelBlocks.slice(0, currBlockIndex), ...topLevelBlocks.slice(currBlockIndex+1, topLevelBlocks.length)]
      });
      return;      
    } 

    const prevParentData = this.getBlockData(prevParentId);
    // Disable indenting for already nested block
    if (prevParentData.children.length === 1) return;

    const currBlockIndex = prevParentData.children.findIndex(blockId => {
        return blockId === currBlockId
      });
    const newParentId = prevParentData.children[currBlockIndex-1];
    let newParentData = this.getBlockData(newParentId)
    let currBlockData = this.getBlockData(currBlockId);

    // update current block
    currBlockData.parentId = newParentData.id;

    // update prev parent
    prevParentData.children = [...prevParentData.children.slice(0, currBlockIndex), ...prevParentData.children.slice(currBlockIndex+1, prevParentData.children.length)];

    // update new parent      
    newParentData.children = [...newParentData.children, currBlockId];

    this.setState({
      docData: {
        ...docData,
        [currBlockId]: currBlockData,
        [prevParentId]: prevParentData,
        [newParentData.id]: newParentData
      },
    });
  }

  getBlockData(blockId) {
    return this.state.docData[blockId];
  }

  unindentBlock(currBlockId, prevParentId) {
    // TODO - how do we know whether this is top level? 

    // check the parent of the previous parent
    let prevParentData = this.getBlockData(prevParentId);
    const newParentId = prevParentData.parentId;
    let currBlockData = this.getBlockData(currBlockId);

    // unindenting to top-level
    if (!newParentId) {
      const topLevelBlocks = this.state.topLevelBlocks;

      // update old parent
      const currBlockIndex = prevParentData.children.findIndex(blockId => {
        return blockId === currBlockId
      });

      prevParentData.children = [...prevParentData.children.slice(0, currBlockIndex), ...prevParentData.children.slice(currBlockIndex+1, prevParentData.children.length)]
      
      // update current block
      currBlockData.parentId = '';

      // need the index of parent block
      const prevParentIndex = topLevelBlocks.findIndex(block => {
        return block.id === prevParentId
      });

      this.setState({
        docData: {
          ...this.state.docData,
          [currBlockId]: currBlockData,
          [prevParentId]: prevParentData
        },
        // update new parent - adding to topLevelBlocks
        topLevelBlocks: [...topLevelBlocks.slice(0, prevParentIndex+1), currBlockData, ...topLevelBlocks.slice(prevParentIndex+1, topLevelBlocks.length)]
      });
    }


  }

  newBlock(parentId) {
    const blockId = uuidv1();
    const block = { id: blockId, body: '', children: [], parentId: parentId ? parentId : '' };

    this.setState(prevState => ({ 
      docData: {
        ...prevState.docData,
        [blockId]: block
      }
    }));
    return block;
  }

  initBlocks() {
    this.setState({ topLevelBlocks: [...this.state.topLevelBlocks, this.newBlock()] });
  }

  addNewBlock(currBlockId, parentBlockId) {
    console.log(parentBlockId)

    // top level
    if (!parentBlockId) {
      const currBlockIndex = this.state.topLevelBlocks.findIndex(block => {
        return block.id === currBlockId
      });
      const topLevelBlocks = this.state.topLevelBlocks;

      this.setState({ topLevelBlocks: [...topLevelBlocks.slice(0, currBlockIndex+1), this.newBlock(), ...topLevelBlocks.slice(currBlockIndex+1, topLevelBlocks.length)] });
      return;
    }

    // Add a new block to the children of parentBlockId
    const parentBlockData = this.getBlockData(parentBlockId);
    const currBlockIndex = parentBlockData.children.findIndex(blockId => {
        return blockId === currBlockId
      });
    const newBlock = this.newBlock(parentBlockId);

    this.setState(prevState => ({
      docData: {
        ...prevState.docData,
        [parentBlockId]: {
          ...parentBlockData,
          children: [...parentBlockData.children, newBlock.id]
        }
      }
    }));
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

  handleSandboxKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
        // <WritingArea>
        // </WritingArea>
    return(
      <div>
        <BlockProvider 
          value={this.state}
        >
          { this.buildBlocks() }
        </BlockProvider>

      </div>
    );
  }
        // <br /><br /><br />
        // <h3>Draft.js sandbox</h3>
        // <Editor 
        //   editorState={this.state.editorState}
        //   handleKeyCommand={this.handleSandboxKeyCommand}
        //   onChange={(editorState) => this.setState({editorState})} 
        // />
}
