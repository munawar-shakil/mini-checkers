import React from 'react';

export default class Disk extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {diskType} = this.props;
        const background = diskType == 'r' ? '#a5320b': 'black';
        return (
            <span style={{ width: '70px', height: '70px', padding: '0', borderRadius:'50%', margin: 0, background: background, display: 'inline-block', visibility: diskType == 'e' ?'hidden': 'visible', lineHeight:0, boxShadow: '1px 1px 3px white' }}></span>
        )
    }
}