import React, { Component } from 'react';
import '../styles/Game.css';
import '../styles/Board.css';

import Utils from './Utils';
import * as calculate from './CalculateWinner';
import Board from './Board';
import Moves from './Moves';
import PlusMinus from './UserControl';

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
      buttonState: true,

      test: 0
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

      test: this.state.test + 1
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
    console.log("in game render \n");
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const triopos = calculate.calculateWinner(current.squares);
    const winner = triopos? current.squares[triopos[0]] : null;
    const buttonText = this.state.buttonState? "Decrease" : "Increase";

    const test = this.state.test;

    return (
      <div className="game">  
        <div className="game-board"> 
          <Board 
            squares={current.squares}
            triopos={triopos}
            test={test}
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