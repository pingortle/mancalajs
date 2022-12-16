const assert = require('assert')

const Mancala = require('#lib/mancala.js')

module.exports = {
  'round trips as a string' () {
    assert.equal(
      '0|0/0|0/0|1/0|0/0|0',
      Mancala.fromString('0|0/0|0/0|1/0|0/0|0').toString()
    )
  },

  'otherwise empty board makes a move' () {
    const board = Mancala.fromString('0|0/0|0/0|0/0|1/0|0')
    const nextBoard = board.planMove({ from: 0, as: 0 }).nextBoard()

    assert.equal('0|0/0|0/0|1/0|0/0|0', nextBoard.toString())
  },

  'otherwise empty board makes a move (opposite)' () {
    const board = Mancala.fromString('0|0/1|0/0|0/0|0/0|0')
    const nextBoard = board.planMove({ from: 0, as: 1 }).nextBoard()

    assert.equal('0|0/0|0/1|0/0|0/0|0', nextBoard.toString())
  },

  'otherwise empty board makes another move' () {
    const board = Mancala.fromString('0|0/0|0/0|1/0|0/0|0')
    const nextBoard = board.planMove({ from: 1, as: 0 }).nextBoard()

    assert.equal('0|0/0|1/0|0/0|0/0|0', nextBoard.toString())
  },

  'moves multiple steps' () {
    const board = Mancala.fromString('0|0/0|0/0|2/0|0/0|0')
    const nextBoard = board.planMove({ from: 1, as: 0 }).nextBoard()

    assert.equal('0|1/0|1/0|0/0|0/0|0', nextBoard.toString())
  },

  'sows goal' () {
    const board = Mancala.fromString('0|0/0|0/0|3/0|0/0|0')
    const nextBoard = board.planMove({ from: 1, as: 0 }).nextBoard()

    assert.equal('1|1/0|1/0|0/0|0/0|0', nextBoard.toString())
  },

  'sows goal (opposite)' () {
    const board = Mancala.fromString('0|0/0|0/3|0/0|0/0|0')
    const nextBoard = board.planMove({ from: 1, as: 1 }).nextBoard()

    assert.equal('0|0/0|0/0|0/1|0/1|1', nextBoard.toString())
  },

  "moves through goal, sowing opponent's side" () {
    const board = Mancala.fromString('0|0/0|0/0|4/0|0/0|0')
    const nextBoard = board.planMove({ from: 1, as: 0 }).nextBoard()

    assert.equal('1|1/1|1/0|0/0|0/0|0', nextBoard.toString())
  },

  'lands on blank spot on own side captures opponents seeds' () {
    const board = Mancala.fromString('0|0/0|0/0|0/1|1/0|0')
    const nextBoard = board.planMove({ from: 0, as: 0 }).nextBoard()

    assert.equal('2|0/0|0/0|0/0|0/0|0', nextBoard.toString())
  },

  'lands on blank spot on own side captures opponents seeds (opposite)' () {
    const board = Mancala.fromString('0|0/1|1/0|0/0|0/0|0')
    const nextBoard = board.planMove({ from: 0, as: 1 }).nextBoard()

    assert.equal('0|0/0|0/0|0/0|0/0|2', nextBoard.toString())
  },

  'lands on blank spot on opposite side does not capture' () {
    const board = Mancala.fromString('0|3/0|1/0|0/0|0/0|0')
    const nextBoard = board.planMove({ from: 3, as: 0 }).nextBoard()

    assert.equal('1|0/1|1/1|0/0|0/0|0', nextBoard.toString())
  },

  'makes first move from traditional setup' () {
    const board = Mancala.fromString('0|4/4|4/4|4/4|4/4|4/4|4/4|0')
    const nextBoard = board.planMove({ from: 4, as: 0 }).nextBoard()

    assert.equal('1|5/5|0/5|4/4|4/4|4/4|4/4|0', nextBoard.toString())
  }
}
