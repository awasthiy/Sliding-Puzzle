var View = require('./view');
var Game = require('./game');
var Board = require('./board');

$(function () {
  var canvasEl = $('.game-board');
  var game = new Game();
  new View(game, canvasEl);
});
