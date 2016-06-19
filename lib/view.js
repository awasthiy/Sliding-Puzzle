var Game = require('./game');

var View = function (ctx) {
  this.ctx = ctx;
  this.setupWindow();
  this.newGame();
};

View.prototype.setupWindow = function () {
  var $form = $('<form id="newGame">');
  var $input = $('<input id="level" type="range" min="3" max="6" step="1" value="3"/>');
  var $label = $('<p id="rangeText">Grid Size: 3 x 3</p>');
  var $submit = $('<input type="submit" value="New Game" />');
  $form.append($input);
  $form.append($label);
  $form.append($submit);
  var $div = $('<div>');
  $div.addClass('gameWindow');
  this.ctx.append($form);
  this.ctx.append($div);

  $('#level').on('input change', function (event) {
    var gridSize = event.currentTarget.value;
    $('#rangeText').text('Grid Size: ' + gridSize + ' x ' + gridSize);
   });

  $("#newGame").submit(function (event) {
    event.preventDefault();
    this.newGame($('#level').val());
  }.bind(this));
};

View.prototype.newGame = function (gridSize) {
  var $gameWindow = $('.gameWindow');
  $gameWindow.html('');
  clearInterval(this.timeDisplay);
  this.ctx.off("click");
  this.game = new Game(gridSize);
  this.bindEvents();
  this.time = new Date();
  this.setupBoard();
  this.timer();
};

View.prototype.bindEvents = function () {
  this.ctx.on('click', 'li', (function (event) {
    var $square = $(event.currentTarget);
    this.makeMove($square);
  }).bind(this));
};

View.prototype.makeMove = function ($square) {
  var pos = $square.data("pos");
  var value = $square.html();
  var $oldEmpty = $(".empty");

  try {
    this.game.playMove(pos);
  } catch (e) {
    // alert("Invalid move! Try again.");
    return;
  }
  var $moves = $(".moves");
  $moves.html(parseInt($moves.html()) + 1);

  $square.html('');
  $square.addClass('empty');
  $oldEmpty.html(value);
  $oldEmpty.removeClass('empty');

  if (this.game.isOver()) {
    clearInterval(this.timeDisplay);
    this.ctx.off("click");
    var $figcaption = $("<figcaption>");
    $figcaption.html("You Win");
    var $gameWindow = $('.gameWindow');
    $gameWindow.append($figcaption);
  }
};

View.prototype.setupBoard = function () {
  var $div = $('<div>');
  var $solutionDiv = $('<div>');
  $div.addClass('grid-puzzle');
  $solutionDiv.addClass('grid-solution');
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
        $li = $('<li>' + num + '</li>');
      }
      $li.data('pos', [rowIdx, colIdx]);

      var $sli;
      if (snum === null) {
        $sli = $('<li></li>');
      } else {
        $sli = $('<li>' + snum + '</li>');
      }

      $ul.append($li);
      $sul.append($sli);
    }

    $div.append($ul);
    $solutionDiv.append($sul);
  }
  var $gameWindow = $('.gameWindow');

  $gameWindow.append($div);
  $gameWindow.append($solutionDiv);
  var $movesDiv = $('<div>Moves: </div>');
  var $moves = $("<p>0</p>");
  $moves.addClass('moves');
  $movesDiv.append($moves);
  $gameWindow.append($movesDiv);
  var $timeDiv = $('<div>time: </div>');
  var $time = $("<p>0</p>");
  $time.addClass('time');
  $timeDiv.append($time);
  $gameWindow.append($timeDiv);
};

View.prototype.timer = function () {
  this.timeDisplay = setInterval(function () {
    var $time = $(".time");
    $time.html(Math.floor((new Date() - this.time) / 1000));
  }.bind(this), 1000);
};

module.exports = View;
