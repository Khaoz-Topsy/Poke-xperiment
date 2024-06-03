import { onCleanup, onMount } from 'solid-js';

import Mousetrap, { ExtendedKeyboardEvent } from 'mousetrap';
import { KeybindLookup, knownKeybinds } from '../constants/keybind';
import { preventDefault } from '../helper/documentHelper';
import { Direction } from '../constants/enum/direction';

export const useKeyboard = (
  onKey: (e: ExtendedKeyboardEvent, keybind: KeybindLookup) => void,
): void => {
  const keysToBind: Array<{ keybind: KeybindLookup; alias?: KeybindLookup }> = [
    { keybind: knownKeybinds.w },
    { keybind: knownKeybinds.s },
    { keybind: knownKeybinds.a },
    { keybind: knownKeybinds.d },
    { keybind: knownKeybinds.up, alias: knownKeybinds.w },
    { keybind: knownKeybinds.down, alias: knownKeybinds.s },
    { keybind: knownKeybinds.left, alias: knownKeybinds.a },
    { keybind: knownKeybinds.right, alias: knownKeybinds.d },
  ];

  onMount(() => {
    for (const keyToBind of keysToBind) {
      Mousetrap.bind(keyToBind.keybind, (e: ExtendedKeyboardEvent) => {
        preventDefault(e);
        onKey(e, keyToBind.alias ?? keyToBind.keybind);
      });
    }
  });

  onCleanup(() => {
    for (const keyToBind of keysToBind) {
      Mousetrap.unbind(keyToBind.keybind);
    }
  });
};

export const mapKeyBindToDirection = (keybind: KeybindLookup): Direction => {
  switch (keybind) {
    case 'w':
      return Direction.up;
    case 's':
      return Direction.down;
    case 'a':
      return Direction.left;
    case 'd':
      return Direction.right;
    default:
      return Direction.up;
  }
};

export const mapKeyBindToCoords = (keybind: KeybindLookup): [x: number, y: number] => {
  switch (keybind) {
    case 'w':
      return [0, -1];
    case 's':
      return [0, 1];
    case 'a':
      return [-1, 0];
    case 'd':
      return [1, 0];
    default:
      return [0, -1];
  }
};
