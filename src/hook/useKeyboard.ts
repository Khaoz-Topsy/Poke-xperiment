import { onCleanup, onMount } from 'solid-js';

import Mousetrap, { ExtendedKeyboardEvent } from 'mousetrap';
import { KeybindLookup } from '../constants/keybind';
import { preventDefault } from '../helper/documentHelper';
import { Direction } from '../constants/enum/direction';

export const useKeyboard = (
  onKey: (e: ExtendedKeyboardEvent, keybind: KeybindLookup) => void,
): void => {
  const keysToBind: Array<{ keybind: KeybindLookup; alias?: KeybindLookup }> = [
    { keybind: KeybindLookup.w },
    { keybind: KeybindLookup.s },
    { keybind: KeybindLookup.a },
    { keybind: KeybindLookup.d },
    { keybind: KeybindLookup.up, alias: KeybindLookup.w },
    { keybind: KeybindLookup.down, alias: KeybindLookup.s },
    { keybind: KeybindLookup.left, alias: KeybindLookup.a },
    { keybind: KeybindLookup.right, alias: KeybindLookup.d },
    { keybind: KeybindLookup.escape },
    { keybind: KeybindLookup.space },
    { keybind: KeybindLookup.del },
  ];

  onMount(() => {
    for (const keyToBind of keysToBind) {
      Mousetrap.bind(KeybindLookup[keyToBind.keybind], (e: ExtendedKeyboardEvent) => {
        preventDefault(e);
        // console.log(KeybindLookup[keyToBind.keybind]);
        onKey(e, keyToBind.alias ?? keyToBind.keybind);
      });
    }
  });

  onCleanup(() => {
    for (const keyToBind of keysToBind) {
      Mousetrap.unbind(KeybindLookup[keyToBind.keybind]);
    }
  });
};

export const mapKeyBindToDirection = (keybind: KeybindLookup): Direction => {
  switch (keybind) {
    case KeybindLookup.w:
      return Direction.up;
    case KeybindLookup.s:
      return Direction.down;
    case KeybindLookup.a:
      return Direction.left;
    case KeybindLookup.d:
      return Direction.right;
    default:
      return Direction.none;
  }
};

export const mapKeyBindToCoords = (keybind: KeybindLookup): [x: number, y: number] => {
  switch (keybind) {
    case KeybindLookup.w:
      return [0, -1];
    case KeybindLookup.s:
      return [0, 1];
    case KeybindLookup.a:
      return [-1, 0];
    case KeybindLookup.d:
      return [1, 0];
    default:
      return [0, 0];
  }
};
