let events = {};
export const unbind = (ev, cb) => {
  events[ev] = events[ev]?.filter(x => x !== cb);
};
export const on = (ev, cb) => {
  events[ev] = events[ev]?.push(cb) || (events[ev] = [cb]);
  return () => {
    unbind(ev, cb);
  };
};
export const emit = (ev, ...a) => {
  let cbs = events[ev] || [];
  for (let i = 0, l = cbs.length; i < l; i++) {
    cbs[i](...a);
  }
};
