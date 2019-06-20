import React from 'react';
import logo from './logo.svg';
import './App.css';
import Board from "./components/Board";

function App() {
  return (
    <div className="App" style={{width: 800, margin:'10px auto'}}>
      <Board />
    </div>
  );
}

export default App;
