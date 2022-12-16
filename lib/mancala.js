const assert = require('assert')

class Mancala {
  constructor ({ pits, goals }) {
    assert.equal(2, goals.length)
    assert.equal(2, pits.length)
    assert.equal(...pits.map(pit => pit.length))

    this.pits = pits
    this.goals = goals
  }

  planMove ({ from, as }) {
    return new Move(this, { from, as })
  }

  copy () {
    return new Mancala({ pits: Array.from(this.pits), goals: Array.from(this.goals) })
  }

  * steps ({ from, as }) {
    const iterator = this._iterator({ from, as })
    const first = iterator.next().value
    yield first

    for (let i = 0; i < first.value; i++) {
      yield iterator.next().value
    }
  }

  * _iterator ({ from, as }) {
    const myPits = this.pits[as]
    const opponent = 1 - as
    const opponentPits = this.pits[opponent]

    for (let i = from; i < myPits.length; i++) {
      yield new Pit({ board: this, owner: as, index: i })
    }

    while (true) {
      yield new Goal({ board: this, owner: as })

      for (let i = 0; i < opponentPits.length; i++) {
        yield new Pit({ board: this, owner: opponent, index: i })
      }

      for (let i = 0; i < myPits.length; i++) {
        yield new Pit({ board: this, owner: as, index: i })
      }
    }
  }

  toString () {
    const slots = new Array(this.pits[0].length)
    const firstPits = new Array(...this.pits[0]).reverse()
    const secondPits = this.pits[1]

    for (let i = 0; i < firstPits.length; i++) {
      slots[i] = `${firstPits[i]}/${secondPits[i]}`
    }

    return [
      this.goals[0],
      ...slots,
      this.goals[1]
    ].join('|')
  }
}

Mancala.fromString = function fromString (description) {
  const slots = description.split('|')
  const goals = [slots[0], ...slots.slice(-1)].map(goal => parseInt(goal))
  const middles = slots.slice(1, -1)
  const pits = [
    middles.map(slot => parseInt(slot.split('/')[0])).reverse(),
    middles.map(slot => parseInt(slot.split('/')[1]))
  ]

  return new Mancala({ pits, goals })
}

class Move {
  constructor (board, { from, as }) {
    this.board = board
    this.from = from
    this.as = as
  }

  nextBoard () {
    const nextBoard = this.board.copy()
    const stepIterator = nextBoard.steps(this)
    const { value: first } = stepIterator.next()
    const steps = [first]

    first.setValue(0)

    for (const step of stepIterator) {
      steps.push(step)
      step.increment()
    }

    const [last] = steps.slice(-1)

    last.capture(this.as)

    return nextBoard
  }
}

class Pit {
  constructor ({ board, owner, index }) {
    Object.assign(this, { board, owner, index })
    this.value = board.pits[owner][index]
  }

  capture (as) {
    const opposite = this.opposite()

    if (this.owner !== as || this.value !== 0 || opposite.value === 0) {
      return
    }

    const pit = new Pit(this)

    new Goal(this).increment(pit.value + opposite.value)

    pit.setValue(0)
    opposite.setValue(0)
  }

  opposite () {
    const index = this.board.pits[0].length - 1 - this.index
    return new Pit({ board: this.board, owner: 1 - this.owner, index })
  }

  setValue (value) {
    this.board.pits[this.owner][this.index] = value
  }

  increment () {
    this.setValue(this.value + 1)
  }
}

class Goal {
  constructor ({ board, owner }) {
    Object.assign(this, { board, owner })
    this.value = board.goals[owner]
  }

  capture () {
  }

  setValue (value) {
    this.board.goals[this.owner] = value
  }

  increment (value = 1) {
    this.setValue(this.value + value)
  }
}

module.exports = Mancala
