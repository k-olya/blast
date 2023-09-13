// in MVC term, this module represents the game's Model
import { irand, clamp } from "math";
const N = 2;
const M = 3;
const len = N * M;
const C = 5;

let field;

// get value at (x, y) in field f
const get = (f, x, y) => f[clamp(y, 0, M - 1) * N + clamp(x, 0, N - 1)];

// set value at (x, y) in field f
const set = (f, x, y, v) => {
  f[clamp(y, 0, M - 1) * N + clamp(x, 0, N - 1)] = v;
};

// expose get and set to the console
window.get = (x, y) => get(field, x, y);
window.set = (x, y, v) => set(field, x, y, v);

const printNicely = () => {
  const s = field.reduce((acc, v, i) => acc + ((i + 1) % N ? v : `${v}\n`), "");
  console.log(s);
};

const setup = () => {
  console.log(`setting up gameplay for a ${N} by ${M} field`);
  field = new Uint8Array(len);

  // generate game field
  for (let i = 0; i < len; i++) {
    // items are represented by numbers 1..C
    // with 0 signifying empty space
    field[i] = irand(C) + 1;
  }
  printNicely();
};

const teardown = () => {};

export const Gameplay = { setup, teardown };
