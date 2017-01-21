var Board = require("./board");
var PuzzleNode = require("./puzzle_node");

function Solver(board) {
  var solverBoard = board.duplicate();
  this.visited = {};
  this.visited[solverBoard.grid] = true;
  this.solution = Solver.findSolution(solverBoard);
}

Solver.prototype.possibleBoards = function (board) {
  var boards = [];
  board.validMoves().forEach(function(pos) {
    var newBoard = board.duplicate();
    newBoard.move(pos);
    if (!this.visited[newBoard]) {
      boards.push(newBoard);
      this.visited[newBoard.grid] = true;
    }
  }.bind(this));
  return boards;
};

Solver.manhattanDistace = function (board) {
  return board.grid.reduce(function(distance, currentTile, index) {
    var adder = 0;
    if (currentTile) {
      var correctPos = currentTile - 1;
      var colDist = Math.abs(index % board.gridSize - correctPos % board.gridSize);
      var rowDist = Math.abs(Math.floor(index / board.gridSize) - Math.floor(correctPos / board.gridSize));
      adder = colDist + rowDist;
    }
    return distance + adder;
  }, 0);
};

Solver.findSolution = function (board) {
  var rootNode = new PuzzleNode(board);
  // rootNode.score = Solver.manhattanDistace(rootNode.board);
  var nodes = [rootNode];
  while (nodes.length > 0) {
    var currentNode = nodes.shift();
    var currentBoard = currentNode.board;
    currentNode.cost = currentNode.distance + Solver.manhattanDistace(currentBoard);
    this.possibleBoards(currentBoard).forEach(function(board) {
      var nextNode = new PuzzleNode(board);
      nextNode.distance = currentNode.distance + 1;
      nextNode.setParent(currentNode);
      if (nextNode.board.isOver) {
        // break;
      }
    });
  }

};

window.Solver = Solver;
module.exports = Solver;
