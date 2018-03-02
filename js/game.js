Game = function (board = this.buildStartingBoard()) {
  this.board = board.split("").map(function(char){ 
    return parseInt(char); 
  });
}

Game.prototype.buildStartingBoard = function () {
  let startingValues = [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  return shuffle(startingValues).join("");
}

// BOARD STATES

Game.prototype.toString = function () {
  let boardString = "";
  for (var i = 0; i < this.board.length; i++) {
    boardString += this.board[i].toString();
    if ((i+1) % 4 === 0) {
      boardString += "\n";
    }
  }
  return boardString.trim();
}

Game.prototype.toArray = function () {
  let gameArray = [];
  let tempBoard = this.board.slice(0);
  while (tempBoard.length > 0) {
    gameArray.push(tempBoard.splice(0, 4))
  }
  return gameArray;
}

Game.prototype.mirroredRows = function (rows = this.toArray()) {
  return rows.map(function(row){
    return row.reverse();
  });
}

Game.prototype.rowsRotatedClock = function (rows = this.toArray()) {
  var rotated = [[],[],[],[]];
  var flippedRows = rows.reverse();
  for (var row = 0; row < flippedRows.length; row++) {
    for (var col = 0; col < flippedRows[row].length; col++) {
      rotated[col].push(flippedRows[row][col]);
    }
  }
  return rotated;
}

Game.prototype.rowsRotatedCounterClock = function (rows = this.toArray()) {
  var rotated = [[],[],[],[]]
  var mirroredRows = this.mirroredRows(rows);
  for (var row = 0; row < mirroredRows.length; row++) {
    for (var col = 0; col < mirroredRows[row].length; col++) {
      rotated[col].push(mirroredRows[row][col]);
    }
  }
  return rotated;
}

// MOVE LOGIC

Game.prototype.updateBoard = function (boardArray) {
  let flatBoard = flatten(boardArray);
  this.board = flatBoard;
  return this.board;
}

Game.prototype.move = function (direction) {
  let movedRows;
  if (direction === 'right') {
    movedRows = this.slideBoardRight(this.toArray());
  } else if (direction === 'left') {
    let slidMirroredRows = this.slideBoardRight(this.mirroredRows());
    movedRows = this.mirroredRows(slidMirroredRows);
  } else if (direction === 'up'){
    let rotatedBoard = this.rowsRotatedClock();
    let slidRotatedRows = this.slideBoardRight(rotatedBoard);
    movedRows = this.rowsRotatedCounterClock(slidRotatedRows);
  } else if (direction === 'down') {
    let rotatedBoard = this.rowsRotatedCounterClock();
    let slidRotatedRows = this.slideBoardRight(rotatedBoard);
    movedRows = this.rowsRotatedClock(slidRotatedRows);
  } else {
    alert('Sorry, that direction is invalid! Please try "left", "right", "up", or "down".');
    return false;
  }
  let movedAndSpawnedRows = this.spawnValue(movedRows);
  this.updateBoard(movedAndSpawnedRows);
  return true;
}

Game.prototype.slideBoardRight = function (rows) {
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    let slidRow = this.slideRowRight(rows[rowIndex]);
    rows[rowIndex] = leftPadWithZeroes(slidRow);
  }
  return rows;
}

Game.prototype.slideRowRight = function (inputRow) {
  let row = removeZeroes(inputRow);
  let rowLength = row.length;
  let highestCheckIndex = rowLength - 1;
  for (let indexToSlide = rowLength - 2; indexToSlide >= 0; indexToSlide--) {
    if (indexToSlide === highestCheckIndex) {
      continue;
    } else if (row[highestCheckIndex] === row[indexToSlide]) {
      row[highestCheckIndex] = row[highestCheckIndex] * 2;
      row.splice(indexToSlide, 1);
      highestCheckIndex -= 2;
    } else {
      highestCheckIndex --;
    }
  }
  return row;
}

Game.prototype.spawnValue = function (boardArray) {
  let needsNewValue = true;
  if (this.anyZeroSpaces(boardArray) === false) {
    needsNewValue = false;
  }
  while (needsNewValue === true) {
    let location = this.getRandomLocation();  
    let row = location[0];
    let col = location[1];
    if (boardArray[row][col] !== 0) {
      continue;
    } else {
      boardArray[row][col] = 2;
      needsNewValue = false;
    }
  }
  return boardArray;
}

Game.prototype.getRandomLocation = function () {
  return [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
}

// STATE CHECKING

Game.prototype.anyZeroSpaces = function (board = this.toArray()) {
  let flatBoard = flatten(board);
  if (flatBoard.includes(0)) {
    return true;
  } else {
    return false;
  }
}

Game.prototype.anyValidMoves = function () {
  return this.anyZeroSpaces() === true || this.anyPossibleMerges() === true
}

Game.prototype.anyPossibleMerges = function () {
  return this.anyAdjacentPairs() || this.anyAdjacentPairs(this.rowsRotatedClock());
}

Game.prototype.anyAdjacentPairs = function (board = this.toArray()) {
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    let row = board[rowIndex]
    for (var i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i+1]) {
        return true;
      }
    }
  }
  return false;
}

// SCORING

Game.prototype.incrementScore = function (value) {
  this.score += value;
}

// HELPER FUNCTIONS


function shuffle (ary) {
  let counter = ary.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = ary[counter];
    ary[counter] = ary[index];
    ary[index] = temp;
  }
  return ary;
}

function flatten (ary) {
  return ary.reduce(function (a, b) {
    if (Array.isArray(b)) {
      return a.concat(flatten(b))
    }
    return a.concat(b)
  }, [])
}

function removeZeroes (ary) {
  return ary.filter(function(n){
    return n !== 0
  });
}

function leftPadWithZeroes (ary) {
  let padAmount = 4 - ary.length;
  for (var i = 0; i < padAmount; i++) {
    ary.unshift(0);
  }
  return ary;
}
