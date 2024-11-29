export const fibonacci = (num: number): number => {
  return num > 1 ? fibonacci(num - 1) + fibonacci(num - 2) : 1
}
