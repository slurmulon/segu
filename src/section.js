// Wraps (or can be composed) with a generic object (in our case, a beat) and provides useful calculations for cursor or time-based contexts.
// TODO: Keep out of this lib and use elsewhere, not crucial or highly useful at this scope
// export class Item {
export class Section {

  constructor ({ index, value, lens, grid, units } = {}) {
    this.index = index
    this.value = value
    // this.shape = shape
    this.lens = lens
    this.grid = grid
    this.units = units
  }

  get head () {
    return this.units.cast(this.index, this.lens)
  }

  get tail () {
    return this.units.cast(this.index + this.value, this.lens)
  }

  get length () {
    // return this.units.cast(Math.abs(this.value - this.index), this.lens)
    return this.units.cast(this.value, this.lens)
  }

  get size () {
    return this.units.wrap(this.value, this.grid || this.tail, this.lens)
  }

  get loops () {
    return this.length / this.size
  }

  // TODO: Double-check this, just inherited it from voyager project
  get scope () {
    // return this.units.cast(this.size, { as: this.shape.as })
    return this.units.cast(this.size, this.lens)
  }

  // TODO: Use units.cyclic instead
  // cyclic (index = this.index, length = this.length) {
  cyclic (index = this.index, length = this.size) {
    return Math.max(0, index - this.head) % length
  }

  cursor (index = this.index, loop = 1) {
    return index + this.head + (this.scope * loop)
  }

  contains (index = this.index) {
  // includes (index = this.index) {
  // intersects (index = this.index) {
    return index >= this.head && index <= this.tail
  }

  beyond (index = this.index, cursor = this.index) {
    return index <= Math.floor(this.cyclic(cursor))
  }

  // TODO:
  //  - covers: determines if the section contains another section/range in its entirety

  // awaiting
  // eventual
  // incoming
  awaits (index = this.index, cursor = this.index) {
    const span = Math.floor(cursor) - this.head
    const loop = Math.floor(span / this.length)

    return this.cursor(index, loop) < this.tail

  }

  // delta(index) aka elapsed
  delta (index = this.index, lens = this.lens) {
    return this.units.delta(index, Object.assign(lens,
      { min: this.head, max: this.tail }
    ))
  }

}
