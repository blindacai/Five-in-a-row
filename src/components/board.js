import React, { Component } from 'react';

import Utils from './Utils';

//////// Square
// stateless components that only consist of a render method
function Square(props){
  return (
    <button className={props.winner + " square"} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}


//////// Board
class Board extends Component {
  constructor(){
    super();
    this.state = {
      triowin:{}
    }
  }

  componentWillReceiveProps(nextProps){
    console.log("in will receive " + this.props.test + "\n");
    this.formatWinner(this.props.triopos)
  }


  renderSquare(i, j) {
    const index = (i-1) * Utils.column + (j-1);
    return <Square key={index} value={this.props.squares[index]}
                               winner={this.state.triowin[index]}
                               onClick={() => this.props.onClick(i, j)} />;
  }

  getSquare(row){
    let trio = [];
    for(let i = 1; i < Utils.column + 1; i++){
      trio = trio.concat(this.renderSquare(row, i));
    }
    return trio;
  }

  formatSquare(){
    let allSquares = [];
    for(let i = 1; i < Utils.column + 1; i++){
      allSquares = allSquares.concat(
        <div key={i} className="board-row">
          {this.getSquare(i)}
        </div>
      );
    }
    return allSquares;
  }

  formatWinner(triopos){
    if(!triopos){
      this.setState({
        triowin: {}
      })
      return;
    }

    let item = {};
    for(let i = 0; i < Utils.column; i++){
      item[triopos[i]] = "winner";
    }

    this.setState({
      triowin: item
    })
  }

  render(){
    console.log("in board render " + this.props.test + "\n");
    return (
      <div>
        {this.formatSquare()}
        <Source></Source>
      </div>
    );
  }
}

export default Board;


//////// Source
function Source(){
  return (
    <a href="https://github.com/blindacai/Tic-Tac-Toe">Source Code</a>
  );
}