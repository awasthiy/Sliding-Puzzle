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
