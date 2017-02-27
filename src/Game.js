import React, { Component } from 'react';
import './Game.css';
import './Board.css';

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
    this.formatWinner(nextProps.triopos)
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
    return (
      <div>
        {this.formatSquare()}
        <Source></Source>
      </div>
    );
  }
}


//////// Source
function Source(){
  return (
    <a href="https://github.com/blindacai/Tic-Tac-Toe">Source Code</a>
  );
}

//////// Move
function Move(props) {
  const index = props.step;
  let desc;
  if(index === 0){
    desc = props.move;
  }
  else{
    const posX = props.move.posX;
    const posY = props.move.posY;
    desc = `Move #${index} at (${posX}, ${posY})`;
  }

  return (
    <li onClick={() => props.onClick(index)}>{desc}</li>
  );
}


//////// Moves
class Moves extends Component{
  constructor(){
    super();
    this.state = {
      selectedItem: {}
    }
  }

  handleClick(index){
    let selected = {};
    selected[index] = "selected";
    this.setState({
      selectedItem: selected
    });
  }

  render(){
    const moves = this.props.moves.map((move, index) => {
      return (<a href="#" key={index} className={this.state.selectedItem[index] + " amove"}>
                <Move move={move} step={index} onClick={(index) => {this.handleClick(index);
                                                                    this.props.onClick(index)}} />
              </a>);
    });

    if(!this.props.buttonState){
      moves.reverse();
    }

    return (
      <ol>{moves}</ol>
    );
  }
}


//////// Toggle
function Order(props){
  return (
    <button className="button" onClick={() => props.onClick()}>
      {props.buttonState}
    </button>
  );
}


//////// WinValue
function WinValue(props){
  return (
    <span>  {props.value}  </span>
  );
}


//////// WinPiece
class WinPiece extends Component{

  checkCeiling(){
    if(Utils.causewin > 5){
      return;
    }
    else{
      Utils.causewin += 1; 
      this.props.onClick();
    }
  }

  checkFloor(){
    if(Utils.causewin < 4){
      return;
    }
    else{
      Utils.causewin -= 1;
      this.props.onClick();
    }
  }

  render(){
    return (
      <div>
        <button className="button" onClick={() => this.checkFloor()}>-</button>
          <WinValue value={Utils.causewin}></WinValue>
        <button className="button" onClick={() => this.checkCeiling()}>+</button>
      </div>
    );
  }
}


//////// Game
class Game extends Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(Math.pow(Utils.column, 2)).fill(null)
      }],

      clickAt: ["Game Start"],
      stepNumber: 0,
      xIsNext: true,
      buttonState: true
    };
  }  

  handleClick(i, j){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();     // slice: copy the squares array instead of mutating the existing one

    const clickAt = this.state.clickAt.slice(0, this.state.stepNumber + 1);
    const index = (i-1) * Utils.column + (j-1);
    
    if (calculateWinner(squares) || squares[index]) {
      return;
    }

    squares[index] = this.state.xIsNext? 'X' : 'O';

    this.setState({
      history: history.concat([{
          squares: squares
      }]),

      clickAt: clickAt.concat([{posX: i, posY: j}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2)? false : true 
    })
  }

  getStatus(winner){
    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O');
    }
    return status;
  }

  flipState(){
    this.setState({
      buttonState: !this.state.buttonState
    })
  }

  startOver(){
    this.jumpTo(0);
    this.setState({
      clickAt: ["Game Start"]
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const triopos = calculateWinner(current.squares);
    const winner = triopos? current.squares[triopos[0]] : null;
    const buttonText = this.state.buttonState? "Decrease" : "Increase"

    return (
      <div className="game">  
        <div className="game-board"> 
          <Board 
            squares={current.squares}
            triopos={triopos}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>

        <div className="game-info">
          <h2>{this.getStatus(winner)}</h2>
          <br />
          <Order buttonState={buttonText} onClick={() => this.flipState()} />
          <Moves moves={this.state.clickAt} 
                 buttonState={this.state.buttonState}
                 onClick={(index) => this.jumpTo(index)} />
        </div>

        <div className="switch-info">
          <h2>[?] in a row</h2>
          <WinPiece onClick={() => this.startOver()} />
        </div>  
       </div>
    );
  }
}

export default Game;


// ========================================

function winRow(start){
  let thewin = [];

  for(let i = 0; i < Utils.causewin; i++){
    thewin = thewin.concat([start + i]);
  }
  return thewin;
}

function winColumn(start){
  let thewin = [];

  for(let i = 0; i < Utils.causewin; i++){
    thewin = thewin.concat([start + Utils.column * i]);
  }
  return thewin;
}

function winCrossOne(start){
  let thewin = [];

  for(let i = 0; i < Utils.causewin; i++){
    thewin = thewin.concat([start + (Utils.column + 1) * i]);
  }
  return thewin;
}

function winCrossTwo(start){
  let thewin = [];

  for(let i = 0; i < Utils.causewin; i++){
    thewin = thewin.concat([start + (Utils.column - 1) * i]);
  }
  return thewin;
}

function linesForBoard(start){
  const num_column = Utils.column;
  let lines = [];

  let row = start;
  for(let i = 0; i < Utils.causewin; i++){
    lines = lines.concat( [winRow(row)] );
    row += num_column;
  }

  let column = start;
  for(let i = 0; i < Utils.causewin; i++){
    lines = lines.concat( [winColumn(column)] );
    column += 1;
  }

  lines = lines.concat([winCrossOne(start)], 
                       [winCrossTwo(start + Utils.causewin - 1)]);

  return lines;
}

function createLines(){
  const column = Utils.column;
  const loop_num = column - Utils.causewin + 1;
  let lines = [];

  let start = 0;
  for(let i = 0; i < loop_num; i++){
    for(let j = start; j < start + loop_num; j++){
      lines = lines.concat(linesForBoard(j));
    }
    start += column;
  }
  return lines;
}

function checkWin(squares, line){
  const first = squares[line[0]];

  if(!first){
    return false;
  }
  for(let i = 1; i < line.length; i++){
    if(first !== squares[line[i]]){
      return false;
    }
  }
  return true;
}

function calculateWinner(squares) {
  const lines = createLines();

  for (let i = 0; i < lines.length; i++) {
    if(checkWin(squares, lines[i])){
      return lines[i];
    }
  }
  return null;
}
