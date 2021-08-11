export default {
  lens: { unit: 'byte' },
  map: {
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
  }
}
