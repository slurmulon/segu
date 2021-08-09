import { Units } from '../src/units'

const units = new Units()

describe('constructor', () => {

})

describe('cast', () => {
  it('byte -> bit', () => {
    const result = units.cast(4, { is: 'byte', as: 'bit' })

    expect(result).toBe(32)
  })

  it('bit -> byte', () => {
    const result = units.cast(64, { is: 'byte', as: 'bit' })

    expect(result).toBe(512)
  })

  it('byte -> kb', () => {
    const result = units.cast(2000, { is: 'byte', as: 'kb' })

    expect(result).toBe(2)
  })

  it('byte -> kib', () => {
    const result = units.cast(4096, { is: 'byte', as: 'kib' })

    expect(result).toBe(4)
  })

  it('kb -> mb', () => {
    const result = units.cast(8500, { is: 'kb', as: 'mb' })

    expect(result).toBe(8.5)
  })

  it('kb -> kib', () => {
    const result = units.cast(10, { is: 'kb', as: 'kib' })

    expect(result).toBe(9.765625)
  })

  it('mib -> gb', () => {
    const result = units.cast(1000, { is: 'mib', as: 'gb' })

    expect(result).toBe(1.048576)
  })
})

describe('snap', () => {
  describe('calc', () => {
    it('floor (default)', () => {
      const result = units.snap(1500, { to: 'kib' })

      expect(result).toBe(1024)
    })

    it('floor (zero)', () => {
      const result = units.snap(1000, { to: 'kib' })

      expect(result).toBe(0)
    })

    it('ceil', () => {
      const result = units.snap(1500, { to: 'kib', calc: Math.ceil })

      expect(result).toBe(2048)
    })

    it('round (down)', () => {
      const result = units.snap(1500, { to: 'kib', calc: Math.round })

      expect(result).toBe(1024)
    })

    it('round (up)', () => {
      const result = units.snap(1984, { to: 'kib', calc: Math.round })

      expect(result).toBe(2048)
    })

    it('custom', () => {
      const result = units.snap(2048, { to: 'kib', calc: x => x * 2 })

      expect(result).toBe(4096)
    })
  })
})

// describe('scope', () => {
  // describe('provides an object with cast units describing a scope (used by other methods)', () => {
  //   it('defaults to full scope', () => {
  //     const result = units.scope(4)

  //     expect(result).toEqual({ duration: 4, index: 4, head: 0, tail: 40 })
  //   })

  //   it('using cast', () => {
  //     // const result = units.scope(
  //   })

  //   it('using min', () => {
  //     const result = units.scope(4, { min: 2 })

  //     expect(result).toEqual({ duration: 4, index: 4, head: 2, tail: 40 })
  //   })

  //   it('using max', () => {
  //     const result = units.scope(4, { max: 25 })

  //     expect(result).toEqual({ duration: 4, index: 4, head: 0, tail: 25 })
  //   })

  //   it('using min + max', () => {
  //     const result = units.scope(4, { min: 3, max: 8 })

  //     expect(result).toEqual({ duration: 4, index: 4, head: 3, tail: 8 })
  //   })
  // })
// })

// describe('ratio', () => {
  // describe('provides the ratio of a duration in relation to the total', () => {
  //   it('using steps', () => {
  //     const result = units.ratio(16)

  //     expect(result).toBe(0.4)
  //   })
  // })
// })

// describe('progress', () => {
  // describe('provides the progress of a duration (between 0 and 1) within a scope', () => {
  //   it('using default scope', () => {
  //     const result = units.progress(10)

  //     expect(result).toBe(0.25)
  //   })

  //   it('using cast', () => {

  //   })

  //   it('using min', () => {
  //     const result = units.progress(30, { min: 20 })

  //     expect(result).toBe(0.5)
  //   })

  //   it('using max', () => {
  //     const result = units.progress(30, { min: 20 })

  //     expect(result).toBe(0.5)
  //   })

  //   it('using min + max', () => {
  //     const result = units.progress(14, { min: 7, max: 21 })

  //     expect(result).toBe(0.5)
  //   })
  // })
// })

describe('clamp', () => {
  describe('ensures duration fits within a min/max range', () => {
    it('max', () => {
      const result = units.clamp(5000, { is: 'mb', as: 'gb', max: 4000 })

      expect(result).toBe(4)
    })

    it('min', () => {
      const result = units.clamp(-10, { is: 'gib', as: 'mib', min: -5 })

      expect(result).toBe(-5120)
    })
  })
})

describe('cyclic', () => {
  describe('wraps values around a range', () => {
    it('max', () => {
      const result = units.cyclic(92, { max: 64 })

      expect(result).toBe(28)
    })

    it('min', () => {
      const result = units.cyclic(-10, { min: -4, max: 12 })

      expect(result).toBe(2)
    })
  })
})

describe('lerp', () => {
  describe('determines a unit value at a given ratio', () => {
    it('basic', () => {
      const result = units.lerp(0.25, { min: 0, max: 16 })

      expect(result).toBe(4)
    })

    it('casting', () => {
      const result = units.lerp(0.25, { is: 'gb', as: 'gb', min: 0, max: 6 })

      expect(result).toBe(1.5)
    })
  })
})

describe('invlerp', () => {
  describe('determines the ratio of a value', () => {
    it('basic', () => {
      const result = units.invlerp(12, { min: 0, max: 16 })

      expect(result).toBe(0.75)
    })

    it('casting', () => {
      const result = units.invlerp(12, { is: 'gb', as: 'gib', min: 0, max: 30 })

      expect(result).toBe(0.4)

    })
  })
})

describe('delta', () => {
  describe('determines the difference between the value and its head/min', () => {
    it('basic', () => {
      const result = units.delta(12, { min: 4 })

      expect(result).toBe(8)
    })

    it('casting', () => {
      const result = units.delta(6, { is: 'gb', as: 'mb', min: 2 })

      expect(result).toBe(4000)
    })
  })
})

describe('range', () => {

})

describe('ratio', () => {

})

describe('progress', () => {

})

describe('wrap', () => {
  describe('clamps and snaps values around a grid unit', () => {
    it('snaps to ratio of value when less than max', () => {
      const result = units.wrap(10, 8, { max: 12 })

      expect(result).toBe(10)
    })

    it('snaps to ratio of grid when value exceeds max', () => {
      // const result = units.wrap(14, 8, { max: 16 })
      const result = units.wrap(14, 8, { max: 12 })

      expect(result).toBe(8)
    })
  })
})
