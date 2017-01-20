/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	var Board = __webpack_require__(3);
	
	$(function () {
	  var canvasEl = $('.game-window');
	  new View(canvasEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	
	var View = function () {
	  this.$gridPuzzle = $('.grid-puzzle');
	  this.$gridSolution = $('.grid-solution');
	  this.$figcaption = $('.message');
	  this.$time = $(".time");
	  this.$moves = $(".moves");
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
	    this.newGame(parseInt($('#level').val()));
	  }.bind(this));
	};
	
	View.prototype.newGame = function (gridSize) {
	  this.$gridPuzzle.removeClass('game-over');
	  this.$gridPuzzle.html('');
	  this.$gridSolution.html('');
	  this.$figcaption.html('');
	  clearInterval(this.timeDisplay);
	  this.$gridPuzzle.off("click");
	  this.game = new Game(gridSize);
	  this.bindEvents();
	  this.time = new Date();
	  this.setupBoard();
	  this.timer();
	};
	
	View.prototype.bindEvents = function () {
	  this.$gridPuzzle.on('click', 'li', (function (event) {
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
	  this.$moves.html(parseInt(this.$moves.html()) + 1);
	
	  $square.removeAttr("value");
	  $square.addClass('empty');
	  $oldEmpty.attr("value", value);
	  $oldEmpty.removeClass('empty');
	
	  if (this.game.isOver()) {
	    this.$gridPuzzle.addClass('game-over');
	    clearInterval(this.timeDisplay);
	    this.$gridPuzzle.off("click");
	    this.$figcaption.html("You Win");
	  }
	};
	
	View.prototype.setupBoard = function () {
	  for (var rowIdx = 0; rowIdx < this.game.gridSize; rowIdx++) {
	    var $ul = $('<ul>');
	    var $sul = $('<ul>');
	
	    for (var colIdx = 0; colIdx < this.game.gridSize; colIdx++) {
	      var num = this.game.board.grid[rowIdx * this.game.gridSize + colIdx];
	      var snum = this.game.board.solution[rowIdx * this.game.gridSize + colIdx];
	      var $li;
	      if (num === null) {
	        $li = $('<li></li>');
	        $li.addClass('empty');
	      } else {
	        $li = $('<li value=' + num + '></li>');
	      }
	      $li.data('pos', rowIdx * this.game.gridSize + colIdx);
	
	      var $sli;
	      if (snum === null) {
	        $sli = $('<li></li>');
	      } else {
	        $sli = $('<li value=' + snum + '></li>');
	      }
	
	      $ul.append($li);
	      $sul.append($sli);
	    }
	
	    this.$gridPuzzle.append($ul);
	    this.$gridSolution.append($sul);
	  }
	
	  this.$time.html(0);
	  this.$moves.html(0);
	};
	
	View.prototype.timer = function () {
	  this.timeDisplay = setInterval(function () {
	    this.$time.html(Math.floor((new Date() - this.time) / 1000));
	  }.bind(this), 1000);
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	var Solver = __webpack_require__(5);
	
	function Game (gridSize) {
	  this.gridSize = gridSize || 3;
	  this.board = new Board(this.gridSize);
	  window.game = this;
	}
	
	Game.prototype.playMove = function (pos) {
	  this.board.move(pos);
	};
	
	Game.prototype.isOver = function () {
	  return this.board.isOver();
	};
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MoveError = __webpack_require__(4);
	
	function Board (gridSize) {
	  if (gridSize) {
	    this.gridSize = gridSize;
	    this.solution = Board.tileContent(this.gridSize);
	    this.grid = Board.makeSolvable(this.solution);
	    this.emptyPosition = this.grid.indexOf(null);
	    this.initialGrid = this.grid.slice(0);
	  }
	}
	
	Board.prototype.duplicate = function (fresh) {
	  var newGrid = fresh ? this.initialGrid : this.grid.slice(0);
	  var newBoard = new Board();
	  newBoard.gridSize = this.gridSize;
	  newBoard.solution = this.solution;
	  newBoard.grid = newGrid;
	  newBoard.emptyPosition = this.emptyPosition;
	  newBoard.initialGrid = this.initialGrid;
	  return newBoard;
	};
	
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
	
	Board.makeSolvable = function (array) {
	  var tileArray = shuffleArray(array);
	  if (Board.isSolvable(tileArray)) {
	    return tileArray;
	  } else {
	    return Board.makeSolvable(tileArray);
	  }
	};
	
	Board.tileContent = function (gridSize) {
	  var tileRange = [];
	  for (var i = 1; i < Math.pow(gridSize, 2); i++) {
	    tileRange.push(i);
	  }
	  tileRange.push(null);
	  return tileRange;
	};
	
	Board.isSolvable = function (tileArray) {
	  var parity = 0;
	  var row = 0;
	  var gridSize = Math.sqrt(tileArray.length);
	  var blankRow = 0;
	
	  for (var i = 0; i < tileArray.length; i++) {
	    if (i % gridSize === 0) {
	      row++;
	    }
	
	    if (tileArray[i] === null) {
	      blankRow = row;
	    }
	
	    for (var j = i + 1; j < tileArray.length; j++) {
	      if (tileArray[i] > tileArray[j] && tileArray[j] !== null) {
	        parity++;
	      }
	    }
	  }
	
	  if (gridSize % 2 === 0 && blankRow % 2 !== 0) {
	    return parity % 2 !== 0;
	  } else {
	    return parity % 2 === 0;
	  }
	};
	
	Board.prototype.isOver = function () {
	  return this.solution.toString() === this.grid.toString();
	};
	
	Board.prototype.surroundingPositions = function (pos) {
	  var positions = [];
	  positions.push(pos + 1);
	  positions.push(pos - 1);
	  positions.push(pos + this.gridSize);
	  positions.push(pos - this.gridSize);
	  return  positions.filter(function (pos) {
	    return this.isValidPos(pos);
	  }.bind(this));
	};
	
	Board.prototype.isValidPos = function (pos) {
	  return 0 <= pos && pos < Math.pow(this.gridSize, 2);
	};
	
	Board.prototype.validMoves = function () {
	  return this.surroundingPositions(this.emptyPosition);
	};
	
	Board.prototype.isValidMove = function (pos) {
	  return this.validMoves().includes(pos);
	};
	
	Board.prototype.move = function (pos) {
	  if (!this.isValidMove(pos)) {
	    throw new MoveError("Is not valid position");
	  }
	  this.grid[this.emptyPosition] = this.grid[pos];
	  this.emptyPosition = pos;
	  this.grid[pos] = null;
	};
	
	module.exports = Board;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function MoveError (msg) {
	  this.msg = msg;
	}
	
	module.exports = MoveError;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	var PuzzleNode = __webpack_require__(6);
	
	function Solver(board) {
	  this.visited = [board.grid];
	}
	
	Solver.prototype.findSolution = function () {
	
	};
	
	Solver.prototype.visitedBoard = function (board) {
	  return indexOfArray(board.grid, this.visited) !== -1;
	};
	
	function indexOfArray(val, array) {
	  var
	    hash = {},
	    indexes = {},
	    i, j;
	  for(i = 0; i < array.length; i++) {
	    hash[array[i]] = i;
	  }
	  return (hash.hasOwnProperty(val)) ? hash[val] : -1;
	}
	
	Solver.prototype.possibleBoards = function (board) {
	  var boards = [];
	  board.validMoves().forEach(function(pos) {
	    var newBoard = board.duplicate();
	    newBoard.move(pos);
	    if (!this.visitedBoard(newBoard)) {
	      boards.push(newBoard);
	      this.visited.push(newBoard.grid);
	    }
	  }.bind(this));
	  return boards;
	};
	
	window.Solver = Solver;
	module.exports = Solver;


/***/ },
/* 6 */
/***/ function(module, exports) {

	function PuzzleNode(board) {
	  this.board = board;
	  this.parent = null;
	  this.children = [];
	}
	
	PuzzleNode.prototype.setParent = function (parent) {
	  this.parent = parent;
	  if (this.parent) this.parent.children.push(this);
	};
	
	PuzzleNode.prototype.addChild = function (child) {
	  child.setParent(this);
	};
	
	module.exports = PuzzleNode;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map