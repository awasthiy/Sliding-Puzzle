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
      nextNode.setParent(currentNode);
      return nextNode;
    }));
    currentNode = boardQueue.pop();
  }
  return solved ? Solver.traceBack(solved) : [];
};

Solver.traceBack = function (endNode) {
  var steps = [];
  var currentNode = endNode;
  while (currentNode.parent) {
    var currentEmptyPosition = currentNode.board.emptyPosition;
    var parentBoard = currentNode.parent.board;
    steps.unshift({
      "pos" : currentEmptyPosition,
      "value" : parentBoard.grid[currentEmptyPosition],
      "direction" : Solver.determineDirection(
                      parentBoard.emptyPosition,
                      currentEmptyPosition,
                      parentBoard.gridSize)
    });
    currentNode = currentNode.parent;
  }
  return steps;
};

Solver.determineDirection = function (currentEmpty, nextEmpty, gridSize) {
  var from = Board.coords(currentEmpty, gridSize);
  var to = Board.coords(nextEmpty, gridSize);
  var direction;
  if (from[0] - to[0] === 1) {
    direction = "down";
  } else if (from[0] - to[0] === -1) {
    direction = "up";
  } else if (from[1] - to[1] === 1) {
    direction = "right";
  } else if (from[1] - to[1] === -1) {
    direction = "left";
  }
  return direction;
};

window.Solver = Solver;
module.exports = Solver;
