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
	  // var $gameWindow = $('.game-window');
	  // $gameWindow.html('');
	  var $gridPuzzle = $('.grid-puzzle');
	  $gridPuzzle.html('');
	  var $gridSolution = $('.grid-solution');
	  $gridSolution.html('');
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
	    var $gameWindow = $('.game-window');
	    $gameWindow.append($figcaption);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MoveError = __webpack_require__(4);
	
	function Board (gridSize) {
	  this.gridSize = gridSize;
	  this.solution = Board.tileContent(this.gridSize);
	  this.grid = this.makeGrid(Board.makeSolvable(this.solution));
	}
	
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
	
	Board.prototype.makeGrid = function (array) {
	  var grid = [];
	
	  for (var i = 0; i < this.gridSize; i++) {
	    grid.push([]);
	    for (var j = 0; j < this.gridSize; j++) {
	      grid[i].push(array[i * this.gridSize + j]);
	    }
	  }
	
	  return grid;
	};
	
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
	  return this.solution.toString() === this.grid.flatten().toString();
	};
	
	Array.prototype.flatten = function () {
	  return this.reduce(function (a, b) {
	    return a.concat(b);
	  });
	};
	
	Board.prototype.surroundingPositions = function (pos) {
	  var positions = [];
	  positions.push([pos[0] + 1, pos[1]]);
	  positions.push([pos[0] - 1, pos[1]]);
	  positions.push([pos[0], pos[1] + 1]);
	  positions.push([pos[0], pos[1] - 1]);
	  return  positions.filter(function (pos) {
	    return this.isValidPos(pos);
	  }.bind(this));
	};
	
	Board.prototype.isValidPos = function (pos) {
	  return (
	    (0 <= pos[0]) && (pos[0] < this.gridSize) && (0 <= pos[1]) && (pos[1] < this.gridSize)
	  );
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
	
	Board.prototype.isValidMove = function (pos, emptyPosition) {
	  var positionsSurroundingEmpty = this.surroundingPositions(emptyPosition);
	  return indexOfArray(pos, positionsSurroundingEmpty) !== -1;
	};
	
	Board.prototype.emptyPosition = function () {
	  var flattenedGrid = this.grid.flatten();
	  var emptyPosition = flattenedGrid.indexOf(null);
	  emptyPosition = [
	    Math.floor(emptyPosition / this.gridSize),
	    emptyPosition % this.gridSize
	  ];
	  return emptyPosition;
	};
	
	Board.prototype.move = function (pos) {
	  var emptyPosition = this.emptyPosition();
	  if (!this.isValidMove(pos, emptyPosition)) {
	    throw new MoveError("Is not valid position");
	  }
	  this.grid[emptyPosition[0]][emptyPosition[1]] = this.grid[pos[0]][pos[1]];
	  this.grid[pos[0]][pos[1]] = null;
	};
	
	module.exports = Board;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function MoveError (msg) {
	  this.msg = msg;
	}
	
	module.exports = MoveError;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map