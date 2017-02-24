import React, { Component } from 'react';
import './Game.css';
import './Board.css';


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
    const index = (i-1)*3 + (j-1);
    return <Square key={index} value={this.props.squares[index]}
                               winner={this.state.triowin[index]}
                               onClick={() => this.props.onClick(i, j)} />;
  }

  getSquare(row){
    let trio = [];
    for(let i = 1; i < 4; i++){
      trio = trio.concat(this.renderSquare(row, i));
    }
    return trio;
  }

  formatSquare(){
    let allSquares = [];
    for(let i = 1; i < 4; i++){
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
    for(let i = 0; i < 3; i++){
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

    return (
      <ol>{moves}</ol>
    );
  }
}


//////// Game
class Game extends Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],

      clickAt: ["Game Start"],
      stepNumber: 0,
      xIsNext: true  
    };
  }  

  handleClick(i, j){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();     // slice: copy the squares array instead of mutating the existing one

    const clickAt = this.state.clickAt.slice(0, this.state.stepNumber + 1);
    const index = (i-1)*3 + (j-1);
    
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const triopos = calculateWinner(current.squares);
    const winner = triopos? current.squares[triopos[0]] : null;

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
          <div>{this.getStatus(winner)}</div>
          <Moves moves={this.state.clickAt} onClick={(index) => this.jumpTo(index)}/>
        </div>
       </div>
    );
  }
}

export default Game;


// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
