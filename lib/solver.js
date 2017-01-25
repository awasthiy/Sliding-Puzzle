var Board = require("./board");
var PuzzleNode = require("./puzzle_node");
var PriorityQueue = require("./priority_queue");

function Solver(board) {
  var solverBoard = board.duplicate();
  this.solution = findSolution(solverBoard);
}

function possibleBoards(board) {
  return board.validMoves().map(function(pos) {
    var newBoard = board.duplicate();
    newBoard.move(pos);
    return newBoard;
  });
}

function manhattanDistace(board) {
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
}

function findSolution(board) {
  if (board.gridSize > 3) return [];
  var visited = {};
  visited[board.grid] = true;
  var rootNode = new PuzzleNode(board);
  rootNode.priority = manhattanDistace(rootNode.board);
  var boardQueue = new PriorityQueue([rootNode]);
  var currentNode = boardQueue.pop();
  var solved;
  while (currentNode) {
    var currentBoard = currentNode.board;
    if (currentBoard.isOver()) {
      solved = currentNode;
      break;
    }
    var nextBoards = filterVisited(possibleBoards(currentBoard), visited);
    boardQueue.add(nextBoards.map(function (board) {
      var nextNode = new PuzzleNode(board);
      nextNode.distance = currentNode.distance + 1;
      nextNode.priority = nextNode.distance + manhattanDistace(nextNode.board);
      nextNode.move = Board.moveInfo(currentBoard.emptyPosition, board.emptyPosition, board);
      nextNode.setParent(currentNode);
      return nextNode;
    }));
    currentNode = boardQueue.pop();
  }
  return solved ? traceBack(solved) : [];
}

function filterVisited(boards, visited) {
  return boards.filter(function(board) {
    var isVisited = !visited[board.grid];
    visited[board.grid] = true;
    return isVisited;
  });
}

function traceBack(endNode) {
  var nodes = [];
  var currentNode = endNode;
  while (currentNode) {
    nodes.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return nodes;
}

function solutionString(solution) {
  return solution.map(function(node) {
    return node.moveString();
  });
}

window.Solver = Solver;
module.exports = Solver;
