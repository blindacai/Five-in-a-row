import React, { Component } from 'react';

import Utils from './Utils';

// return: a minus button
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

// return: an increase button
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


/*
  return: one user-controlled feature of the game
  eg: choose the size of the board
*/
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

function checkCeiling(target, threshold){
  return (target < threshold)? (target + 1) : target;
}

function checkFloor(target, threshold){
  return (target > threshold)? (target - 1) : target;
}

export default PlusMinus;