var Board = require('./board');

function Game (gridSize) {
  this.gridSize = gridSize || 3;
  this.board = new Board(this.gridSize);
}

// Game.prototype.isValidMove = function (tileIdx) {
//
// };

Game.prototype.playMove = function (pos) {
  this.board.move(pos);
};

Game.prototype.isOver = function () {
  return this.board.isOver();
};

module.exports = Game;
