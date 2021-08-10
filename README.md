# segu
> :cyclone: Simplified linear unit conversions and transforms
---

## Intro

`segu` is a tiny yet powerful math library for working with continuous linear values across multiple units.

Simply provide `segu` with a key/value map of unit constants and you can effortlessly convert your values between any unit.

`segu` also provides some essential calculations for linear interpolation, transformation, etc.

## Features

 - Effortlessly convert between continous linear units
 - Define global unit conversions or provide them on a local per-case basis
 - Snap values to a generic grid
 - Cycle/wrap values between units within a range
 - Maintain absolute sizes and proportions of visual elements across devices

## Why?

There are already mature and robust libraries for performing these calculations and more, such as [`d3-scale`](https://github.com/d3/d3-scale) (**check this out first**).

`segu` does not aim to be a replacement for other similar solutions. It simply takes a different design approach by focusing on flexible and centralized conversions between units, and this may be a nice complement to other tools you're already using.

For instance, you can declaratively specify proportional units as a single object, minimizing complexity and freeing you from writing individual scaling functions for each type of conversion.

This allows systems to share and inherit common unit maps that are low impact and resilient to future changes. Tools such as JSON Schema can be used to enhance this aspect even further.

Lastly, `segu` elegantly handles values that overflow their context and must be wrapped or scrolled (e.g. a list of items that's wider than the screen, or repeated sections within music).

## Use Cases

 - HTML
 - SVG
 - Canvas
 - WebGL
 - PDF
 - CSS-in-JS
 - Clocks and timers
 - Animation and motion libraries
 - Generic layout engines
 - etc.


## Setup

```bash
$ npm i segu
```

## Usage

This example defines a unit `map` for common length units via `new Units({ map })`.

The base unit is the `inch` as all other unit constants in the map are proportional to it.

The convention is that the base unit has a value of `1`, but alternative values can be provided if necessary.

The `cast` method is essential as it's used to convert a value between two different units.

The conversion is configured with an object called a "lens", where `is` specifies the unit of the value being provided and `as` is the unit to convert to.

A default lens may be provided to the `Units` constructor, or, more commonly, you can provide a lens on a per-case basis.

```js
import { Units } from 'segu'

const length2 = new Units({
  map: {
    inch: 1,
    px: 1/96, // pixels
    pt: 1/72, // points
    pc: 1/16, // picas
    cm: 2.54, // centimeter
    si: 39.3701, // SI unit, meter
    meter: 39.3701,
    feet: 12,
    yard: 3 * 12,
    fathom: 6 * 12,
    furlong: 660 * 12,
    mile: 5280 * 12,
  }
  // lens: { ... }
})

length.cast(1/2, { is: 'foot', as: 'px' }) // 48

length.cast(20, { is: 'meter', as: 'yard' }) // 0.014111111111111109

length.cast(1920, { is: 'px', as: 'si' }) // 0.5079997256801481
```

### Approaches

The example above demonstrates my preferred style since you can simply pass around `length`.

It minimizes dependencies and makes performing centralized updates trivial.

It also provides a clear type-hint since both `is` and `as` are specified in each `cast`.

Ultimately, due to the simplicity of the API, you can structure your code basically any way you like.

For instance, if you're mostly converting units to/from `px`, you could either configure a global lense via the `unit` prop (uses value for both `is` and `as` in cast functions):

```js
const length = new Units({
  map: { ... },
  lens: { unit: 'px' }
})

length.cast(288, { as: 'inch' }) // 3 (px -> inch)
```

Or you could use a higher-order function to create fine-grained conversion functions if that's more your style:

```js
const length = new Units({ map: { ... } })
const px = is => value => length.cast(value, { is, as: 'px' })

const inch = px('inch')

inch(2) // 192
```

### API

### Lenses

Lenses encapsulate properties around unit conversion that are common to most functions.

Lenses can be defined globally via the `Units` constructor and/or locally in each function.

Every function can be provided with a lens object, but not all of them utilize every property (see their individual docs).

This object describes both the working unit types and their scope.

```js
{
  is: 'byte', // The default `is` unit value to use in functions that `cast`
  as: 'mib', // The default `as` unit value to use in functions that `cast`
  unit: 'byte', // Optional value specifying both `is` and `as` units (overrides `is` and `and`)
  origin: 0, // Offset value to use in functions that enforce scope (as `is` unit)
  min: 0, // The minimum unit value to use in functions that enforce scope (as `is` unit, default: 0)
  max: Math.pow(8, 8) // The maximum unit value to use in functions that enforce scope (as `is` unit, default: Number.MAX_SAFE_INTEGER)
}
```

All functional lenses are safely merged with an optional default/global lens provided to the `Units` constructor.

Both `is` and `as` may be provided as either a unit name (`string`), a `number` or an arbitrary `function`.

### Functions

#### cast

Converts a value from one unit to another.

Used by all other functions to perform conversions in-place.

```js
units.cast(4096, { is: 'byte', as: 'kib' }) // 4
```

#### snap

Snaps a value to a given unit (`to`) by rounding it.

Can be provided with a function (`calc`) for customizing rounding (default: `Math.floor`).

Does not cast values but you can use a subsesquent `cast` to achieve the same result.

Similar to [`d3-scale.rangeRound`](https://github.com/d3/d3-scale/blob/master/README.md#continuous_rangeRound).

```js
units.snap(1500, { to: 'kib' }) // 1024
units.snap(1000, { to: 'kib' }) // 0
units.snap(1000, { to: 'kib', calc: Math.ceil }) // 1024
```

#### clamp

Clamps a value between a min/max range of values.

Default `min` is `0`.

Default `max` is `Number.MAX_SAFE_INTEGER`.

```js
units.clamp(5000, { is: 'mb', as: 'gb', max: 4000 }) // 4
units.clamp(-10, { is: 'gib', as: 'mib', min: -5 }) // -5120
```

#### cyclic

Cycles a value across a min/max range.

Like clamp, but instead wraps the value instead of cutting it off.

Useful for condensing overflowed values into a wrappable scope, such as animation loops.

```js
units.cyclic(8, { min: -4, max: 12 }) // 8 (no effect, value in scope)
units.cyclic(-10, { min: -4, max: 12 }) // 2
units.cyclic(14, { is: 'byte', as: 'bit', min: -4, max: 12 }) // -16
```

#### lerp

Determines the value at a given ratio (i.e. basic linear interpolation).

```js
units.lerp(0.25, { min: 0, max: 16 }) // 4
units.lerp(0.25, { is: 'gb', as: 'gb', min: 0, max: 6 }) // 1.5
```

#### invlerp

Determines the ratio of a value. Inverse of lerp.

```js
units.invlerp(12, { min: 0, max: 16 }) // 0.75
units.invlerp(12, { is: 'gb', as: 'gib', min: 0, max: 30 }) // 0.4
```

#### ratio
#### progress
#### fold

## Rationale

`segu`'s interface arose out of several projects I was working on related to music.

I needed a clean, centralized way to convert between beat units, milliseconds, pixels, SI units and more.

Because I was using similar logic in WebGL, SVG and HTML, I also needed a solution that was generic and consistent across various domains.

The solution I created ended up being very useful; I was able to effortlessly convert between units and supported every common operation I needed, regardless of where I was using them.

It also paired cleanly with other tools I was already using, such as `d3` and `threejs`.

`segu` is the condensed and packaged version of this work that I wish to share with others.

## Roadmap

- [ ] Scaling functions
  * [ ] Quantitative
  * [ ] Discrete
  * [ ] Discretizing
- [ ] Domain/range mappings
- [ ] `quantize`
