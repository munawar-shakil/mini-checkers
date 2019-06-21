import React from 'react';
import './App.css';
import Board from "./components/Board";
import Header from "./components/Header";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restartRequired: false,
      currentTurn: null,
      winner: null
    }
  }

  restartGame = () => {
    const {winner} = this.state;
    if(winner || window.confirm('Do you want to restart?')) {
      this.setState({
        restartRequired: true,
        currentTurn: 'null',
        winner: null
      });
    }
  }

  restartFinished = () => {
    this.setState({
      restartRequired: false,
      currentTurn: 'b'
    });
  }

  setWinner = (winner) => {
    this.setState({
      winner,
      currentTurn: null
    });
  }

  finishMove = (currentTurn) => {
    this.setState({
      currentTurn
    });
  }

  render() {
    const {restartRequired, winner, currentTurn} = this.state;
    return (
      <div className="App" style={{ width: 650, margin: '10px auto' }}>
        <Header restartGame={this.restartGame} winner={winner} currentTurn={currentTurn}/>
        <Board restartRequired={restartRequired} restartFinished={this.restartFinished} setWinner={this.setWinner} finishMove={this.finishMove}/>
      </div>
    );
  }
}

export default App;
