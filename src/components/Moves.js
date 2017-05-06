import React, { Component } from 'react';

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

export default Moves;