import React, { Component } from 'react'

class Round extends Component {
  getStyle(key) {
    const labelMap = {
      0: 'out',
      1: 'default',
      2: '3',
      3: 'danger'
    }
    return `label-${labelMap[key]}`
  }
  render() {
    const { throwed } = this.props
    return (
      <div className="round">
        <ul>
          <li>Current Throws</li>
          {
            throwed.map(t => (
              <li key={t.id} className={this.getStyle(t.modifier)}><span>{t.score}</span></li>
            ))
          }
        </ul>
      </div>
    )
  }
}
export default Round
