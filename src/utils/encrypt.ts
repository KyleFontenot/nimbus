/*
Simple encrypt to be used with the function.
Client-side only!

The encrypt and decvrypt files are kept separately because official Sveltekti code restricts imports based on determined cleint or server-side code used.
*/

type KeyPair = {
  n: number;
  e: number;
  d: number;
};

const modPow = (_base: number, _exponent: number, modulus: number) => {
  let base = _base;
  let exponent = _exponent;
  if (modulus === 1) return 0;
  let result = 1;
  base = _base % modulus;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }
  return result;
};

const simpleencrypt = (message: string, publicKey: KeyPair) =>
  message
    .split("")
    .map((char) => {
      // Convert character to number and apply encryption
      const m = char.charCodeAt(0);
      return modPow(m, publicKey.e, publicKey.n);
    })
    .join(",");

export { simpleencrypt, modPow };
