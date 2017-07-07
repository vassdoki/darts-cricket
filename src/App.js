import React, { Component } from 'react'
import Websocket from 'react-websocket'
import './App.css'

import Player from './Player.js'
import Game from './Game.js'

const game = Game()

class App extends Component {
  constructor() {
    super()
    this.state = {
      players: game.getPlayers(),
      allOut: game.getAllOut()
    }
  }
  onMessage = (message) => {
    if (message === '__pong__') {
      return
    }
    let parsedMessage = JSON.parse(message)
    if (parsedMessage.command === 'start' || parsedMessage.command === 'restart') {
      game.parseServerGameObject(parsedMessage.game)
    } else if (parsedMessage.command === 'insert_throw') {
      game.newThrow(parsedMessage.playerId, parsedMessage.throw)
    } else if (parsedMessage.command === 'edit_throw') {
      window.location.reload()
    }
    this.setState({players: game.getPlayers(), allOut: game.getAllOut()})
  }
  render() {
    return (
      <div>
        <div className="title"><h1>Cricket Game</h1></div>
        <div className="row">
          { this.state.players.map((player) => <Player {...player} allOut={this.state.allOut} key={player.id} />) }
        </div>
        <Websocket url={'ws://'+window.location.hostname+':8080/ws'}
              onMessage={this.onMessage}/>
      </div>
    )
  }
}

export default App
