import { gcd, clamp, lerp } from './math'
import memoize from 'memoizee'

export class Units {

  constructor ({
    map = {},
    // basis
    base = 'step',
    scale = 1,
    origin = 0,
    min = 0,
    max = 100
    // max = Number.MAX_SAFE_INTEGER
  } = {}) {
    this.map = map
    this.base = base
    this.scale = scale
    this.origin = origin
    this.min = max
    this.max = max
  }

  // assign (map)

  scope (value, {
    is = this.base,
    as = this.base,
    min = this.min,
    max = this.max,
    origin = this.origin
  } = {}) {
    const index = this.cast(value - origin, { is, as })
    const head = this.cast(min || 0, { is, as })
    const tail = this.cast(max || value, { is, as })

    return { value, index, head, tail }
  }

  cast (value, { is = this.base, as = this.base } = {}) {
    return value / (this.map[as] / this.map[is])
  }

  snap (value, { to = this.base, calc = Math.floor } = {}) {
    const apply = typeof calc === 'function' ? calc : _ => _

    return apply(value / to) * to
  }

  clamp (value, lens) {
    const { index, head, tail } = this.scope(value, lens)

    return clamp(index, head, tail)
  }

  cyclic (value, lens) {
    const { index, total, head, tail } = this.scope(value, lens)
    const key = index >= head ? index : index + tail

    return key % tail
  }

  lerp (ratio, { is = this.base, min = this.min, max = this.max } = {}) {
    const head = this.cast(min || 0, { is, as: this.base })
    const tail = this.cast(max || 0, { is, as: this.base })

    return lerp(ratio, head, tail)
  }

  invlerp (value, lens) {
    const { index, head, tail } = this.scope(value, lens)

    return invlerp(ratio, head, tail)
  }

  delta (value, lens) {
    const { index, head } = this.scope(value, lens)

    return index - head
  }

  range (value, lens) {
    const { index, head, tail } = this.scope(value, lens)

    return tail - head
  }

  ratio (value, lens) {
    const { index, tail } = this.scope(duration, lens)

    return index / tail
  }

  progress (value, lens) {
    const delta = this.delta(value, lens)
    const range = this.range(value, lens)

    return delta / range
  }

  wrap (value, edge = this.scale, lens) {
    const basis = gcd(value, edge)
    const size = this.clamp(value, lens)
    const container = this.snap(size, basis)
    const ratio = Math.max(1, Math.min(value / basis, edge))
    const min = value >= edge ? edge : basis

    return Math.max(min, this.snap(container, ratio))
  }

  // Changes the base unit to the provided key by recalculating and replacing the unit map pairs.
  // TODO: Test, and ensure that the base unit is equal to 1 (or, could just use scale)
  rebase (unit = this.base) {
    if (unit === this.base) return this

    const map = Object.entries(this.map)
      .reduce((map, [key, value]) => Object.assign(map, {
        [key]: this.cast(value, { is: this.base, as: unit })
      }, { [unit]: 1 }))

    this.map = map
    this.base = unit

    return this
  }

  // quantize
  //
  static use (props) {
    return new Units(props)
  }
}

export const units = memoize(props => new Units(props))

export default Units
