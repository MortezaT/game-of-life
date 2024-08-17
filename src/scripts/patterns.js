export const patterns = {
  spaceships: {
    glider: [
      [true, false, true],
      [false, true, true],
      [false, true, false],
    ],
    LWSS: [
      [false, false, true, true, false],
      [true, true, false, true, true],
      [true, true, true, true, false],
      [false, true, true, false, false]
    ],
    MWSS: [
      [false, true, true, true, true, true],
      [true, false, false, false, false, true],
      [false, false, false, false, false, true],
      [true, false, false, false, true, false],
      [false, false, true, false, false, true]
    ],
    HWSS: [
      [false, true, true, true, true, true, true],
      [true, false, false, false, false, false, true],
      [false, false, false, false, false, false, true],
      [true, false, false, false, false, true, false],
      [false, false, true, true, false, false, false]
    ]
  },
  oscillators: {
    blinker: [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ],
    toad: [
      [false, true, true, true],
      [true, true, true, false]
    ],
    beacon: [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, true, true],
      [false, false, true, true],
    ],
    pulsar: [
      [false, false, true, true, true, false, false, false, true, true, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [false, false, true, true, true, false, false, false, true, true, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, true, true, true, false, false, false, true, true, true, false, false],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [true, false, false, false, false, true, false, true, false, false, false, false, true],
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, true, true, true, false, false, false, true, true, true, false, false]
    ],
    pentaDecathlon: [
      [false, true, false],
      [false, true, false],
      [true, false, true],
      [false, true, false],
      [false, true, false],
      [false, true, false],
      [false, true, false],
      [true, false, true],
      [false, true, false],
      [false, true, false],
    ]
  },
  still: {
    block: [
      [true, true],
      [true, true]
    ],
    beeHive: [
      [false, true, true, false],
      [true, false, false, true],
      [false, true, true, false]
    ],
    loaf: [
      [false, true, true, false],
      [true, false, false, true],
      [false, true, false, true],
      [false, false, true, false]
    ],
    boat: [
      [true, true, false],
      [true, false, true],
      [false, true, false]
    ],
    tub: [
      [false, true, false],
      [true, false, true],
      [false, true, false]
    ]
  }
};