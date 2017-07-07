const allOutInit = {
  25: [],
  20: [],
  19: [],
  18: [],
  17: [],
  16: [],
  15: []
}

const mapObject = (object, callback) => {
  return Object.keys(object).map( key => callback(key, object[key]) )
}

const copyPlayers = (players) => (players.map(p => p));

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

const Game = () => {
  const game = {}
  const players = []

  let allOut = {}

  const isAllOut = (score) => {
    return allOut[score].length === players.length
  }

  const doScore = (playerId, score) => {
    players.forEach((player, index) => {
      if (player.id === playerId) {
        players[index].score += score * (player[score]-3)
      }
    })
  }

  const newThrow = (currentPlayerId, t) => {
    players.forEach((player, index) => {
      if (player.id === currentPlayerId) {
        players[index][t.score] += t.modifier
        if (player[t.score] >= 3) {
          if (!allOut[t.score].includes(currentPlayerId)) {
            allOut[t.score] = [...allOut[t.score], currentPlayerId]
          }
          if (player[t.score] > 3) {
            if (!isAllOut(t.score)) {
              doScore(currentPlayerId, t.score)
            }
            player[t.score] = 3
          }
        }
      }
      return player
    })
  }

  game.getPlayers = () => copyPlayers(players)
  game.getAllOut = () => {
    return Object.keys(allOut).filter(e => allOut[e].length === players.length)
          .map(Number)
        }

  game.newThrow = newThrow
  game.parseServerGameObject = (game) => {
    allOut = allOutInit
    if (game.players === {}) {
      return
    }
    let maxRound = 0
    mapObject(game.players, (playerKey, player) => {
      if (maxRound < Object.keys(player.rounds).length) {
        maxRound = Object.keys(player.rounds).length
      }
      players.push({
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
      })
    })

    let rounds = flattenRounds(game.players, maxRound)
    rounds.forEach((round)=> {
      mapObject(round.throws, (tKey, t) => {
        newThrow(round.player.id, t)
      })
    })
  }

  return game
}

export default Game
