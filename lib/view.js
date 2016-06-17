var View = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.time = new Date();
  this.setupBoard();
  this.bindEvents();
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
    this.ctx.off("click");
    var $figcaption = $("<figcaption>");
    $figcaption.html("You Win");
    this.ctx.append($figcaption);
  }
};

View.prototype.setupBoard = function () {
  var $div = $('<div>');
  $div.addClass('grid-puzzle');
  for (var rowIdx = 0; rowIdx < this.game.gridSize; rowIdx++) {
    var $ul = $('<ul>');
    for (var colIdx = 0; colIdx < this.game.gridSize; colIdx++) {
      var num = this.game.board.grid[rowIdx][colIdx];
      var $li;
      if (num === null) {
        $li = $('<li></li>');
        $li.addClass('empty');
      } else {
        $li = $('<li>' + num + '</li>');
      }
      $li.data('pos', [rowIdx, colIdx]);
      $ul.append($li);
    }
    $div.append($ul);
  }
  this.ctx.append($div);
  var $movesDiv = $('<div>Moves: </div>');
  var $moves = $("<p>0</p>");
  $moves.addClass('moves');
  $movesDiv.append($moves);
  this.ctx.append($movesDiv);
  var $timeDiv = $('<div>time: </div>');
  var $time = $("<p>0</p>");
  $time.addClass('time');
  $timeDiv.append($time);
  this.ctx.append($timeDiv);
};

View.prototype.timer = function () {
  setInterval(function () {
    var $time = $(".time");
    $time.html(Math.floor((new Date() - this.time) / 1000));
  }.bind(this), 1000);
};


module.exports = View;
