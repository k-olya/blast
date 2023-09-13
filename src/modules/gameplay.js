// in MVC term, this module represents the game's Model
import { irand } from "math";
const N = 9;
const M = 10;
const len = N * M;
const C = 5;

let field;

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
