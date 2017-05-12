import React, { Component } from 'react';

import Utils from './Utils';

// return: a square of the board
// stateless components that only consist of a render method
function Square(props){
  return (
    <button className={props.winner_css + " square"} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}


// return: the current state of the game board
class Board extends Component {
  constructor(){
    super();
    this.state = {
      winpieces:{}
    }
  }


  /* 
    pass the winpieces to highlight
    this method will be called before render
    since the state of a component cannot be updated in render
    or it will cause infinite loop
    because render is based on the current state
  */
  componentWillReceiveProps(nextProps){
    this.formatWinner(nextProps.winpieces_b);
  }


  /*
    argv: (row, column), the coordinate in the board
    return: one rendered square of the board
  */
  renderSquare(row, column) {
    const index = (row-1) * Utils.column + (column-1);
    return <Square key={index} value={this.props.squares[index]}
                               winner_css={this.state.winpieces[index]}
                               onClick={() => this.props.onClick(row, column)} />;
  }


  /*
    argv: the nth row of the board
    return: one rendered row of the board
  */
  getRow(row_pos){
    let row = [];
    for(let i = 1; i < Utils.column + 1; i++){
      row = row.concat(this.renderSquare(row_pos, i));
    }
    return row;
  }


  /*
    called by render
    return: rendered game board
  */
  formatSquare(){
    let allSquares = [];
    for(let i = 1; i < Utils.row + 1; i++){
      allSquares = allSquares.concat(
        <div key={i} className="board-row">
          {this.getRow(i)}
        </div>
      );
    }
    return allSquares;
  }


  /*
    argv: a list of win's positions
    effect: attach a "winner" tag to these positions, to add to CSS className later
  */
  formatWinner(winpieces){
    if(!winpieces){
      this.setState({
        winpieces: {}
      })
      return;
    }

    let item = {};
    for(let i = 0; i < Utils.column; i++){
      console.log(winpieces[i]);       // also print out undefined?
      item[winpieces[i]] = "winner";
    }

    this.setState({
      winpieces: item
    })
  }


  render(){
    return (
      <div>
        {this.formatSquare()}
        <Source></Source>
      </div>
    );
  }
}

export default Board;


// return: the source code link
function Source(){
  return (
    <a href="https://github.com/blindacai/Tic-Tac-Toe">Source Code</a>
  );
}