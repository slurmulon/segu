export default {
  lens: { unit: 'inch' },
  map: {
    inch: 1,
    px: 1/96, // pixels
    pt: 1/72, // points
    pc: 1/16, // picas
    cm: 2.54, // centimeter
    meter: 39.3701,
    feet: 12,
    yard: 3 * 12,
    fathom: 6 * 12,
    furlong: 660 * 12,
    mile: 5280 * 12,
  }
}
