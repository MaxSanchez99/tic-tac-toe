
function player(name, value) {
    return { name, value }
}

const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    let board = new Array(9).fill("")

    const getBoard = () => board;

    const setCell = (index, value) => {
        let valid = validCell(index);

        if (valid) {
            board[index] = value;
            displayController.updateCell(index, value);
            return true;
        }

        else {
            return false;
        }
    };

    const reset = () => board.fill('');

    const printBoard = () => console.log(board);

    const validCell = (index) => {
        if (board[index] === '') {
            return true;
        }

        return false;
    }

    return { getBoard, setCell, reset, printBoard }
})();


const GameController = (function () {

    const player1 = player("Player 1", 'X');
    const player2 = player("Player 2", 'O');
    let currentPlayer = player1;
    let rounds = 0;

    const playRound = function (index) {
        rounds++;
        if (rounds == 1) {
            displayController.updateMessage('');
        }
        let allowed = Gameboard.setCell(index, currentPlayer.value);
        if (!allowed) {
            console.log('Spot is Taken')
            return;
        }

        const win = checkWin();
        if (win) {
            displayController.updateMessage(`Winner: ${currentPlayer.name}`);
            gameReset();
        }
        else if (rounds === 9) {
            displayController.updateMessage('Game is a Tie');
            gameReset();
        }
        else {
            switchPlayer();
        }
    }

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        displayController.updatePlayer(currentPlayer.name);
    };

    const gameReset = () => {
        currentPlayer = player1;
        rounds = 0;
        Gameboard.reset();
        displayController.render();
        displayController.updatePlayer(currentPlayer.name);
    }

    const checkWin = () => {
        const board = Gameboard.getBoard();

        // Check each row
        for (let i = 0; i < 3; i++) {
            let r = i * 3;
            if (board[r] != "" && board[r] === board[r + 1] && board[r] === board[r + 2])
                return true;
        }

        // Check each column
        for (let i = 0; i < 3; i++) {
            if (board[i] != '' && board[i] === board[i + 3] && board[i] === board[i + 6])
                return true;
        }

        // Check diagonals 
        if (board[0] != '' && board[0] === board[4] && board[0] === board[8]) {
            return true;
        }
        else if (board[2] != '' && board[2] === board[4] && board[2] === board[6]) {
            return true;
        }

        return false;
    }

    return { playRound, gameReset }

})();


const displayController = (function () {
    const boardDiv = document.querySelector('.board');
    const resetBtn = document.querySelector('.reset');
    const messageDiv = document.querySelector('.output');
    const playerText = document.querySelector('#player')

    const render = () => {

        while (boardDiv.firstChild) {
            boardDiv.removeChild(boardDiv.firstChild);
        }

        Gameboard.getBoard().forEach((element, index) => {
            let div = document.createElement("div");
            div.classList.add("cell");
            div.id = index;
            div.innerText = element;
            div.addEventListener('click', () => GameController.playRound(index));
            boardDiv.appendChild(div);
        });
    }

    const updateCell = (index, value) => {
        let cell = document.getElementById(index);
        cell.innerText = value;

    }

    const updateMessage = (message) => messageDiv.innerText = message;

    const updatePlayer = (name) => playerText.innerText = name;

    resetBtn.addEventListener('click', () => GameController.gameReset());

    return { render, updateCell, updateMessage, updatePlayer };
})();

displayController.render();