describe("Game", function() {
  
  beforeEach(function() {
    defaultGame = new Game();
    game = new Game("0000020200000000");
  });

  describe("board initialization", function(){

    it("should create a random board when passed no arguments", function() {
      expect(typeof(defaultGame.board)).toEqual('object');
      expect(defaultGame.board.length).toEqual(16);
    });

    it("should create the given board when that argument is passed", function() {
      expect(game.board).toEqual([0,0,0,0,0,2,0,2,0,0,0,0,0,0,0,0]);
    });

  });

  describe("board transformations", function(){

    describe("toString()", function(){

      it("should display the board in a multi-row string", function() {
        expect(game.toString()).toEqual("0000\n0202\n0000\n0000");
      });

      it("should account for multi-digit values when displaying the board as a string", function() {
        game.board = [0,16,32,64,0,0,0,2,128,0,0,4,8,16,0,256]
        expect(game.toString()).toEqual("0163264\n0002\n128004\n8160256");
      });

    });

    describe("toArray()", function(){

      it("should display the board as a nested array of values", function() {
        expect(game.toArray()).toEqual([[0,0,0,0],[0,2,0,2],[0,0,0,0],[0,0,0,0]]);
      });

    });

    describe("mirroredRows()", function(){

      it("should reverse the order of each row in a given board", function(){
        game.board = [0,2,4,8,0,2,0,2,0,0,16,0,128,64,32,16]
        expect(game.mirroredRows()).toEqual([[8,4,2,0],[2,0,2,0],[0,16,0,0],[16,32,64,128]])
      });

    });

    describe("rotateClock()", function(){

      it("should transpose the board 90 degrees clockwise", function(){
        game.board = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        expect(game.rowsRotatedClock()).toEqual([[12,8,4,0],[13,9,5,1],[14,10,6,2],[15,11,7,3]])
      });

    });

    describe("rotateCounterClock()", function(){

      it("should be able to transpose the board 90 degrees counter-clockwise", function(){
        game.board = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        expect(game.rowsRotatedCounterClock()).toEqual([[3,7,11,15],[2,6,10,14],[1,5,9,13],[0,4,8,12]])
      });

    });

  });

  describe("game moves", function(){
  
    describe("move('right')", function(){

      it("should merge adjacent or 0-separated values in the same row when moved right, and place another 2 somewhere on the board", function() {
        game.move('right');
        expect(game.board[7]).toEqual(4);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid rightward move when the rightmost square is a 0", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0]
        game.move('right');
        expect(game.board[15]).toEqual(4);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid rightward move when the innermost squares are 0s", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2] 
        game.move('right');
        expect(game.board[15]).toEqual(4);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid rightward move when the square directly to the right of a valid merge has a higher values than the mergers", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,4]
        game.move('right');
        expect(game.board[15]).toEqual(4);
        expect(game.board[14]).toEqual(4);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute valid rightward merges one step at a time (instead of treating in-process merges as valid mergeable values)", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,0,0,2,4,2,2]
        game.move('right');
        expect(game.board[15]).toEqual(4);
        expect(game.board[14]).toEqual(4);
        expect(game.board[13]).toEqual(2);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(2);
      });

      it("should execute a valid rightward move when the square to the right of a valid merge and a zero has a higher value than the mergers", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,4]
        game.move('right');
        expect(game.board[15]).toEqual(4);
        expect(game.board[14]).toEqual(4);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid rightward move when the added values are more than one digit long", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,0,0,16,16,0,4]
        game.move('right');
        expect(game.board[15]).toEqual(4);
        expect(game.board[14]).toEqual(32);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid rightward move when the board has various rightward merges to do", function() {
        game.board = [0,0,4,4,2,2,4,2,2,128,256,2,8,8,16,0]
        game.move('right');
        expect(game.board[3]).toEqual(8);
        expect(game.board[5]).toEqual(4);
        expect(game.board[6]).toEqual(4);
        expect(game.board[9]).toEqual(128);
        expect(game.board[10]).toEqual(256);
        expect(game.board[14]).toEqual(16);
        expect(game.board[15]).toEqual(16);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(4);
      });

    });

    describe("move('left')", function(){

      it("should merge adjacent or 0-separated values in the same row when moved left, and place another 2 somewhere on the board", function() {
        game.move('left');
        expect(game.board[4]).toEqual(4);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid leftward move when the lefttmost square is a 0", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2]
        game.move('left');
        expect(game.board[12]).toEqual(4);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid leftward move when the innermost squares are 0s", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2] 
        game.move('left');
        expect(game.board[12]).toEqual(4);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid leftward move when squares to the left of a valid merge have higher values than the mergers", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,0,0,4,0,2,2]
        game.move('left');
        expect(game.board[12]).toEqual(4);
        expect(game.board[13]).toEqual(4);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid leftward move when the added values are more than one digit long", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,0,0,16,16,0,4]
        game.move('left');
        expect(game.board[13]).toEqual(4);
        expect(game.board[12]).toEqual(32);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid leftward move when the board has various leftward merges to do", function() {
        game.board = [0,0,4,4,2,2,4,2,2,128,256,2,8,8,16,0]
        game.move('left');
        expect(game.board[0]).toEqual(8);
        expect(game.board[4]).toEqual(4);
        expect(game.board[5]).toEqual(4);
        expect(game.board[9]).toEqual(128);
        expect(game.board[10]).toEqual(256);
        expect(game.board[12]).toEqual(16);
        expect(game.board[13]).toEqual(16);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(4);
      });

    });

    describe("move('up')", function(){

      it("should merge adjacent or 0-separated values in the same row when moved up, and place another 2 somewhere on the board", function() {
        game.board = [0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0]
        game.move('up');
        expect(game.board[3]).toEqual(4);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid upward move when the upmost square is a 0", function() {
        game.board = [0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0]
        game.move('up');
        expect(game.board[3]).toEqual(4);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid upward move when the innermost squares are 0s", function() {
        game.board = [0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2] 
        game.move('up');
        expect(game.board[3]).toEqual(4);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid upward move when squares above a valid merge have higher values than the mergers", function() {
        game.board = [0,0,0,4,0,0,0,2,0,0,0,2,0,0,0,0]
        game.move('up');
        expect(game.board[3]).toEqual(4);
        expect(game.board[7]).toEqual(4);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid upward move when the added values are more than one digit long", function() {
        game.board = [0,0,0,4,0,0,0,16,0,0,0,16,0,0,0,0]
        game.move('up');
        expect(game.board[3]).toEqual(4);
        expect(game.board[7]).toEqual(32);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid upward move when the board has various upward merges to do", function() {
        game.board = [4,2,2,0,4,4,256,16,0,2,128,8,0,2,2,8]
        game.move('up');
        expect(game.board[0]).toEqual(8);
        expect(game.board[5]).toEqual(4);
        expect(game.board[9]).toEqual(4);
        expect(game.board[6]).toEqual(256);
        expect(game.board[10]).toEqual(128);
        expect(game.board[3]).toEqual(16);
        expect(game.board[7]).toEqual(16);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(4);
      });

    });

    describe("move('down')", function(){

      it("should merge adjacent or 0-separated values in the same row when moved down, and place another 2 somewhere on the board", function() {
        game.board = [0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0]
        game.move('down');
        expect(game.board[14]).toEqual(4);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid downward move when the downmost square is a 0", function() {
        game.board = [0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0]
        game.move('down');
        expect(game.board[14]).toEqual(4);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid downward move when the innermost squares are 0s", function() {
        game.board = [0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0] 
        game.move('down');
        expect(game.board[14]).toEqual(4);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid downward move when squares below a valid merge have higher values than the mergers", function() {
        game.board = [0,0,0,0,0,0,2,0,0,0,2,0,0,0,4,0]
        game.move('down');
        expect(game.board[14]).toEqual(4);
        expect(game.board[10]).toEqual(4);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid downward move when the added values are more than one digit long", function() {
        game.board = [0,0,0,0,0,0,16,0,0,0,16,0,0,0,4,0]
        game.move('down');
        expect(game.board[14]).toEqual(4);
        expect(game.board[10]).toEqual(32);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(1);
      });

      it("should execute a valid downward move when the board has various downward merges to do", function() {
        game.board = [4,2,2,0,4,4,256,16,0,2,128,8,0,2,2,8]
        game.move('down');
        expect(game.board[12]).toEqual(8);
        expect(game.board[13]).toEqual(4);
        expect(game.board[9]).toEqual(4);
        expect(game.board[6]).toEqual(256);
        expect(game.board[10]).toEqual(128);
        expect(game.board[11]).toEqual(16);
        expect(game.board[15]).toEqual(16);
        expect(game.board.length).toEqual(16);
        expect(game.board.filter(function(value){ return value === 2}).length).toEqual(4);
      });

    });

  });

  describe("board checking", function() {

    describe("anyValidMoves()", function() {

      it("returns true for a brand new board", function() {
        expect(game.anyValidMoves()).toEqual(true);
      });

      it("returns true for a board with multiple zeroes", function() {
        expect(game.anyValidMoves()).toEqual(true);
      });

      it("returns true for a board with a zero in the middle", function() {
        game.board = [4,8,16,32,32,16,8,4,4,0,16,32,32,16,8,4];
        expect(game.anyValidMoves()).toEqual(true);
      });

      it("returns true for a board with a zero on an edge", function() {
        game.board = [4,8,16,32,32,16,8,0,4,8,16,32,32,16,8,4];
        expect(game.anyValidMoves()).toEqual(true);
      });

      it("returns true for a board with a possible horizontal merge", function() {
        game.board = [4,8,16,32,32,8,8,4,4,8,16,32,32,16,8,4];
        expect(game.anyValidMoves()).toEqual(true);
      });

      it("returns true for a board with a possible vertical merge", function() {
        game.board = [4,8,16,32,32,16,64,4,4,8,64,32,32,16,8,4];
        expect(game.anyValidMoves()).toEqual(true);
      });

      it("returns false for a board with no valid moves", function() {
        game.board = [4,8,16,32,32,16,8,4,4,8,16,32,32,16,8,4];
        expect(game.anyValidMoves()).toEqual(false);
      });

    })

  });

});