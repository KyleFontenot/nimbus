/*
Simple decrypt to be used with the simpleencrypt function.
Server-side only!

The encrypt and decvrypt files are kept separately because official Sveltekti code restricts imports based on determined cleint or server-side code used.
The exported generateKeyPair() function is kept in this file since this file is server-side only, as generateKeyPair should be as well.

Naming convention being simple___ because I want to make it clear that this is not the most secure complex methods of encryption. Simply used for casual, quick, browser-accessible encryption.
*/
import { modPow } from "./encrypt";

type KeyPair = {
  n: number;
  e: number;
  d: number;
};

export function generateKeyPair(): { publicKey: KeyPair; privateKey: KeyPair } {
  function generatePrime(min: number, max: number) {
    const isPrime = (num: number) => {
      if (num <= 1) return false;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
      }
      return true;
    };

    for (let i = max; i >= min; i--) {
      if (isPrime(i)) return i;
    }
    throw new Error("No prime found in range");
  }
  function findPublicExponent(phi) {
    for (let e = 3; e < phi; e += 2) {
      if (gcd(e, phi) === 1) return e;
    }
    throw new Error("Could not find public exponent");
  }
  function computePrivateExponent(e, phi) {
    let d = 1;
    while (true) {
      if ((d * e) % phi === 1) return d;
      d++;
    }
  }

  // Choose two different prime numbers
  const p = generatePrime(100, 200);
  const q = generatePrime(50, 100);
  // Compute modulus
  const n = p * q;
  // Compute totient
  const phi = (p - 1) * (q - 1);
  // Choose public exponent (typically a prime)
  const e = findPublicExponent(phi);
  // Compute private exponent
  const d = computePrivateExponent(e, phi);

  return {
    publicKey: { n, e },
    privateKey: { n, d },
  };
}
function gcd(a: number, b: number) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

const decrypt = (encryptedMessage: string, privateKey: KeyPair): string =>
  encryptedMessage
    .split(",")
    .map((num) => {
      // Decrypt each number back to character
      const decrypted = modPow(
        Number.parseInt(num),
        privateKey.d,
        privateKey.n,
      );
      return String.fromCharCode(decrypted);
    })
    .join("");

export { decrypt }
// export default decrypt