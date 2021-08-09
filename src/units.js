import { gcd, clamp, lerp } from './math'
import memoize from 'memoizee'

export class Units {

  constructor ({
    map = BYTE_UNIT_MAP,
    lens = BYTE_UNIT_LENS,
    // basis
    // base = 'base',
    // scale = 1,
    // origin = 0,
    // min = 0,
    // max = 100
    // max = Number.MAX_SAFE_INTEGER / 2
    // max = Number.MAX_SAFE_INTEGER
  } = {}) {
    this.map = map
    this.lens = lens
    // this.base = base
    // // this.scale = scale
    // this.grid = grid
    // this.origin = origin
    // this.min = min
    // this.max = max
  }

  // get defaults () {
    // return {
    //   base: 'step'
    //   scale: 1,
    //   origin: 0,
    //   min: 0,
    //   max: 100
    // }
  // }

  // assign (map)

  scope (value, {
    is = this.lens.unit,
    as = this.lens.unit,
    min = this.lens.min,
    max = this.lens.max,
    origin = this.lens.origin
  } = {}) {
    const index = this.cast(value - origin, { is, as })
    const head = this.cast(min || 0, { is, as })
    const tail = this.cast(max || value, { is, as })

    return { value, index, head, tail }
  }

  cast (value, { is = this.lens.unit, as = this.lens.unit } = {}) {
    return value / (this.map[as] / this.map[is])
  }

  snap (value, { to = this.lens.unit, calc = Math.floor } = {}) {
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

  lerp (ratio, { is = this.lens.unit, min = this.lens.min, max = this.lens.max } = {}) {
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

  // TODO: Rename `edge` and/or `scale` to `grid`
  // wrap (value, edge = this.scale, lens) {
  wrap (value, grid = this.grid, lens = this.lens) {
    const basis = gcd(value, grid)
    const size = this.clamp(value, lens)
    const container = this.snap(size, basis)
    const ratio = Math.max(1, Math.min(value / basis, grid))
    const min = value >= grid ? grid : basis

    return Math.max(min, this.snap(container, ratio))
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

  // quantize
  //
  static use (props) {
    return new Units(props)
  }
}

export const units = memoize(props => new Units(props))

export const BYTE_UNIT_LENS = Object.freeze({
  unit: 'byte',
  origin: 0,
  grid: 1,
  min: 0,
  max: Number.MAX_SAFE_INTEGER
})

export const LENGTH_UNIT_MAP = Object.freeze({
  // base: 1,
  inch: 1,
  px: 1/96, // pixels
  pt: 1/72, // points
  pc: 1/16, // picas
  cm: 2.54, // centimeter
  meter: 0.0254,
  feet: 12,
  yard: 3 * 12,
  fathom: 6 * 12,
  furlong: 660 * 12,
  mile: 5280 * 12,
})

export const BYTE_UNIT_MAP = Object.freeze({
  // base: 1, // byte
  byte: 1,
  bit: 1/8,
  kb: Math.pow(10, 3),
  mb: Math.pow(10, 6),
  gb: Math.pow(10, 9),
  tb: Math.pow(10, 12),
  pb: Math.pow(10, 15),
  kib: Math.pow(2, 10),
  mib: Math.pow(2, 20),
  gib: Math.pow(2, 30),
  tib: Math.pow(2, 40)
})

export default Units
