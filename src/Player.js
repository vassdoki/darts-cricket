import React, { Component } from 'react'

const keyList = [15, 16, 17, 18, 19, 20, 25]

class Player extends Component {
  getStyle(key) {
    const {allOut, [key]: count} = this.props
    const label = allOut.includes(key) ? 'danger' : count
    return `label-${label}`
  }
  render() {
    const {name, score} = this.props
    return (
      <div className="player">
        <div className="score">
          <div className="header">
            {name}
          </div>
          <div className="sum">
            {score}
          </div>
          <div className="table-container">
            {keyList.map((key) => {
              return (<div className="table" key={key}>
                <ul>
                  <li className="big">{key}</li>
                  {[...Array(this.props[key]).keys()].map((k)=>(
                    <li className={this.getStyle(key)} key={k}>
                      <span>x</span>
                    </li>
                  ))}
                </ul>
              </div>)
            })}

          </div>
        </div>
      </div>
    )
  }
}

export default Player
