function Board (gridSize) {
  this.gridSize = gridSize || 3;
  this.solution = Board.tileContent(this.gridSize);
  this.grid = this.makeGrid(shuffleArray(this.solution));
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

Board.tileContent = function (gridSize) {
  gridSize = gridSize;
  var tileRange = Array.from(Array(Math.pow(gridSize, 2) - 1).keys());
  tileRange.push(null);
  return tileRange;
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

Board.prototype.isValidMove = function (pos) {
  var positionsSurroundingEmpty = this.emptyPosition().surroundingPositions();
  return positionsSurroundingEmpty.indexOf(pos) !== -1;
};

Board.prototype.emptyPosition = function () {
  var flattenedGrid = this.grid.flatten();
  var emptyPosition = flattenedGrid.indexOf(null);
  emptyPosition = [
    [
      emptyPosition % this.gridSize,
      Math.floor(emptyPosition / this.gridSize)
    ]
  ];
  return emptyPosition;
};

Board.prototype.move = function (pos) {
  var emptyPosition = this.emptyPosition();
  this.grid[emptyPosition[0]][emptyPosition[1]] = this.grid[pos[0]][pos[1]];
  this.grid[pos[0]][pos[1]] = null;
};

window.Board = Board;
