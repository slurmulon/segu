// TODO: Support calc method for allowing conversion of units via string (like CSS):
//  - e.g. calc(1mile - 500px)

import { Lens } from './lens'
import { gcd, cyclic, clamp, lerp, invlerp } from './math'

export class Units {

  constructor ({
    map = {},
    lens = {}
  } = {}) {
    this.map = map
    this.lens = new Lens(lens)
  }

  normalize (unit) {
    if (typeof unit === 'number') {
      return unit
    }

    if (typeof unit === 'string') {
      const value = this.map[unit] || 1

      return typeof value === 'function' ? value(unit, this) : Number(value)
    }

    return 1
  }

  scope (value = 1, lens = this.lens) {
    const { is, as, min, max, origin } = this.lens.use(lens)
    const index = this.cast(value - origin, { is, as })
    const head = this.cast(min || 0, { is, as })
    const tail = this.cast(max || value, { is, as })

    return { value, index, head, tail }
  }

  // TODO: Allow `is` and `as` to be provided as mapping functions
  cast (value = 1, { is = this.lens.unit, as = this.lens.unit } = {}) {
    return this.normalize(value) / (this.normalize(as) / this.normalize(is))
  }

  snap (value, lens = this.lens) {
    const { index } = this.scope(value, lens)
    const unit = this.normalize(lens.as || lens.unit)
    const calc = typeof lens.calc === 'function' ? lens.calc : Math.floor

    return calc(index) * unit
  }

  clamp (value, lens) {
    const { index, head, tail } = this.scope(value, lens)

    return clamp(index, head, tail)
  }

  cyclic (value, lens) {
    const { index, head, tail } = this.scope(value, lens)

    return cyclic(index, head, tail)
  }

  lerp (ratio, lens) {
    const { head, tail } = this.scope(0, lens)

    return lerp(ratio, head, tail)
  }

  invlerp (value, lens) {
    const { index, head, tail } = this.scope(value, lens)

    return invlerp(index, head, tail)
  }

  delta (value, lens) {
    const { index, head } = this.scope(value, lens)

    return index - head
  }

  range (value, lens) {
    const { head, tail } = this.scope(value, lens)

    return tail - head
  }

  progress (value, lens) {
    const delta = this.delta(value, lens)
    const range = this.range(value, lens)

    return delta / range
  }

  fold (value, lens = this.lens) {
    const grid = lens.grid || 1
    const basis = gcd(value, grid)
    const size = this.clamp(value, lens)
    const container = this.snap(size, { as: basis })
    const ratio = Math.max(1, Math.min(value / basis, grid))
    const min = value >= grid ? grid : basis

    return Math.max(min, this.snap(container, { as: ratio }))
  }

  // Changes the base unit to the provided key by recalculating and replacing the unit map pairs.
  // TODO: Test, and ensure that the base unit is equal to 1 (or, could just use scale)
  rebase (unit = this.lens.unit) {
    if (unit === this.lens.unit) return this

    const map = Object.entries(this.map)
      .reduce((map, [key, value]) => Object.assign(map, {
        [key]: this.cast(value, { is: this.lens.is, as: unit })
      }, { [unit]: 1 }))

    this.map = map
    this.lens.unit = unit

    return this
  }

  clone (props) {
    const map = Object.assign({}, this.map, props.map)
    const lens = Object.assign({}, this.lens, props.lens)

    return new Units({ map, lens })
  }

  static use (props) {
    return new Units(props)
  }
}

export const units = props => new Units(props)
