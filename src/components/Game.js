import React, { Component } from 'react';
import '../styles/Game.css';
import '../styles/Board.css';

import Utils from './Utils';
import * as calculate from './calculate';

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


//////// Decrease
class Decrease extends Component{

  updateUtils(){
    if(this.props.type === "causewin"){
      Utils.causewin = checkFloor(Utils.causewin, 3);
    }
    else{
      Utils.column = checkFloor(Utils.column, 10);
    }
  }

  render(){
    return (
      <button className="button" onClick={() => {this.updateUtils(); this.props.onClick()}}>-</button>
    );
  }
}


//////// Increase
class Increase extends Component{

  updateUtils(){
    if(this.props.type === "causewin"){
      Utils.causewin = checkCeiling(Utils.causewin, 6);
    }
    else{
      Utils.column = checkCeiling(Utils.column, 25);
    }
  }

  render(){
    return (
      <button className="button" onClick={() => {this.updateUtils(); this.props.onClick()}}>+</button>
    );
  }
}


//////// PlusMinus
class PlusMinus extends Component{
  render(){
    const value = (this.props.type === "causewin")? Utils.causewin : Utils.column;

    return (
      <div className={"absolute " + this.props.css}>
        <h2>{this.props.title}</h2>
        <Decrease type={this.props.type} onClick={() => this.props.onClick()} />
        <span>  {value}  </span>
        <Increase type={this.props.type} onClick={() => this.props.onClick()} />
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
    
    if (calculate.calculateWinner(squares) || squares[index]) {
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
    const triopos = calculate.calculateWinner(current.squares);
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

        <div className="relative">
          <div className="game-info">
            <h2>{this.getStatus(winner)}</h2>
            <Order buttonState={buttonText} onClick={() => this.flipState()} />
            <Moves moves={this.state.clickAt} 
                  buttonState={this.state.buttonState}
                  onClick={(index) => this.jumpTo(index)} />
          </div>
          
          <PlusMinus title={"[?] in a row"} 
                     css={"first"}
                     type={"causewin"}
                     onClick={() => this.startOver()} />

          <PlusMinus title={"Board Size?"} 
                     css={"second"}
                     type={"column"}
                     onClick={() => {this.startOver()}} />          
        </div>
      </div>
    );
  }
}

export default Game;


// ========================================

function checkCeiling(target, threshold){
  return (target < threshold)? (target + 1) : target;
}

function checkFloor(target, threshold){
  return (target > threshold)? (target - 1) : target;
}
