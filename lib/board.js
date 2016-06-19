var MoveError = require("./move_error");

function Board (gridSize) {
  this.gridSize = gridSize;
  this.solution = Board.tileContent(this.gridSize);
  this.grid = this.makeGrid(Board.makeSolvable(this.solution));
}

function shuffleArray(array) {
  var shuffled = array.slice(0);
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
  }
  return shuffled;
}

Board.prototype.makeGrid = function (array) {
  var grid = [];

  for (var i = 0; i < this.gridSize; i++) {
    grid.push([]);
    for (var j = 0; j < this.gridSize; j++) {
      grid[i].push(array[i * this.gridSize + j]);
    }
  }

  return grid;
};

Board.makeSolvable = function (array) {
  var tileArray = shuffleArray(array);
  if (Board.isSolvable(tileArray)) {
    return tileArray;
  } else {
    return Board.makeSolvable(tileArray);
  }
};

Board.tileContent = function (gridSize) {
  var tileRange = [];
  for (var i = 1; i < Math.pow(gridSize, 2); i++) {
    tileRange.push(i);
  }
  tileRange.push(null);
  return tileRange;
};

Board.isSolvable = function (tileArray) {
  var parity = 0;
  var row = 0;
  var gridSize = Math.sqrt(tileArray.length);
  var blankRow = 0;

  for (var i = 0; i < tileArray.length; i++) {
    if (i % gridSize === 0) {
      row++;
    }

    if (tileArray[i] === null) {
      blankRow = row;
    }

    for (var j = i + 1; j < tileArray.length; j++) {
      if (tileArray[i] > tileArray[j] && tileArray[j] !== null) {
        parity++;
      }
    }
  }

  if (gridSize % 2 === 0 && blankRow % 2 !== 0) {
    return parity % 2 !== 0;
  } else {
    return parity % 2 === 0;
  }
};

Board.prototype.isOver = function () {
  return this.solution.toString() === this.grid.flatten().toString();
};

Array.prototype.flatten = function () {
  return this.reduce(function (a, b) {
    return a.concat(b);
  });
};

Board.prototype.surroundingPositions = function (pos) {
  var positions = [];
  positions.push([pos[0] + 1, pos[1]]);
  positions.push([pos[0] - 1, pos[1]]);
  positions.push([pos[0], pos[1] + 1]);
  positions.push([pos[0], pos[1] - 1]);
  return  positions.filter(function (pos) {
    return this.isValidPos(pos);
  }.bind(this));
};

Board.prototype.isValidPos = function (pos) {
  return (
    (0 <= pos[0]) && (pos[0] < this.gridSize) && (0 <= pos[1]) && (pos[1] < this.gridSize)
  );
};

function indexOfArray(val, array) {
  var
    hash = {},
    indexes = {},
    i, j;
  for(i = 0; i < array.length; i++) {
    hash[array[i]] = i;
  }
  return (hash.hasOwnProperty(val)) ? hash[val] : -1;
}

Board.prototype.isValidMove = function (pos, emptyPosition) {
  var positionsSurroundingEmpty = this.surroundingPositions(emptyPosition);
  return indexOfArray(pos, positionsSurroundingEmpty) !== -1;
};

Board.prototype.emptyPosition = function () {
  var flattenedGrid = this.grid.flatten();
  var emptyPosition = flattenedGrid.indexOf(null);
  emptyPosition = [
    Math.floor(emptyPosition / this.gridSize),
    emptyPosition % this.gridSize
  ];
  return emptyPosition;
};

Board.prototype.move = function (pos) {
  var emptyPosition = this.emptyPosition();
  if (!this.isValidMove(pos, emptyPosition)) {
    throw new MoveError("Is not valid position");
  }
  this.grid[emptyPosition[0]][emptyPosition[1]] = this.grid[pos[0]][pos[1]];
  this.grid[pos[0]][pos[1]] = null;
};

module.exports = Board;
window.Board = Board;
