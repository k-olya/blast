// miscellaneous mathematical functions

// shuffle array
export function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}

// linear interpolation
export function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

// clamp value
export function clamp(x, min = 0.0, max = 1.0) {
  return Math.min(max, Math.max(min, x));
}
// extract fractional part glsl-style
export function fract(x) {
  return x - Math.floor(x);
}

// get random integer in the range [0, x)
export function irand(x) {
  Math.floor(Math.random() * x);
}
// get random number in the range [a, b)
export function rand(a, b) {
  return lerp(a, b, Math.random());
}
// create a range: [0, 1, 2, ..., x]
export function range(x) {
  return Array.from(Array(x).keys());
}
