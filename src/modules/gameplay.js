// in MVC term, this module represents the game's Model
import { irand, clamp } from "math";
import { emit } from "ev";

const N = 9;
const M = 10;
const len = N * M;
const C = 5;
const K = 2;

let field;
let group;
let score;

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
  group = new Uint8Array(len);
  // v is the value of the item under cursor
  const v = get(field, x, y);
  // k is a counter for adjacent items
  let k = 1;
  set(group, x, y, 1);

  // js engines don't have tail-call optimizations
  // so we're going to have to use a stack-based algorithm

  // place directly adjacent cells to the processing stack
  // but only if they contain the necessary value
  let stack = adjacents
    .map(d => [x + d[0], y + d[1]])
    .filter(a => get(field, a[0], a[1]) === v);
  // use for from 0 to a very large number instead of while
  for (let i = 0; i < 0x7fffffff && stack.length; i++) {
    const [currentX, currentY] = stack.pop();
    if (get(group, currentX, currentY) === 0) {
      // inc the counter
      k++;
      // mark cell as visited and belonging to the group
      set(group, currentX, currentY, 1);
      for (let a of adjacents) {
        // calculate coordinates of an adjacent cell
        const s = [a[0] + currentX, a[1] + currentY];
        // if it's our value and the cell in question hasn't been visited
        if (v === get(field, s[0], s[1]) && get(group, s[0], s[1]) === 0) {
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

  return { group, k };
};

// generate falling pillars of items
const getPillars = group => {
  const pillars = [];
  for (let i = 0; i < N; i++) {
    // go from top to bottom
    let fallHeight = 0;
    let currentPillar = [];
    for (let j = M - 1; j >= 0; j--) {
      // if it's a chunk of empty space
      // push current pillar to the array
      if (get(group, i, j) === 1) {
        fallHeight++;
        if (currentPillar.length) {
          pillars.push({
            x: i,
            y: j + 1,
            height: fallHeight - 1,
            content: currentPillar,
          });
          currentPillar = [];
        }
        // else add elements to the current pillar
      } else if (fallHeight) {
        currentPillar.push(get(field, i, j));
      }
    }
    // add remaining pillar to the array
    // and fill empty space with new items
    if (fallHeight) {
      for (let j = 0; j < fallHeight; j++) {
        currentPillar.push(irand(C) + 1);
      }
      pillars.push({
        x: i,
        y: -fallHeight,
        height: fallHeight,
        content: currentPillar,
      });
    }
  }
  return pillars;
};

// remove blasted and falling cells
const removeCells = group => {
  for (let i = 0; i < N; i++) {
    // go from top to bottom
    let fallHeight = 0;
    for (let j = M - 1; j >= 0; j--) {
      if (get(group, i, j) === 1) {
        fallHeight++;
      }
      if (fallHeight) {
        set(field, i, j, 0);
      }
    }
  }
};

// function that makes items fall into place
const fillFieldWithPillars = pillars => {
  for (let p of pillars) {
    const { x, y, height, content } = p;
    for (let j = 0, l = content.length; j < l; j++) {
      set(field, x, y + l - 1 + height - j, content[j]);
    }
  }
};

// calculate score
const updateScore = k => {
  score += Math.round(Math.pow(2, k));
};

window.makeTurn = (x, y) => {
  const { group, k } = findKGroup(x, y);
  printNicely(group);
  console.log("k", k);
  // schedule animations
  if (k < K) {
    emit("bad-move", group);
    return;
  }
  emit("blast", group);

  // get falling pillars
  const pillars = getPillars(group);
  // clear removed and falling items
  removeCells(group);
  printNicely(field);
  // push intermediate state to the renderer
  emit("field", field);
  // tell renderer to queue fall animation
  emit("falling", pillars);
  console.log(pillars);
  // fill empty field space
  fillFieldWithPillars(pillars);
  printNicely(field);
  // push field state to the renderer
  emit("field", field);
  // update score
  updateScore(k);
  emit("score", score);
  console.log("score", score);
  // end turn
  emit("end-turn");
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
  // emit field update event
  // for the renderer to handle
  emit("field", field);
  printNicely(field);
  // set score to zero
  score = 0;
  emit("score", 0);
};

const teardown = () => {};

export const Gameplay = { setup, teardown };
