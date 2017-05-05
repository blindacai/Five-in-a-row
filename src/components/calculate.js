import Utils from './Utils';

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

export function calculateWinner(squares) {
  const lines = createLines();

  for (let i = 0; i < lines.length; i++) {
    if(checkWin(squares, lines[i])){
      return lines[i];
    }
  }
  return null;
}