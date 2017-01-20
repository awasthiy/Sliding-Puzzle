var Board = require("./board");
var PuzzleNode = require("./puzzle_node");

function Solver(board) {
  this.visited = [board.grid];
}

Solver.prototype.findSolution = function () {

};

Solver.prototype.visitedBoard = function (board) {
  return indexOfArray(board.grid, this.visited) !== -1;
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

Solver.prototype.possibleBoards = function (board) {
  var boards = [];
  board.validMoves().forEach(function(pos) {
    var newBoard = board.duplicate();
    newBoard.move(pos);
    if (!this.visitedBoard(newBoard)) {
      boards.push(newBoard);
      this.visited.push(newBoard.grid);
    }
  }.bind(this));
  return boards;
};

window.Solver = Solver;
module.exports = Solver;
