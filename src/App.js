import React, { Component } from 'react'
import Websocket from 'react-websocket'
import './App.css'

import Player from './Player.js'
import Round from './Round.js'
import Game from './Game.js'

const game = Game()

class App extends Component {
  constructor() {
    super()
    this.state = {
      players: game.getPlayers(),
      allOut: game.getAllOut(),
      currentRound: game.getCurrentRound()
    }
  }
  onMessage = (message) => {
    if (message === '__pong__') {
      return
    }
    let parsedMessage = JSON.parse(message)
    if (['start', 'restart', 'started'].includes(parsedMessage.command)) {
      game.parseServerGameObject(parsedMessage.game)
    } else if (parsedMessage.command === 'insert_throw') {
      game.newThrow(parsedMessage.playerId, parsedMessage.throw)
    } else if (parsedMessage.command === 'edit_throw') {
      window.location.reload()
    }
    this.setState({
      players: game.getPlayers(),
      allOut: game.getAllOut(),
      currentRound: game.getCurrentRound()
    })
  }
  render() {
    return (
      <div>
        <div className="title"><h1>Cricket Game</h1></div>
        <Round throwed={this.state.currentRound.throwed} />
        <div className="row">
          { this.state.players.map((player) => (
            <Player {...player}
                    allOut={this.state.allOut}
                    current={this.state.currentRound.playerId === player.id}
                    key={player.id} />))
          }
        </div>
        <Websocket url={'ws://'+window.location.hostname+':8080/ws'}
              onMessage={this.onMessage}/>
      </div>
    )
  }
}

export default App
