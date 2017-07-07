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

  let subType = 'simple'
  let allOut = {}
  let currentRound = {throwed: []}

  const isAllOut = (score) => {
    return allOut[score].length === players.length
  }

  const doScore = (playerId, score, modifier) => {
    players.forEach((player, index) => {
      if (subType === 'cc') {
        if (player.id !== playerId && !allOut[score].includes(player.id)) {
          players[index].score += score * modifier
        }
      } else {
        if (player.id === playerId) {
          players[index].score += score * modifier
        }
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
              doScore(currentPlayerId, t.score, player[t.score]-3)
            }
            player[t.score] = 3
          }
        }
        if (currentRound.throwed.length === 3) {
          currentRound['throwed'] = []
        }
        currentRound.throwed.push(t)
        if (currentRound.throwed.length === 3) {
          currentRound['playerId'] = players[(index+1) % players.length].id
        }
      }
      return player
    })

  }
  game.getCurrentRound = () => {
    return {
      playerId: currentRound.playerId,
      throwed: currentRound.throwed.map(t => t)
    }
  }
  game.getPlayers = () => copyPlayers(players)
  game.getAllOut = () => {
    return Object.keys(allOut).filter(e => allOut[e].length === players.length)
          .map(Number)
        }

  game.newThrow = newThrow
  game.parseServerGameObject = (game) => {
    if (game.players === {} || game.status === 0) {
      return
    }
    allOut = allOutInit
    subType = game.subType
    currentRound = {throwed: []}
    players.length = 0
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
    currentRound['playerId'] = players[0].id
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
