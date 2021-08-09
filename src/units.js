import { gcd, clamp, lerp, invlerp } from './math'
import memoize from 'memoizee'

export class Units {

  constructor ({
    map = BYTE_UNIT_MAP,
    lens = BYTE_UNIT_LENS
  } = {}) {
    this.map = map
    this.lens = lens
  }

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

  normalize (unit) {
    if (typeof unit === 'number') {
      return unit
    }

    if (typeof unit === 'string') {
      const value = this.map[unit] || 1

      return typeof value === 'function' ? value(unit) : Number(value)
    }

    return 1
  }

  cast (value, { is = this.lens.unit, as = this.lens.unit } = {}) {
    return this.normalize(value) / (this.normalize(as) / this.normalize(is))
  }

  snap (value, { to = this.lens.unit, calc = Math.floor } = {}) {
    const unit = this.normalize(to)
    const adjust = typeof calc === 'function' ? calc : _ => _
    const snapped = adjust(value / unit) * unit

    return snapped || 0
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

  ratio (value, lens) {
    const { index, tail } = this.scope(duration, lens)

    return index / tail
  }

  progress (value, lens) {
    const delta = this.delta(value, lens)
    const range = this.range(value, lens)

    return delta / range
  }

  // wrap (value, grid = this.grid, lens = this.lens) {
  wrap (value, grid = 1, lens = this.lens) {
    const basis = gcd(value, grid)
    const size = this.clamp(value, lens)
    const container = this.snap(size, { to: basis })
    const ratio = Math.max(1, Math.min(value / basis, grid))
    const min = value >= grid ? grid : basis

    return Math.max(min, this.snap(container, { to: ratio }))
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

export const UNIT_LENS = Object.freeze({
  origin: 0,
  grid: 1,
  min: 0,
  max: Number.MAX_SAFE_INTEGER
})

export const BYTE_UNIT_LENS = Object.freeze({ unit: 'byte', ...UNIT_LENS })

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


export default Units
