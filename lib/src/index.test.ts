import { fibonacci } from './index'

test('test fibonacci', () => {
  const values = [
    1,
    2,
    3,
    5,
    8,
    13,
    21,
    34,
    55,
    89,
    144,
    233,
    377,
    610,
    987,
    1597,
    2584,
    4181,
    6765
  ]

  for (const i in values) {
    expect(fibonacci(+i + 1)).toBe(values[i])
  }
})
