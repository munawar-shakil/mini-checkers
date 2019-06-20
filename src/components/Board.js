import React from 'react';
import Cell from './Cell';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        let grid = [];
        for(let x=1;x<=8;x++) {
            for(let y=1;y<=8;y++) {
                grid.push({
                    x,
                    y,
                    cellType: this.getCellType(x,y),
                    diskType: 'e'
                });
            }
        }
        this.state = {
            grid
        };
        this.initialBoardConfiguration();
    }

    initialBoardConfiguration = () => {
        const {grid} = this.state;
        let diskCount = 0;
        for(let i=0; i<64;i++) {
            let cell = grid[i];
            if(diskCount==12) {
                break;
            }
            if(cell.cellType == 'r') {
                continue;
            }
            diskCount++;
            cell.diskType = 'r';
        }
        diskCount = 0;
        for(let i=63; i>=0;i--) {
            let cell = grid[i];
            if(diskCount==12) {
                break;
            }
            if(cell.cellType == 'r') {
                continue;
            }
            diskCount++;
            cell.diskType = 'b';
        }
        this.setState({
            grid
        });
    }

    getGridMap = () => {
        const {grid} = this.state;
        let gridMap = {};
        for(let x=1;x<=8;x++) {
            gridMap[x] = {};
            for(let y=1;y<=8;y++) {
                gridMap[x][y] = {};
            }
        }
        grid.forEach(cell => {
            const {x,y} = cell;
            gridMap[x][y] = cell;
        });
        return gridMap;
    }

    getCellType = (x,y) => {
        return x%2 == y%2 ? 'r': 'b';
    }

    render() {
        return (
            <div style={{ width: '640px', height: '640px', padding: '5px', margin: 0,
             display: 'inline-block', lineHeight:'0', cursor: 'pointer' }}>
                {this.state.grid.map((cell,i) => <Cell 
                    key= {i}
                    cell={cell}
                />)}
            </div>
        )
    }
}