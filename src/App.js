import React, { Component } from 'react';
import Websocket from 'react-websocket';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      game: {
        players: {}
      }
    }
  }
  onMessage = (message) => {
    this.setState({game: JSON.parse(message).game})
    console.log(message)
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        { Object.keys(this.state.game.players).map((key) => <p>{this.state.game.players[key].name}</p>) }
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Websocket url='ws://localhost:8080/ws'
              onMessage={this.onMessage}/>
      </div>
    );
  }
}

export default App;
