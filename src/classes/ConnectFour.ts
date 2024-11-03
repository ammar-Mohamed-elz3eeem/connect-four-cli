import Cursor from "./Cursor";
import Screen from "./Screen";

export default class ConnectFour {
	/**
	 * This is a symbol indicating the player turn it is either
	 * X or O.
	 */
	private playerTurn: "X" | "O";

	/**
	 * This is the initial game grid.
	 */
	private grid: string[][];

	/**
	 * This is the cursor that is pointing to the game board
	 * at the row zero and column zero and is used to move the
	 * cursor around the game board to the left or to the right.
	 */
	private cursor: Cursor;

	/**
	 * This is the default constructor for the ConnectFour game.
	 */
	constructor() {
		this.playerTurn = "O";
		this.grid = [
			[" ", " ", " ", " ", " ", " ", " "],
			[" ", " ", " ", " ", " ", " ", " "],
			[" ", " ", " ", " ", " ", " ", " "],
			[" ", " ", " ", " ", " ", " ", " "],
			[" ", " ", " ", " ", " ", " ", " "],
			[" ", " ", " ", " ", " ", " ", " "],
		];
		this.cursor = new Cursor(6, 7);

		// Initialize a 6x7 connect-four grid
		Screen.initialize(6, 7);
		Screen.setGridLines(true);

		// Replace this with real commands
		// Screen.addCommand('t', 'test command (remove)', ConnectFour.testCommand);
		Screen.addCommand(
			"left",
			"move disc to the left",
			this.cursor.left.bind(this.cursor)
		);
		Screen.addCommand(
			"right",
			"move disc to the right",
			this.cursor.right.bind(this.cursor)
		);
		Screen.addCommand("return", "drop the disc to the board", () => {
			const row = ConnectFour.dropDisc(
				this.cursor.row,
				this.cursor.col,
				this.playerTurn
			);
			if (ConnectFour.checkWin(Screen.grid)) {
				ConnectFour.endGame(this.playerTurn);
			} else {
				this.playerTurn = this.playerTurn === "X" ? "O" : "X";
			}
		});

		this.cursor.setBackgroundColor();
		Screen.render();
	}

	/**
	 * This method lets the disc drops from the until it finds
	 * a non empty row so it inserts the disc above it.
	 *
	 * We use this method because the cursor is always referring
	 * to the top row and can't use it to refer to a bottom row.
	 *
	 * @param row
	 *     This is the row to drop the disc on.
	 *
	 * @param col
	 *     This is the column to drop the disc on.
	 *
	 * @param char
	 *     This is the character that represents the player turn
	 *     it can be either "X" or "O".
	 *
	 * @returns
	 *     The row that the disc dropped to.
	 */
	private static dropDisc(row: number, col: number, char: string) {
		if (Screen.numRows < row + 1) {
			return;
		}
		let insertInRow = 0;
		for (let i = 0; i < Screen.numRows; i++) {
			if (Screen.grid[i]![col] === " ") {
				insertInRow = i;
			}
		}
		if (Screen.grid[insertInRow]![col] !== " ") {
			return;
		}
		Screen.setGrid(insertInRow, col, char);
		if (char === "X") {
			Screen.setTextColor(insertInRow, col, "magenta");
		} else if (char === "O") {
			Screen.setTextColor(insertInRow, col, "blue");
		}
		return insertInRow;
	}

