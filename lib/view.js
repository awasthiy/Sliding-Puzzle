var Game = require('./game');

var View = function (ctx) {
  this.ctx = ctx;
  this.setupWindow();
  this.newGame();
};

View.prototype.setupWindow = function () {
  $('#level').on('input change', function (event) {
    var gridSize = event.currentTarget.value;
    $('#rangeText').text('Grid Size: ' + gridSize + ' x ' + gridSize);
   });

  $("#new-game").submit(function (event) {
    event.preventDefault();
    this.newGame($('#level').val());
  }.bind(this));
};

View.prototype.newGame = function (gridSize) {
  this.ctx.removeClass('game-over');
  var $gridPuzzle = $('.grid-puzzle');
  $gridPuzzle.html('');
  var $gridSolution = $('.grid-solution');
  $gridSolution.html('');
  var $figcaption = $('.message');
  $figcaption.html('');
  clearInterval(this.timeDisplay);
  this.ctx.off("click");
  this.game = new Game(gridSize);
  this.bindEvents();
  this.time = new Date();
  this.setupBoard();
  this.timer();
};

View.prototype.bindEvents = function () {
  var $gridPuzzle = $('.grid-puzzle');
  $gridPuzzle.on('click', 'li', (function (event) {
    var $square = $(event.currentTarget);
    this.makeMove($square);
  }).bind(this));
};

View.prototype.makeMove = function ($square) {
  var pos = $square.data("pos");
  var value = $square.attr("value");
  var $oldEmpty = $(".empty");

  try {
    this.game.playMove(pos);
  } catch (e) {
    // alert("Invalid move! Try again.");
    return;
  }
  var $moves = $(".moves");
  $moves.html(parseInt($moves.html()) + 1);

  $square.removeAttr("value");
  $square.addClass('empty');
  $oldEmpty.attr("value", value);
  $oldEmpty.removeClass('empty');

  if (this.game.isOver()) {
    this.ctx.addClass('game-over');
    clearInterval(this.timeDisplay);
    this.ctx.off("click");
    var $figcaption = $(".message");
    $figcaption.html("You Win");
  }
};

View.prototype.setupBoard = function () {
  var $gridPuzzle = $('.grid-puzzle');
  var $gridSolution = $('.grid-solution');
  for (var rowIdx = 0; rowIdx < this.game.gridSize; rowIdx++) {
    var $ul = $('<ul>');
    var $sul = $('<ul>');

    for (var colIdx = 0; colIdx < this.game.gridSize; colIdx++) {
      var num = this.game.board.grid[rowIdx][colIdx];
      var snum = this.game.board.solution[rowIdx * this.game.gridSize + colIdx];
      var $li;
      if (num === null) {
        $li = $('<li></li>');
        $li.addClass('empty');
      } else {
        $li = $('<li value=' + num + '></li>');
      }
      $li.data('pos', [rowIdx, colIdx]);

      var $sli;
      if (snum === null) {
        $sli = $('<li></li>');
      } else {
        $sli = $('<li value=' + snum + '></li>');
      }

      $ul.append($li);
      $sul.append($sli);
    }

    $gridPuzzle.append($ul);
    $gridSolution.append($sul);
  }

  var $time = $(".time");
  $time.html(0);
  var $moves = $(".moves");
  $moves.html(0);
};

View.prototype.timer = function () {
  this.timeDisplay = setInterval(function () {
    var $time = $(".time");
    $time.html(Math.floor((new Date() - this.time) / 1000));
  }.bind(this), 1000);
};

module.exports = View;
