const N = 9;
const M = 10;
const C = 5;

let field;

const setup = () => {
  console.log(`setting up gameplay for an ${N} by ${M} field`);
  field = new UInt8Array(N * N);
};

const teardown = () => {};

export const Gameplay = { setup, teardown };