	/**
	 * This method checks for a winning condition in the game
	 * either "X" or "O" and if no winner and the board is full
	 * it returns "T" to represents a tie in the game. and if
	 * non of the above cases it returns false.
	 *
	 * @param grid
	 *     This is the grid of the game.
	 *
	 * @returns
	 *     returns the player who wins the game either "X" or "O"
	 *     and if no winner and the board is full it returns "T"
	 *     to represents a tie in the game. and if non of the above
	 *     cases it returns false.
	 */
	public static checkWin(grid: string[][]) {
		// 0. create a flag to indicate if the game is finished or not.
		let isFinished = false;
		let isTie = true;

		// 1. loop through the whole board
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i]!.length; j++) {
				if (grid[i]![j] !== " ") {
					if (this.fourInRow(grid, i, j)) {
						return grid[i]![j];
					}

					if (this.fourInColumn(grid, i, j)) {
						return grid[i]![j];
					}

					if (this.fourInNegativeDiagonal(grid, i, j)) {
						return grid[i]![j];
					}

					if (this.fourInPositiveDiagonal(grid, i, j)) {
						return grid[i]![j];
					}
				} else {
					isTie = false;
				}
			}
		}

		return isTie ? "T" : false;
	}

	/**
	 * This method performs a check on the given row to check if there
	 * are exactly 4 elements that have the same value.
	 *
	 * @param grid
	 *     This is the board that represents the game.
	 *
	 * @param row
	 *     This is the current row of the element.
	 *
	 * @param col
	 *     This is the current col of the board.
	 *
	 * @returns
	 *     This method returns true if there are exactly 4 elements
	 *     in the current board row that have same value.
	 */
	private static fourInRow(grid: string[][], row: number, col: number) {
		let consecutiveCount = 0;

		for (let i = col; i < grid[row]!.length; i++) {
			if (grid[row]![col] === grid[row]![i]) {
				consecutiveCount++;
			} else {
				break;
			}
		}

		return consecutiveCount >= 4;
	}

	/**
	 * This method performs a check on the given col to check if there
	 * are exactly 4 elements that have the same value.
	 *
	 * @param grid
	 *     This is the board that represents the game.
	 *
	 * @param row
	 *     This is the current row of the board.
	 *
	 * @param col
	 *     This is the current col of the element.
	 *
	 * @returns
	 *     This method returns true if there are exactly 4 elements
	 *     in the current board col that have same value.
	 */
	private static fourInColumn(grid: string[][], row: number, col: number) {
		let consecutiveCount = 0;

		for (let i = row; i < grid.length; i++) {
			if (grid[i]![col] === grid[row]![col]) {
				consecutiveCount++;
			} else {
				break;
			}
		}

		return consecutiveCount >= 4;
	}

	/**
	 * This method performs a check on the given board positive
	 * diagonal to check if it has exactly 4 elements that have
	 * the same value.
	 *
	 * @param grid
	 *     This is the board that represents the game.
	 *
	 * @param row
	 *     This is the current row of the board.
	 *
	 * @param col
	 *     This is the current col of the board.
	 *
	 * @returns
	 *     This method returns true if there are exactly 4 elements
	 *     in the current board positive diagonal that have same value.
	 */
	private static fourInPositiveDiagonal(
		grid: string[][],
		row: number,
		col: number
	) {
		let consecutiveCount = 0;
		let j = col;

		for (let i = row; i < grid.length; i++) {
			if (j > grid[i]!.length) break;
			if (grid[i]![j] === grid[row]![col]) {
				consecutiveCount++;
			} else {
				break;
			}
			j++;
		}

		return consecutiveCount >= 4;
	}

	/**
	 * This method performs a check on the given board negative
	 * diagonal to check if it has exactly 4 elements that have
	 * the same value.
	 *
	 * @param grid
	 *     This is the board that represents the game.
	 *
	 * @param row
	 *     This is the current row of the board.
	 *
	 * @param col
	 *     This is the current col of the board.
	 *
	 * @returns
	 *     This method returns true if there are exactly 4 elements
	 *     in the current board negative diagonal that have same value.
	 */
	private static fourInNegativeDiagonal(
		grid: string[][],
		row: number,
		col: number
	) {
		let consecutiveCount = 0;
		let j = col;

		for (let i = row; i > -1; i--) {
			if (j > grid[i]!.length) break;
			if (grid[i]![j] === grid[row]![col]) {
				consecutiveCount++;
			} else {
				break;
			}
			j++;
		}

		return consecutiveCount >= 4;
	}

  /**
   * This method fires when the game signals a winner or a
   * Tie.
   *
   * @param winner
   *     This is the player who wins the game, it is either
   *     "X", "O" Or "T" if there are no players in the game
   *     wins and the board is full.
   */
	private static endGame(winner: string | false) {
		if (winner === "O" || winner === "X") {
			Screen.setMessage(`Player ${winner} wins!`);
		} else if (winner === "T") {
			Screen.setMessage(`Tie game!`);
		} else {
			Screen.setMessage(`Game Over`);
		}
		Screen.render();
		Screen.quit();
	}
};
