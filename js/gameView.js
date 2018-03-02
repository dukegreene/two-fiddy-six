GameView = function () {
}

GameView.prototype.drawBoard = function (board) {
  for (var i = 0; i < board.length; i++) {
    this.drawRow(board[i], i + 1);
  }
  return board
}

GameView.prototype.drawRow = function (rowValues, id) {
  let rowHTML = '<ul class="row-cells">'
  for (var i = 0; i < rowValues.length; i++) {
    rowHTML += this.drawCell(rowValues[i]);
  }
  rowHTML += '</ul>'
  $("#row-" + id).html(rowHTML);
  return rowHTML;
}

GameView.prototype.drawCell = function (value) {
  return '<li class="cell">' + value + '</li>'
}