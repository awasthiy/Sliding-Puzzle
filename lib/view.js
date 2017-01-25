var Game = require('./game');
var _solutionNodes;
var _playing;

var View = function () {
  this.$gridPuzzle = $('#grid-puzzle');
  this.$gridSolution = $('#grid-solution');
  this.$time = $(".time");
  this.$moves = $(".moves");
  this.$modal = $("#solution-modal");
  this.$puzzleSolution = $("#puzzle-solution");
  this.setupWindow();
};

View.prototype.setupWindow = function () {
  $('#level').on('input change', function (event) {
    var gridSize = event.currentTarget.value;
    $('#rangeText').text('Grid Size: ' + gridSize + ' x ' + gridSize);
   });

  $("#new-game").click(function (event) {
    event.preventDefault();
    this.newGame(parseInt($('#level').val()));
  }.bind(this));

  $("#solver").click(function (event) {
    this.$modal.css('display', 'flex');
    this.solvePuzzle();
  }.bind(this));

  $("#solution-modal-close").click(function (event) {
    this.handleCloseModal();
  }.bind(this));

  $(window).click(function(event) {
    if (this.$modal.is(event.target)) {
      this.handleCloseModal();
    } else if ($.contains(this.$modal[0], event.target) && this.$solverSteps) {
      this.$solverSteps.focus();
    }
  }.bind(this));
};

View.prototype.handleCloseModal = function () {
  this.$modal.hide();
  if (this.$gridSolver) this.handleStopPlay();
};

View.prototype.newGame = function (gridSize) {
  this.$gridPuzzle.removeClass('game-over');
  this.$gridPuzzle.html('');
  this.$gridSolution.html('');
  clearInterval(this.timeDisplay);
  this.$gridPuzzle.off("click");
  this.game = new Game(gridSize);
  this.bindEvents();
  this.time = new Date();
  this.setupBoard(this.$gridPuzzle, this.game.board.grid);
  this.setupBoard(this.$gridSolution, this.game.board.solution);
  this.$time.html(0);
  this.$moves.html(0);
  this.timer();
};

View.prototype.bindEvents = function () {
  this.$gridPuzzle.on('click', 'li', (function (event) {
    var $tile = $(event.currentTarget);
    this.gameMove($tile);
  }).bind(this));
};

View.prototype.gameMove = function ($tile) {
  var pos = $tile.data("pos");

  try {
    this.game.playMove(pos);
  } catch (e) {
    // alert("Invalid move! Try again.");
    return;
  }

  View.domMove($tile, this.$gridPuzzle);
  this.$moves.html(parseInt(this.$moves.html()) + 1);

  if (this.game.isOver()) {
    this.$gridPuzzle.addClass('game-over');
    clearInterval(this.timeDisplay);
    this.$gridPuzzle.off("click");
  }
};

View.domMove = function($tile, $board) {
  var value = $tile.attr("value");
  var $oldEmpty = $board.find(".empty");
  $tile.removeAttr("value");
  $tile.addClass('empty');
  $oldEmpty.attr("value", value);
  $oldEmpty.removeClass('empty');
};

View.prototype.setupBoard = function ($board, gridArray) {
  $board.html('');
  for (var rowIdx = 0; rowIdx < this.game.gridSize; rowIdx++) {
    var $ul = $('<ul>');

    for (var colIdx = 0; colIdx < this.game.gridSize; colIdx++) {
      var num = gridArray[rowIdx * this.game.gridSize + colIdx];
      var $li;
      if (num === null) {
        $li = $('<li></li>');
        if ($board !== this.$gridSolution) $li.addClass('empty');
      } else {
        $li = $('<li value=' + num + '></li>');
      }
      $li.data('pos', rowIdx * this.game.gridSize + colIdx);
      $ul.append($li);
    }

    $board.append($ul);
  }
};

View.prototype.timer = function () {
  this.timeDisplay = setInterval(function () {
    this.$time.html(Math.floor((new Date() - this.time) / 1000));
  }.bind(this), 1000);
};

View.prototype.solvePuzzle = function () {
  if (this.game) {
    if (!this.$gridSolver) this.setupSolver();
    _solutionNodes = this.game.getSolution();
    this.$solverSteps.attr("max", _solutionNodes.length - 1);
    this.$solverSteps.val(0);
    this.setupBoard(this.$gridSolver, this.game.initialBoard.grid);
    this.$solverSteps.focus();
    var stepWord = (_solutionNodes.length - 1) === 1 ? 'step' : 'steps';
    this.$solverCount.html(`${_solutionNodes.length - 1} ${stepWord}`);
    this.setupSolverDetail();
  }
};

View.prototype.setupSolver = function () {
  this.$puzzleSolution.html('');
  this.$gridSolver = $('<div id="grid-solver">');
  this.$solverSteps = $('<input id="solver-steps" type="range" min="0" value="0" step="1">');
  this.$solverPlay = $('<input id="solver-play" class="button" type="button" value="Play">');
  this.$solverCount = $('<h3>');
  this.$solverText = $('<div id="solver-text">');
  this.$puzzleSolution
    .append(this.$gridSolver)
    .append(this.$solverCount)
    .append(
      $('<div id="solver-detail"><h2>Solution:</h2></div>')
        .append(this.$solverCount)
        .append(this.$solverText)
    )
    .append(
      $('<div id="play-div">')
        .append(this.$solverSteps)
        .append(this.$solverPlay)
    );


  this.$solverSteps.on('input', function (event) {
    var step = parseInt(event.currentTarget.value);
    this.setupBoard(this.$gridSolver, _solutionNodes[step].board.grid);
   }.bind(this));

  this.$solverSteps.on('change', function (event) {
    if (_playing) {
      this.$solverPlay.val('Pause');
    } else if (parseInt(this.$solverSteps.val()) === parseInt(this.$solverSteps.attr("max"))) {
      this.$solverPlay.val('Replay');
    } else {
      this.$solverPlay.val('Play');
    }
  }.bind(this));

  this.$solverPlay.click(function (event) {
    if (_playing) {
      this.handleStopPlay();
    } else {
      this.$solverPlay.val('Pause');
      if (parseInt(this.$solverSteps.val()) === parseInt(this.$solverSteps.attr("max"))) {
        this.$solverSteps.val(0);
        this.$solverSteps.trigger('input');
      }
      _playing = setInterval(function () {
        if (parseInt(this.$solverSteps.val()) === parseInt(this.$solverSteps.attr("max"))) {
          this.handleStopPlay('Replay');
        } else {
          this.$solverSteps.val(parseInt(this.$solverSteps.val()) + 1);
          this.$solverSteps.trigger('input');
        }
      }.bind(this), 450);
    }
  }.bind(this));

  this.$solverText.on('click', 'li', function (event) {
    var $li = $(event.target).closest('li');
    this.$solverSteps.val($li.data('step'));
    this.$solverSteps.trigger('input');
  }.bind(this));
};

View.prototype.handleStopPlay = function (buttonText = 'Play') {
  clearInterval(_playing);
  _playing = false;
  this.$solverPlay.val(buttonText);
};

View.prototype.setupSolverDetail = function () {
  this.$solverText.html('');
  var $ul = $('<ul>');

  _solutionNodes.forEach(function(node, index) {
    $ul.append(
      $('<li>')
        .data('step', index)
        .html(node.moveString())
        .prepend(
          $('<span>')
            .html(index+'.')
          )
    );
  });

  this.$solverText.append($ul);
};

module.exports = View;
