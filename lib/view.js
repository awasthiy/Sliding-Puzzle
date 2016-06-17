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
  var $oldEmpty = $("<li></li>")[0];

  try {
    this.game.playMove(pos);
  } catch (e) {
    alert("Invalid move! Try again.");
    return;
  }

  var $newEmpty = $("li[pos='[" + pos +"]']");
  $newEmpty.html('');
  $oldEmpty.html(value);

  if (this.game.isOver()) {
    this.$el.off("click");
    // this.$el.addClass("game-over");

    var $figcaption = $("<figcaption>");

    $figcaption.html("You Win");

    this.$el.append($figcaption);
  }

};

View.prototype.setupBoard = function () {
  var $div = $('<div>');
  $div.addClass('grid-puzzle');

  for (var rowIdx = 0; rowIdx < this.game.gridSize; rowIdx++) {
    var $ul = $('<ul>');
    // $ul.addClass('group');
    for (var colIdx = 0; colIdx < this.game.gridSize; colIdx++) {
      var num = this.game.board.grid[rowIdx][colIdx];
      disp = num === null ? '' : num;
      var $li = $('<li>' + disp + '</li>');
      $li.data('pos', [rowIdx, colIdx]);
      // $li.data('value', num);

      $ul.append($li);
    }
    $div.append($ul);
  }
  this.ctx.append($div);
};


module.exports = View;
