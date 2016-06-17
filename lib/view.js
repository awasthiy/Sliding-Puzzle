var View = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.setupBoard();
  this.bindEvents();
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
    alert("Invalid move! Try again.");
    return;
  }

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
};


module.exports = View;
