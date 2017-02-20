import React, { Component } from 'react';
import './Game.css';
import './Board.css';


//////// Square
// stateless components that only consist of a render method
function Square(props){
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}


//////// Board
class Board extends Component {

  renderSquare(i, j) {
    return <Square value={this.props.squares[(i-1)*3 + (j-1)]} onClick={() => this.props.onClick(i, j)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(1,1)}
          {this.renderSquare(1,2)}
          {this.renderSquare(1,3)}
        </div>
        <div className="board-row">
          {this.renderSquare(2,1)}
          {this.renderSquare(2,2)}
          {this.renderSquare(2,3)}
        </div>
        <div className="board-row">
          {this.renderSquare(3,1)}
          {this.renderSquare(3,2)}
          {this.renderSquare(3,3)}
        </div>
      </div>
    );
  }
}

//////// move
class Move extends Component{

  render(){
    let text = <li>{this.props.posX}</li>;
    if(this.props.bold){
      text = <b>{text}</b>
    }

    return (
      <div onClick={() => this.props.onClick()}>{text}</div>
    );
  }
}


//////// Moves
class Moves extends Component{
  constructor(){
    super();
    this.state = {
      steps: [],
      bold: false
    }
  }

  handle(){
    this.setState({
      bold: true
    })
  }

  render(){
    this.setState({
      steps: this.state.steps.concat([this.props.step])
    })

    const moves = this.state.steps.map((step, index) => {
      if(this.state.bold){
        this.setState({
          bold: false
        })
      }

      return (
        <Move key={index} posX={step.posX} bold={this.state.bold} onClick={() => this.handle()} />
      );
    });


    return (
      <ul>{moves}</ul>
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

      clickAt: {},
      stepNumber: 0,
      xIsNext: true  
    };
  }  

  handleClick(i, j){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();     // slice: copy the squares array instead of mutating the existing one

    //const clickAt = this.state.clickAt.slice(0, this.state.stepNumber + 1);
    const index = (i-1)*3 + (j-1);
    

    if (calculateWinner(squares) || squares[index]) {
      return;
    }

    squares[index] = this.state.xIsNext? 'X' : 'O';

    this.setState({
      history: history.concat([{
          squares: squares
      }]),

      // clickAt: clickAt.concat([{posX: i, posY: j}]),
      clickAt: {posX: i, posY: j},
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O');
    }

    /*const moves = history.map((step, move) => {
      const desc = move? 
        'Move #' + move + ' at ' + '(' + clickAt[move - 1].posX + ',' + clickAt[move - 1].posY + ')':
        'Game Start';
        return (
          <li key={move}>
            <a href='#' onClick={() => this.jumpTo(move)}>{desc}</a>
          </li>  
        );
    });*/

    return (
      <div className="game">  
        <div className="game-board"> 
          <Board 
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <Moves step={this.state.clickAt} />
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
      return squares[a];
    }
  }
  return null;
}
