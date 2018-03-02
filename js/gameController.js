GameController = function () {
  this.game = new Game();
  this.view = new GameView();
}

GameController.prototype.addListeners = function () {
  Mousetrap.bind('right', this.triggerMoveRight.bind(this));
  Mousetrap.bind('left', this.triggerMoveLeft.bind(this));
  Mousetrap.bind('up', this.triggerMoveUp.bind(this));
  Mousetrap.bind('down', this.triggerMoveDown.bind(this));
  Mousetrap.bind('space', this.resetGame.bind(this));
}

GameController.prototype.renderBoard = function () {
  this.view.drawBoard(this.game.toArray());
  this.checkForGameOver();
}

GameController.prototype.triggerMoveRight = function () {
  event.preventDefault();
  this.game.move('right');
  this.renderBoard();
}

GameController.prototype.triggerMoveLeft = function () {
  event.preventDefault();
  this.game.move('left');
  this.renderBoard();
}

GameController.prototype.triggerMoveUp = function () {
  event.preventDefault();
  this.game.move('up');
  this.renderBoard();
}

GameController.prototype.triggerMoveDown = function () {
  event.preventDefault();
  this.game.move('down');
  this.renderBoard();
}

GameController.prototype.checkForGameOver = function () {
  if (this.game.anyValidMoves()) {
    return false;
  } else {
    this.endGame();
  }
}

GameController.prototype.endGame = function () {
  alert("No more valid moves!\nThanks for playing.\nPress the spacebar to begin a new game.")
  return true;
}

GameController.prototype.resetGame = function () {
  event.preventDefault();
  this.game = new Game();
  this.renderBoard();
}
