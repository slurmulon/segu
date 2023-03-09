/**
 * Recursively calculates the greatest common denominator (GCD) between two values
 *
 * @param {Number} x
 * @param {Number} y
 * @returns {Number}
 */
export function gcd (x, y) {
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
export function clamp (value, x = 0, y = 1) {
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
export function lerp (ratio, x, y) {
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

export function invlerp (value, x, y) {
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
export function cyclic (value, x, y) {
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
export function project (value, from = [0, 0], to = [0, 0]) {
  return (value - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0]
}

/**
 * Determines the element found in an array at a given ratio
 *
 * @param {Float} ratio
 * @param {Array} all
 */
export function steps (ratio, all) {
  ratio %= 1

  if (ratio < 0) ratio += 1

  return all[Math.floor(ratio * all.length)]
}
