import React from 'react';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {restartGame, currentTurn, winner} = this.props;
        return (
            <div style={{ 
                width: '640px', 
                height: '50px', 
                padding: '5px', 
                margin: '0',
                lineHeight: '50px',
                textAlign: 'center'
             }}
                >
                    <button className="restartButton" onClick={restartGame}>{'Restart Game'}</button>
                    <span className="message"> {
                        winner ? (winner === 'b' ? 'Black wins': 'Red wins')
                        : (currentTurn ? (currentTurn === 'b' ? "Black's turn": "Red's turn") : '')
                    }</span>
                </div>
        )
    }
}