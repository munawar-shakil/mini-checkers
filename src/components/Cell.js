import React from 'react';
import Disk from './Disk';

export default class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {cell} = this.props;
        const background = cell.cellType == 'r' ? '#b76464': '#4c4a4a';
        return (
            <div style={{ width: '70px', height: '70px', padding: '5px', margin: 0, background: background, display: 'inline-block',lineHeight:0 }}>
                <Disk diskType= {cell.diskType}/></div>
        )
    }
}