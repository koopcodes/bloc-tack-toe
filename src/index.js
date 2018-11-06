import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Footer() {
	return (
		<div className="footer">
			<a href="https://github.com/koopdev/">{'@koopdev'}</a>
		</div>
	);
}

function Square(props) {
	return (
		<button
			className={`square ${props.green ? 'winner' : ''}`}
			onClick={props.onClick}>
			{' '}
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i, winner = false) {
		return (
			<Square
				key={'col' + i}
				green={winner}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	createSquares(n = 3) {
		return Array.from(Array(n).keys()).map((row) => {
			return (
				<div key={'row' + row} className="board-row">
					{Array.from(Array(n).keys()).map((col) => {
						if (
							this.props.winner &&
							(this.props.winner[col] === col + 3 * row ||
								this.props.winner[row] === col + 3 * row)
						) {
							return this.renderSquare(col + 3 * row, true);
						}
						return this.renderSquare(col + 3 * row);
					})}
				</div>
			);
		});
	}

	render() {
		return <div>{this.createSquares()}</div>;
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					loc: [],
					xIsNext: [],
				},
			],
			stepNumber: 0,
			xIsNext: true,
			toggleOrder: false,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		let col;
		if (i === 0 || i === 3 || i === 6) {
			col = 1;
		} else if (i === 1 || i === 4 || i === 7) {
			col = 2;
		} else {
			col = 3;
		}
		const row = Math.floor(i / 3) + 1;

		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([
				{
					squares: squares,
					loc: [col, row],
					xIsNext: this.state.xIsNext,
				},
			]),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		});
	}

	toggleOrder() {
		this.setState({
			toggleOrder: !this.state.toggleOrder,
		});
	}

	reverseMoves(moves) {
		return moves.reverse();
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const draw = !history[this.state.stepNumber + 1];

		let moves = history.map((step, move) => {
			const desc = move ? 'Go to move #' + move : 'Go to game start';
			let movesHistory = step.loc[0]
				? (step.xIsNext ? 'X' : 'O') +
				  ' move was: (' +
				  step.loc[0] +
				  ', ' +
				  step.loc[1] +
				  ')'
				: '';
			if (move === this.state.stepNumber) {
				movesHistory = <strong>{movesHistory}</strong>;
			}
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>{' '}
					<span> {movesHistory} </span>
				</li>
			);
		});

		if (this.state.toggleOrder) {
			moves = this.reverseMoves(moves);
		}

		let status;
		if (winner) {
			status = 'Winner: ' + winner[0];
		} else if (history.length === 10 && draw) {
			status = 'Game ended up in a draw.';
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div>
				<div className="game">
					<div className="game-board">
						{winner ? (
							<Board
								squares={current.squares}
								onClick={(i) => this.handleClick(i)}
								winner={winner[1]}
							/>
						) : (
							<Board
								squares={current.squares}
								onClick={(i) => this.handleClick(i)}
							/>
						)}
					</div>
					<div className="game-info">
						<button
							style={{ marginBottom: '10px' }}
							onClick={() => this.toggleOrder(moves)}>
							Change order
						</button>
						<div> {status} </div>{' '}
						<ol reversed={this.state.toggleOrder ? 'reversed' : ''}>
							{' '}
							{moves}{' '}
						</ol>
					</div>
				</div>
				<footer>
					{' '}
					<Footer />{' '}
				</footer>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], lines[i]];
		}
	}
	return null;
}
