import Utils from './Utils';

/*
  return: one cause of win that appears at a row
  type: list
  eg: * * * *
      * ^ ^ ^
      * * * *
      * * * *
      return [5, 6, 7]
*/
function winRow(start){
  let thewin = [];

  for(let i = 0; i < Utils.causewin; i++){
    thewin = thewin.concat([start + i]);
  }
  return thewin;
}


/*
  return: one cause of win that appears at a column
  type: list
  eg: * * * *
      * ^ * *
      * ^ * *
      * ^ * *
      return [5, 9, 13]
*/
function winColumn(start){
  let thewin = [];

  for(let i = 0; i < Utils.causewin; i++){
    thewin = thewin.concat([start + Utils.column * i]);
  }
  return thewin;
}


/*
  return: one cause of win that appears at diagonals
  type: list
  eg: * * * *
      * ^ * *
      * * ^ *
      * * * ^
      return [5, 10, 15]
*/
function winCrossOne(start){
  let thewin = [];

  for(let i = 0; i < Utils.causewin; i++){
    thewin = thewin.concat([start + (Utils.column + 1) * i]);
  }
  return thewin;
}


/*
  return: one cause of win that appears at diagonals
  type: list
  eg: * * * *
      * * ^ *
      * ^ * *
      ^ * * *
      return [6, 9, 12]
*/
function winCrossTwo(start){
  let thewin = [];

  for(let i = 0; i < Utils.causewin; i++){
    thewin = thewin.concat([start + (Utils.column - 1) * i]);
  }
  return thewin;
}


/*
  return: all possible wins in one sub-board
  type: list of lists
  eg: when cause of wins equals 3
      * * * *
      * ^ ^ ^
      * ^ ^ ^
      * ^ ^ ^
      return [[5, 6, 7], [9, 10, 11], ...]
*/
function AllWinsInOneBoard(start){
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


/*
  return: all possible wins in the board
  type: list of lists
*/
function AllWins(){
  const column = Utils.column;
  const loop_num = column - Utils.causewin + 1;
  let lines = [];

  let start = 0;
  for(let i = 0; i < loop_num; i++){
    for(let j = start; j < start + loop_num; j++){
      lines = lines.concat(AllWinsInOneBoard(j));
    }
    start += column;
  }
  return lines;
}


/*
  argv: 1. board(list): the current game board
        2. win(list): one cause of win
  return: true if win exists in the board, false otherwise
  type: boolean
*/
function checkWin(board, win){
  const first = board[win[0]];

  if(!first){
    return false;
  }
  for(let i = 1; i < win.length; i++){
    if(first !== board[win[i]]){
      return false;
    }
  }
  return true;
}


/*
  agrv: 1. board(list): the current game board
  return: a list of win's positions or null if not found
  type: list
*/
export function calculateWinner(board) {
  const wins = AllWins();

  for (let i = 0; i < wins.length; i++) {
    if(checkWin(board, wins[i])){
      return wins[i];
    }
  }
  return null;
}