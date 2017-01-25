var Board = require("./board");
var PuzzleNode = require("./puzzle_node");
var PriorityQueue = require("./priority_queue");

function Solver(board) {
  var solverBoard = board.duplicate();
  this.visited = {};
  this.visited[solverBoard.grid] = true;
  this.solution = this.findSolution(solverBoard);
}

Solver.prototype.possibleBoards = function (board) {
  var boards = [];
  board.validMoves().forEach(function(pos) {
    var newBoard = board.duplicate();
    newBoard.move(pos);
    if (!this.visited[newBoard.grid]) {
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

Solver.prototype.findSolution = function (board) {
  if (board.gridSize > 3) return [];
  var rootNode = new PuzzleNode(board);
  rootNode.priority = Solver.manhattanDistace(rootNode.board);
  var boardQueue = new PriorityQueue([rootNode]);
  var currentNode = boardQueue.pop();
  var solved;
  while (currentNode) {
    var currentBoard = currentNode.board;
    if (currentBoard.isOver()) {
      solved = currentNode;
      break;
    }
    var nextBoards = this.possibleBoards(currentBoard);
    boardQueue.add(nextBoards.map(function (board) {
      var nextNode = new PuzzleNode(board);
      nextNode.distance = currentNode.distance + 1;
      nextNode.priority = nextNode.distance + Solver.manhattanDistace(nextNode.board);
      nextNode.move = Board.moveInfo(currentBoard.emptyPosition, board.emptyPosition, board);
      nextNode.setParent(currentNode);
      return nextNode;
    }));
    currentNode = boardQueue.pop();
  }
  return solved ? Solver.traceBack(solved) : [];
};

Solver.traceBack = function (endNode) {
  var nodes = [];
  var currentNode = endNode;
  while (currentNode) {
    nodes.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return nodes;
};

Solver.solutionString = function(solution) {
  return solution.map(function(node) {
    return node.moveString();
  });
};

window.Solver = Solver;
module.exports = Solver;
