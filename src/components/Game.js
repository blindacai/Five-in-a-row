import React, { Component } from 'react';
import '../styles/Game.css';
import '../styles/Board.css';

import Utils from './Utils';
import * as calculate from './CalculateWinner';
import Board from './Board';
import Moves from './Moves';
import PlusMinus from './UserControl';


// the entry point of the game
/*
  state desp:
  history: a list of game board state (a new state added to the list after each user's step)
  clickAt: a list of step's position
  stepNumber:
  xIsNext: true when next step is x, false when it should be o
  buttonState: flip the order of history steps
*/
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
      xIsNext: !this.state.xIsNext,
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
    const winpieces_g = calculate.calculateWinner(current.squares);
    const winner = winpieces_g? current.squares[winpieces_g[0]] : null;
    const buttonText = this.state.buttonState? "Decrease" : "Increase";

    return (
      <div className="game">  
        <div className="game-board"> 
          <Board 
            squares={current.squares}
            winpieces_b={winpieces_g}
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
                     onClick={() => this.startOver()}
          />
          <PlusMinus title={"Board Size?"} 
                     css={"second"}
                     type={"column"}
                     onClick={() => {this.startOver()}}
          />          
        </div>
      </div>
    );
  }
}

export default Game;

//////// Toggle
function Order(props){
  return (
    <button className="button" onClick={() => props.onClick()}>
      {props.buttonState}
    </button>
  );
}