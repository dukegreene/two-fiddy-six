var controller;

$(document).ready(function () {
  controller = new GameController();
  console.log(controller.game.toString());
  controller.addListeners();
  controller.renderBoard();
});


