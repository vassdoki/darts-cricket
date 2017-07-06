import React, { Component } from 'react';
import Websocket from 'react-websocket';
import logo from './logo.svg';
import './App.css';

import Player from './Player.js'

const mapObject = (object, callback) => {
  return Object.keys(object).map( key => callback(key, object[key]) )
}

const allOutInit = {
  25: [],
  20: [],
  19: [],
  18: [],
  17: [],
  16: [],
  15: []
}

const flattenRounds = (players, maxRound) => {
  let rounds = []
  for (let i = 0; i < maxRound; i++) {
    for (let j = 0; j < Object.keys(players).length; j++) {
      if (Object.keys(players[j].rounds).length > i) {
        rounds.push({
          player: {
            key: j,
            id: players[j].id,
            name: players[j].name
          },
          ...players[j].rounds[i]
        })
      }
    }
  }
  return rounds
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      players: [],
      allOut: allOutInit
    }
  }
  onMessage = (message) => {
    let parsedMessage = JSON.parse(message)
    if (parsedMessage.command == 'start' || parsedMessage.command == 'restart') {
      this.parseServerGameObject(parsedMessage.game)
    } else if (parsedMessage.command == 'insert_throw') {
      this.newThrow(parsedMessage.playerId, parsedMessage.throw)
    } else if (parsedMessage.command == 'edit_throw') {
      window.location.reload()
    }
  }
  newThrow = (currentPlayer, t) => {
    this.setState({players: this.state.players.map((player) => {
      if (player.id == currentPlayer) {
        player[t.score] += t.modifier
        if (player[t.score] >= 3) {
          if (!this.state.allOut[t.score].includes(player.id)) {
            this.setState({allOut: Object.assign({}, this.state.allOut, {[t.score]: [...this.state.allOut[t.score], player.id]})})
            //this.setState({[t.score]: [...this.state[t.score], player.id]})
          }
          if (player[t.score] > 3) {
            if (this.state.allOut[t.score].length < this.state.players.length) {
              player.score += t.score * (player[t.score]-3)
            }
            player[t.score] = 3
          }
        }
      }
      return player
    })})
  }
  parseServerGameObject(game) {
    this.setState({allOut: allOutInit})
    if (game.players == {}) {
      return []
    }
    let maxRound = 0
    let players = mapObject(game.players, (playerKey, player) => {
      if (maxRound < Object.keys(player.rounds).length) {
        maxRound = Object.keys(player.rounds).length
      }
      return {
        id: player.id,
        name: player.name,
        score: 0,
        25: 0,
        20: 0,
        19: 0,
        18: 0,
        17: 0,
        16: 0,
        15: 0
      }
    })

    this.setState({players: players})

    let rounds = flattenRounds(game.players, maxRound)
    rounds.forEach((round)=> {
      mapObject(round.throws, (tKey, t) => {
        this.newThrow(round.player.id, t)
      })
    })
  }
  filterAllOut() {
    return Object.keys(this.state.allOut).filter(e => this.state.allOut[e].length === this.state.players.length).map(Number)
  }
  render() {
    return (
      <div className="container">
        <div className="row title"><h1>Cricket Game</h1></div>
        <div className="row">
          { this.state.players.map((player) => <Player {...player} allOut={this.filterAllOut()} key={player.id} />) }
        </div>
        <Websocket url='ws://localhost:8080/ws'
              onMessage={this.onMessage}/>
      </div>
    );
  }
}

export default App;
