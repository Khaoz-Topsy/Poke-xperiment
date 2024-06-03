import classNames from 'classnames';
import { Component, createSignal, onMount } from 'solid-js';

import {
  characterContinuosStepTiming,
  characterStepDuration,
  movementAnimations,
} from '../../constants/animation';
import { CharacterCanMoveState } from '../../constants/enum/characterCanMoveState';
import { CharacterStateEnum } from '../../constants/enum/characterStateEnum';
import { Direction } from '../../constants/enum/direction';
import { movementDiff, unitInPx } from '../../constants/game';
import { KeybindLookup } from '../../constants/keybind';
import { ILevelCoord } from '../../contracts/levelCoord';
import { ILevelData } from '../../contracts/levelData';
import { timeout } from '../../helper/asyncHelper';
import { mapKeyBindToDirection, useKeyboard } from '../../hook/useKeyboard';
import { getLogicServ } from '../../services/internal/logicService';
import { getProgressCoords } from '../../services/store/sections/progressState';
import { getCharacter } from '../../services/store/sections/userState';
import { getStateService } from '../../services/store/stateService';
import { Character } from './character';

interface ICharacterInMotionProps {
  levelData: ILevelData;
}

export const CharacterController: Component<ICharacterInMotionProps> = (
  props: ICharacterInMotionProps,
) => {
  const stateRef = getStateService();
  const [charIndex] = getCharacter(stateRef);
  const [progressCoords, setProgressCoords] = getProgressCoords(stateRef);

  const [stepCount, setStepCount] = createSignal<number>(0);
  const [direction, setDirection] = createSignal<Direction>(Direction.right);
  const [isMoving, setIsMoving] = createSignal<boolean>(false);
  const [charAnimState, setCharAnimState] = createSignal<CharacterStateEnum>(
    CharacterStateEnum.right,
  );

  onMount(() => {
    useKeyboard(moveCharacter);

    const isInValidPos = getLogicServ().canMove(props.levelData, progressCoords());
    if (isInValidPos === CharacterCanMoveState.denied) {
      setProgressCoords(props.levelData.startTile);
    }
  });

  const moveCharacter = (_: unknown, keybind: KeybindLookup) => {
    if (isMoving()) return;

    const direction = mapKeyBindToDirection(keybind);
    const diffCoords = movementDiff[direction];
    const xDiff = diffCoords[0];
    const yDiff = diffCoords[1];

    const dest: ILevelCoord = {
      x: progressCoords().x + xDiff,
      y: progressCoords().y + yDiff,
    };
    const canMoveResult = getLogicServ().canMove(props.levelData, dest);
    switch (canMoveResult) {
      case CharacterCanMoveState.allowed:
        moveCharacterAnimated(direction, dest);
        break;
      case CharacterCanMoveState.denied:
        setDirection(direction);
        setCharAnimState(movementAnimations[direction][0]);
        break;
      default:
        break;
    }
  };

  const moveCharacterAnimated = async (direction: Direction, dest: ILevelCoord) => {
    const animFrames = movementAnimations[direction];
    const stepIndex = stepCount() % 2 == 0 ? 0 : 2;
    setDirection(direction);
    setCharAnimState(animFrames[stepIndex]);
    setIsMoving(true);
    setProgressCoords(dest);

    await timeout(characterStepDuration / 2);
    setCharAnimState(animFrames[stepIndex + 1]);

    await timeout(characterStepDuration / 2 - characterContinuosStepTiming);
    setCharAnimState(animFrames[0]);
    setStepCount((i) => i + 1);
    setIsMoving(false);
  };

  return (
    <div
      class={classNames('character-container', Direction[direction()], {
        moving: isMoving(),
      })}
      style={{
        width: `${unitInPx}px`,
        height: `${unitInPx}px`,
        transform: `translate(${progressCoords().x * unitInPx - 2}px, ${
          progressCoords().y * unitInPx - 2
        }px)`,
      }}
    >
      <Character charIndex={charIndex()} state={charAnimState()} />
    </div>
  );
};
