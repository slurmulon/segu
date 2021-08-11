export class Lens {

  constructor ({ unit = 1, is = 1, as = 1, min = 0, max = 1, origin = 0 } = {}) {
    this.data = { unit, is, as, min, max, origin }
  }

  get is () {
    return this.data.is || this.data.unit
  }

  get as () {
    return this.data.as || this.data.unit
  }

  get min () {
    return this.data.min || 0
  }

  get max () {
    return this.data.max
  }

  use (data) {
    return Object.assign({}, this.data, data)
  }

}
