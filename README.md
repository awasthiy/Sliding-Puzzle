# Sliding Puzzle

[Play Here](http://ericmoy.me/Sliding-Puzzle)

## Screenshot

[![Game View](/assets/Sliding-Puzzle.png)](http://ericmoy.me/Sliding-Puzzle)

## How to Play

- The goal of the game is to arrange the tiles in order (as shown in the `Goal`)
- Click on the tile you want to move; it will shift to the empty spot

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

## To-dos/Future Features

- Use images instead of numbers
- Implement sliding animation
- High scores
- Leaderboard
- User uploaded images
