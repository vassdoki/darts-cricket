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
    let parsedMessage = JSON.parse(message)
    if (parsedMessage.command == 'start' || parsedMessage.command == 'restart') {
      this.setState({game: parsedMessage.game})
    } else if (parsedMessage.command == 'insert_throw') {

    } else if (parsedMessage.command == 'edit_throw') {
      
    }
    console.log(parsedMessage)
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
