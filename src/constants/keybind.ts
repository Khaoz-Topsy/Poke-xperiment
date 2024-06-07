export enum KeybindLookup {
  escape,
  up,
  down,
  left,
  right,
  w,
  s,
  a,
  d,
  space,
  del,
}

export const knownKeyCodes = {
  enter: 13,
  esc: 27,
  up: 38,
  tab: 9,
  down: 40,
} as const;
