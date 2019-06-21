import React from 'react';
import Cell from './Cell';

var abs = (a) => {
    return a>0 ? a :-a;
}

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        let gridMap = [];

        for (let x = 1; x <= 8; x++) {
            gridMap[x] = {};
            for (let y = 1; y <= 8; y++) {
                gridMap[x][y] = {
                    x,
                    y,
                    cellType: this.getCellType(x, y),
                    diskType: 'e'
                };
            }
        }
        this.state = {
            gridMap,
            currentTurn: 'b',
            selectedCellList: [],
            possibleMoveList: [],
            moveStarted: false,
            forceJump: false,
            forceJumpList: [],
        };
    }

    componentDidMount = () => {
        const {finishMove} = this.props;
        this.initialBoardConfiguration();
        finishMove('b');
    }

    componentWillReceiveProps = (newProps) => {
        const {restartFinished} = this.props;
        if(newProps.restartRequired === true) {
            this.initialBoardConfiguration();
            restartFinished();
        }
    }

    place12DisksOnBoard = (gridMap, diskType) => {
        const start = diskType === 'r' ? 1 : 8;
        const end = diskType === 'r' ? 4 : 5;
        const inc = diskType === 'r' ? 1 : -1;
        for (let x = start; x !== end; x += inc) {
            for (let y = 1; y <= 8; y++) {
                let cell = gridMap[x][y];
                if (cell.cellType === 'r') {
                    continue;
                }
                cell.diskType = diskType;
            }
        }
    }

    initialBoardConfiguration = () => {
        const { gridMap } = this.state;
        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                gridMap[x][y] = {
                    x,
                    y,
                    cellType: this.getCellType(x, y),
                    diskType: 'e'
                };
            }
        }
        this.place12DisksOnBoard(gridMap, 'r');
        this.place12DisksOnBoard(gridMap, 'b');
        this.setState({
            gridMap,
            currentTurn: 'b',
            selectedCellList: [],
            possibleMoveList: [],
            moveStarted: false,
            forceJump: false,
            forceJumpList: [],
        });
    }

    moveStart = (x, y) => {
        const { gridMap, selectedCellList } = this.state;
        selectedCellList.forEach(cell => {
            gridMap[cell.x][cell.y].selected = false;
        });
        gridMap[x][y].selected = true;
        const jumpList = this.findPossibleJump(gridMap, x, y);
        const possibleMoveList = jumpList && jumpList.length ? jumpList : this.findPossibleMove(gridMap, x, y);
        this.state.possibleMoveList.forEach(cell => {
            gridMap[cell.x][cell.y].possibleMove = false;
        });
        possibleMoveList.forEach(cell => {
            gridMap[cell.x][cell.y].possibleMove = true;
        });
        this.setState({
            gridMap,
            selectedCellList: [{ x, y }],
            possibleMoveList,
            moveStarted: true
        });
    }

    finishMove = (x, y) => {
        const { gridMap, selectedCellList, possibleMoveList, currentTurn } = this.state;
        const {setWinner, finishMove} = this.props;
        const lastSelectedPosition = selectedCellList[0];
        gridMap[x][y].diskType = gridMap[lastSelectedPosition.x][lastSelectedPosition.y].diskType;
        gridMap[lastSelectedPosition.x][lastSelectedPosition.y].diskType = 'e';
        this.clearPossibleMoves(gridMap, possibleMoveList);
        this.clearSelectedList(gridMap, selectedCellList);
        const middleCell = this.isJumpMove(lastSelectedPosition, {x,y});
        if (middleCell) {
            gridMap[middleCell.x][middleCell.y].diskType = 'e';
        }
        const jumpList = this.findPossibleJump(gridMap, x, y);
        let forceJumpObject = {};
        if(middleCell && jumpList && jumpList.length) {
            forceJumpObject = {
                possibleMoveList: jumpList,
                forceJump: true,
                moveStarted: true,
                currentTurn: currentTurn,
                selectedCellList: [{x,y}],
                forceJumpList: [{x,y}]
            };
            jumpList.forEach(cell => {
                gridMap[cell.x][cell.y].possibleMove = true;
            });
            gridMap[x][y].selected = true;
        } else {
            const forceJumpList = this.allPossibleJumpMoveListForCurrentPlayer(gridMap, currentTurn === 'b' ? 'r' : 'b');
            const moveList = this.allPossibleMoveListForCurrentPlayer(gridMap, currentTurn === 'b' ? 'r' : 'b');
            if(forceJumpList.length) {
                forceJumpObject = {
                    forceJump: true,
                    forceJumpList
                };
                finishMove(currentTurn === 'b' ? 'r' : 'b');
            } else if(moveList.length === 0) {
                setWinner(currentTurn);
            } else {
                finishMove(currentTurn === 'b' ? 'r' : 'b');
            }
        }
        this.setState({
            gridMap,
            selectedCellList: [],
            possibleMoveList: [],
            forceJumpList: [],
            moveStarted: false,
            forceJump: false,
            currentTurn: currentTurn === 'b' ? 'r' : 'b',
            ...forceJumpObject
        });
    }

    allPossibleJumpMoveListForCurrentPlayer = (gridMap, currentTurn) => {
        let forceJumpDisk = [];
        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                const cell = gridMap[x][y];
                if(cell.diskType === currentTurn && this.findPossibleJump(gridMap, x, y).length) {
                    forceJumpDisk.push({x,y});
                }
            }
        }
        return forceJumpDisk;
    }

    allPossibleMoveListForCurrentPlayer = (gridMap, currentTurn) => {
        let moveList = [];
        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                const cell = gridMap[x][y];
                if(cell.diskType === currentTurn && this.findPossibleMove(gridMap, x, y).length) {
                    moveList.push({x,y});
                }
            }
        }
        return moveList;
    }

    isJumpMove = (pos1, pos2) => {
        if (abs(pos1.x - pos2.x) === 2) {
            return { x: (pos1.x + pos2.x) / 2, y: (pos1.y + pos2.y) / 2 };
        }
        return null;
    }

    clearPossibleMoves = (gridMap, possibleMoveList = []) => {
        possibleMoveList.forEach(cell => {
            gridMap[cell.x][cell.y].possibleMove = false;
        });
        return gridMap;
    }

    clearSelectedList = (gridMap, selectedCellList = []) => {
        selectedCellList.forEach(cell => {
            gridMap[cell.x][cell.y].selected = false;
        });
        return gridMap;
    }

    findPossibleMove = (gridMap, x, y) => {
        const possibleMoveList = [];
        const cell = gridMap[x][y];
        const inc = cell.diskType === 'r' ? 1 : -1;
        if (this.validCell(x + inc, y + 1) && gridMap[x + inc][y + 1].diskType === 'e') {
            possibleMoveList.push({ x: x + inc, y: y + 1 });
        }
        if (this.validCell(x + inc, y - 1) && gridMap[x + inc][y - 1].diskType === 'e') {
            possibleMoveList.push({ x: x + inc, y: y - 1 });
        }
        return possibleMoveList;
    }

    findPossibleJump = (gridMap, x, y) => {
        const possibleJumpList = [];
        const cell = gridMap[x][y];
        const opponentType = cell.diskType === 'r' ? 'b' : 'r';
        const inc = cell.diskType === 'r' ? 1 : -1;
        if (this.validCell(x + inc, y + 1) && gridMap[x + inc][y + 1].diskType === opponentType
            && this.validCell(x + 2 * inc, y + 2) && gridMap[x + 2 * inc][y + 2].diskType === 'e'
        ) {
            possibleJumpList.push({ x: x + inc + inc, y: y + 2 });
        }
        if (this.validCell(x + inc, y - 1) && gridMap[x + inc][y - 1].diskType === opponentType
            && this.validCell(x + 2 * inc, y - 2) && gridMap[x + 2 * inc][y - 2].diskType === 'e'
        ) {
            possibleJumpList.push({ x: x + inc + inc, y: y - 2 });
        }
        return possibleJumpList;
    }

    validCell = (x, y) => {
        return x > 0 && x <= 8 && y > 0 && y <= 8;
    }

    getCellType = (x, y) => {
        return x % 2 === y % 2 ? 'r' : 'b';
    }

    generateCells = () => {
        const { gridMap, moveStarted, currentTurn, forceJumpList, forceJump } = this.state;
        let renderCells = [];
        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                const cell = gridMap[x][y];
                renderCells.push(
                    <Cell
                        moveStart={this.moveStart}
                        key={x * 8 + y}
                        moveStarted={moveStarted}
                        finishMove={this.finishMove}
                        currentTurn={currentTurn}
                        forceJump={forceJump}
                        forceJumpList= {forceJumpList}
                        cell={cell}
                    />
                )
            }
        }
        return renderCells;
    }

    render() {
        return (
            <div style={{
                width: '640px', height: '640px', padding: '5px', margin: 0,
                display: 'inline-block', lineHeight: '0', cursor: 'pointer'
            }}>
                {this.generateCells()}
            </div>
        )
    }
}