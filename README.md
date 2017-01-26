# Sliding Puzzle

[Play Here](http://ericmoy.me/Sliding-Puzzle)

## Screenshots

[![Game View](/assets/Sliding-Puzzle.png)](http://ericmoy.me/Sliding-Puzzle)

[![Solver View](/assets/puzzle-solver.png)](http://ericmoy.me/Sliding-Puzzle)

## How to Play

- The goal of the game is to arrange the tiles in order (as shown in the `Goal`)
- Click on the tile you want to move; it will shift to the empty spot
- To use solver, first start a game
  - To progress through steps you can click play, drag slider, or click through in the list

## Languages

- JavaScript
- jQuery
- CSS3
- HTML

## Features and Implementation

- Object oriented programming in JavaScript
- Game state is stored in instance variables, preventing browser manipulation
```javascript
function Board (gridSize) {
  this.gridSize = gridSize;
  this.solution = Board.tileContent(this.gridSize);
  this.grid = this.makeGrid(Board.makeSolvable(this.solution));
}
```
- [Durstenfeld shuffle](http://en.wikipedia.org/wiki/Fisher-Yates_shuffle#The_modern_algorithm) (A computer-optimized version of Fisher-Yates) was used to provide randomized puzzles
```javascript
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
```
- Recursion was used to generate a solvable puzzle
```javascript
Board.makeSolvable = function (array) {
  var tileArray = shuffleArray(array);
  if (Board.isSolvable(tileArray)) {
    return tileArray;
  } else {
    return Board.makeSolvable(tileArray);
  }
};
```
- Implemented A* search algorithm to develop optimal solution
```javascript
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
```

## To-dos/Future Features

- Use images instead of numbers
- Implement sliding animation
- High scores
- Leaderboard
- User uploaded images
