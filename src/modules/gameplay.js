// in MVC term, this module represents the game's Model
import { irand, clamp } from "math";
const N = 9;
const M = 10;
const len = N * M;
const C = 5;
const K = 2;

let field;
let Kgroup;

// get value at (x, y) in field f
const get = (f, x, y) => f[clamp(y, 0, M - 1) * N + clamp(x, 0, N - 1)];

// set value at (x, y) in field f
const set = (f, x, y, v) => {
  f[clamp(y, 0, M - 1) * N + clamp(x, 0, N - 1)] = v;
};

// expose get and set to the console
window.get = (x, y) => get(field, x, y);
window.set = (x, y, v) => set(field, x, y, v);

// debug output for the playing field
const printNicely = f => {
  const s = f.reduce((acc, v, i) => acc + ((i + 1) % N ? v : `${v}\n`), "");
  console.log(s);
};

// map this to get all cells adjacent to a given cell
const adjacents = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

// find a group of items and calculate its size
const findKGroup = (x, y) => {
  Kgroup = new Uint8Array(len);
  // v is the value of the item under cursor
  const v = get(field, x, y);
  // k is a counter for adjacent items
  let k = 1;
  set(Kgroup, x, y, 1);
  // place directly adjacent cells to the processing stack
  // but only if they contain the necessary value
  let stack = adjacents
    .map(d => [x + d[0], y + d[1]])
    .filter(a => get(field, a[0], a[1]) === v);
  // use for from 0 to a very large number instead of while
  for (let i = 0; i < 0x7fffffff && stack.length; i++) {
    const [currentX, currentY] = stack.pop();
    const currentValue = get(field, currentX, currentY);
    if (get(Kgroup, currentX, currentY) === 0) {
      // inc the counter
      k++;
      // mark cell as visited and belonging to the group
      set(Kgroup, currentX, currentY, 1);
      for (let a of adjacents) {
        // calculate coordinates of an adjacent cell
        const s = [a[0] + currentX, a[1] + currentY];
        // if it's our value and the cell in question hasn't been visited
        if (v === get(field, s[0], s[1]) && get(Kgroup, s[0], s[1]) === 0) {
          stack.push(s);
        }
      }
    }
  }
  // if there are unprocessed cells left
  // it means we've hit a bug
  if (stack.length) {
    console.error("infinite loop in findKGroup");
  }

  printNicely(Kgroup);
  console.log(k);
};

window.makeTurn = (x, y) => {
  findKGroup(x, y);
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
  printNicely(field);
};

const teardown = () => {};

export const Gameplay = { setup, teardown };
