class Lens {

  constructor ({
    unit = 1,
    is = 1,
    as = 1,
    min = 0,
    max = 1,
    grid = 1,
    origin = 0
  } = {}) {
    this.data = { unit, is, as, min, max, grid, origin };
    // Would improve flexibility by wrapping all getters in Lens with this, allowing Units and Lens to use the same normalization function
    // this.normalize = normalize || Units.normalize
  }

  get unit () {
    return this.data.unit || this.data.is || 1
  }

  get is () {
    return this.data.is || this.unit
  }

  get as () {
    return this.data.as || this.unit
  }

  get min () {
    return this.data.min || 0
  }

  get max () {
    return this.data.max || Number.MAX_SAFE_INTEGER
  }

  get grid () {
    return this.data.grid || 1
  }

  get origin () {
    return this.data.origin || 0
  }

  use (data) {
    return Object.assign({}, this.data, data)
  }

  assign (data) {
    this.data = this.use(data);

    return this
  }

}

/**
 * Recursively calculates the greatest common denominator (GCD) between two values
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {Number}
 */
function gcd (x, y) {
  return y === 0 ? x : gcd(y, x % y)
}

/**
 * Modifies a value so that it is always between x and y
 *
 * @param {Number} value
 * @param {Number} x
 * @param {Number} y
 * @returns {Number}
 */
function clamp (value, x = 0, y = 1) {
  return Math.min(y, Math.max(x, value))
}

/**
 * Interpolation function returning the value between x and y at a specific ratio
 *
 * @param {Number} value
 * @param {Number} x
 * @param {Number} y
 * @returns {Number}
 */
function lerp (ratio, x, y) {
  return (x * (1 - ratio)) + (y * ratio)
}

/**
 * Interpolation function returning the ratio of a value clamped between x and y
 *
 * @param {Number} value
 * @param {Number} x
 * @param {Number} y
 * @returns {Number}
 */

function invlerp (value, x, y) {
  return clamp((value - x) / (y - x))
}

/**
 * Cycles a value around an range (from x to y).
 *
 * @param {Number} value
 * @param {Number} x
 * @param {Number} y
 * @returns {Number}
*/
function cyclic (value, x, y) {
  return (value >= x ? value : value + y) % y
}

/**
 * Projects a value given a source domain (from) to a target domain (to).
 * Domains are provided as range tuples ([min, max]).
 *
 * @param {Number} value
 * @param {Array<Number>} from
 * @param {Array<Number>} to
 * @returns {Number}
 */
function project (value, from = [0, 0], to = [0, 0]) {
  return (value - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0]
}

/**
 * Determines the element found in an array at a given ratio
 *
 * @param {Float} ratio
 * @param {Array} all
 */
function steps (ratio, all) {
  ratio %= 1;

  if (ratio < 0) ratio += 1;

  return all[Math.floor(ratio * all.length)]
}

// TODO: Support calc method for allowing conversion of units via string (like CSS):

class Units {

  constructor ({
    map = {},
    lens = {}
  } = {}) {
    this.map = map;
    this.lens = new Lens(lens);
  }

  normalize (unit) {
    if (typeof unit === 'number') {
      return unit
    }

    if (typeof unit === 'string') {
      const value = this.map[unit] || 1;

      return typeof value === 'function' ? value(unit, this) : Number(value)
    }

    return 1
  }

  scope (value = 1, lens = this.lens) {
    const { is, as, min, max, origin } = this.lens.use(lens);
    const index = this.cast(value - origin, { is, as });
    const head = this.cast(min || 0, { is, as });
    const tail = this.cast(max || value, { is, as });

    return { value, index, head, tail }
  }

  // TODO: Allow `is` and `as` to be provided as mapping functions
  cast (value = 1, { is = this.lens.unit, as = this.lens.unit } = {}) {
    return this.normalize(value) / (this.normalize(as) / this.normalize(is))
  }

  snap (value, lens = this.lens) {
    const { index } = this.scope(value, lens);
    const unit = this.normalize(lens.as || lens.unit);
    const calc = typeof lens.calc === 'function' ? lens.calc : Math.floor;

    return calc(index) * unit
  }

  clamp (value, lens) {
    const { index, head, tail } = this.scope(value, lens);

    return clamp(index, head, tail)
  }

  cyclic (value, lens) {
    const { index, head, tail } = this.scope(value, lens);

    return cyclic(index, head, tail)
  }

  lerp (ratio, lens) {
    const { head, tail } = this.scope(0, lens);

    return lerp(ratio, head, tail)
  }

  invlerp (value, lens) {
    const { index, head, tail } = this.scope(value, lens);

    return invlerp(index, head, tail)
  }

  delta (value, lens) {
    const { index, head } = this.scope(value, lens);

    return index - head
  }

  range (value, lens) {
    const { head, tail } = this.scope(value, lens);

    return tail - head
  }

  progress (value, lens) {
    const delta = this.delta(value, lens);
    const range = this.range(value, lens);

    return delta / range
  }

  fold (value, lens = this.lens) {
    const grid = lens.grid || 1;
    const basis = gcd(value, grid);
    const size = this.clamp(value, lens);
    const container = this.snap(size, { as: basis });
    const ratio = Math.max(1, Math.min(value / basis, grid));
    const min = value >= grid ? grid : basis;

    return Math.max(min, this.snap(container, { as: ratio }))
  }

  // Changes the base unit to the provided key by recalculating and replacing the unit map pairs.
  // TODO: Test, and ensure that the base unit is equal to 1 (or, could just use scale)
  rebase (unit = this.lens.unit) {
    if (unit === this.lens.unit) return this

    const map = Object.entries(this.map)
      .reduce((map, [key, value]) => Object.assign(map, {
        [key]: this.cast(value, { is: this.lens.is, as: unit })
      }, { [unit]: 1 }));

    this.map = map;
    this.lens.unit = unit;

    return this
  }

  clone (props) {
    const map = Object.assign({}, this.map, props.map);
    const lens = Object.assign({}, this.lens, props.lens);

    return new Units({ map, lens })
  }

  static use (props) {
    return new Units(props)
  }
}

const units = props => new Units(props);

export { Units, clamp, cyclic, gcd, invlerp, lerp, project, steps, units };
//# sourceMappingURL=segu.esm.js.map
