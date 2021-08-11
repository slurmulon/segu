export class Lens {

  constructor ({
    unit = 1,
    is = 1,
    as = 1,
    min = 0,
    max = 1,
    grid = 1,
    origin = 0
  } = {}) {
    this.data = { unit, is, as, min, max, grid, origin }
    // Would improve flexibility by wrapping all getters in Lens with this, allowing Units and Lens to use the same normalization function
    // this.normalize = normalize || Units.normalize
  }

  get unit () {
    // return this.data.unit || 1
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
    this.data = this.use(data)

    return this
  }

}
