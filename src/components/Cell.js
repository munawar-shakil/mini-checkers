import React from 'react';
import Disk from './Disk';

export default class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };
    }

    handleCellClick = () => {
        const { cell, moveStarted, finishMove, currentTurn, forceJump, forceJumpList } = this.props;
        if (cell.type === 'r') {
            return;
        }
        if (moveStarted && cell.possibleMove) {
            finishMove(cell.x, cell.y);
            return;
        }
        if (currentTurn !== cell.diskType) {
            return;
        }
        if (forceJump
            && forceJumpList
            && forceJumpList.length
            && forceJumpList
                .filter(c => c.x === cell.x && c.y === cell.y)
                .length === 0) {
            return;
        }
        this.props.moveStart(cell.x, cell.y);
    }

    render() {
        const { cell, forceJump, forceJumpList } = this.props;
        const background = cell.possibleMove ? '#35d650' : (cell.cellType === 'r' ? '#b76464' : '#4c4a4a');
        const forceJumpDisk = forceJump && forceJumpList.filter(c => c.x === cell.x && c.y === cell.y).length > 0;
        return (
            <div
                onClick={cell.cellType === 'r' ? () => { } : this.handleCellClick}
                style={{ width: '70px', height: '70px', padding: '5px', margin: 0, background: background, display: 'inline-block', lineHeight: 0 }}>
                <Disk selected={cell.selected} diskType={cell.diskType} forceJump={forceJumpDisk} /></div>
        )
    }
}