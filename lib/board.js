var MoveError = require("./move_error");

function Board (gridSize) {
  if (gridSize) {
    this.gridSize = gridSize;
    this.solution = Board.tileContent(this.gridSize);
    while (!this.grid || this.isOver()) {
      this.grid = Board.makeSolvable(this.solution);
    }
    this.emptyPosition = this.grid.indexOf(null);
  }
}

Board.prototype.duplicate = function () {
  var newBoard = new Board();
  newBoard.gridSize = this.gridSize;
  newBoard.solution = this.solution;
  newBoard.grid = this.grid.slice(0);
  newBoard.emptyPosition = this.emptyPosition;
  return newBoard;
};

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
  return this.solution.toString() === this.grid.toString();
};

Board.prototype.surroundingPositions = function (origPos) {
  var positions = [];
  var origCoords = Board.coords(origPos, this.gridSize);
  positions.push(origPos + 1);
  positions.push(origPos - 1);
  positions.push(origPos + this.gridSize);
  positions.push(origPos - this.gridSize);
  return  positions.filter(function (pos) {
    var posCoords = Board.coords(pos, this.gridSize);
    var horizDist = Math.abs(posCoords[1] - origCoords[1]);
    var vertDist = Math.abs(posCoords[0] - origCoords[0]);
    return this.isValidPos(pos) && horizDist + vertDist == 1;
  }.bind(this));
};

Board.coords = function(pos, gridSize) {
  var row = Math.floor(pos / gridSize);
  var col = pos % gridSize;
  return [row, col];
};

Board.prototype.isValidPos = function (pos) {
  return 0 <= pos && pos < Math.pow(this.gridSize, 2);
};

Board.prototype.validMoves = function () {
  return this.surroundingPositions(this.emptyPosition);
};

Board.prototype.isValidMove = function (pos) {
  return this.validMoves().includes(pos);
};

Board.prototype.move = function (pos) {
  if (!this.isValidMove(pos)) {
    throw new MoveError("Is not valid position");
  }
  this.grid[this.emptyPosition] = this.grid[pos];
  this.emptyPosition = pos;
  this.grid[pos] = null;
};

module.exports = Board;
