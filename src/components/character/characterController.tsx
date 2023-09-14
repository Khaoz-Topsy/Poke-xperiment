import { Component, createSignal, onCleanup, onMount } from "solid-js";
import { Character } from "./character";
import { CharacterStateEnum } from "../../constants/enum/characterStateEnum";
import { getStateService } from "../../services/store/stateService";
import { getProgressCoords } from "../../services/store/sections/progressState";
import Mousetrap from "mousetrap";
import { knownKeybinds } from "../../constants/keybind";
import { getCharacter, getScale } from "../../services/store/sections/userState";
import { CharacterMoveState } from "../../constants/enum/characterMoveState";
import { Direction } from "../../constants/enum/direction";
import { movementDiff, unitInPx } from "../../constants/game";
import { ILevelData } from "../../contracts/levelData";
import { ILevelCoord } from "../../contracts/levelCoord";
import { getLogicServ } from "../../services/internal/logicService";
import { CharacterCanMoveState } from "../../constants/enum/characterCanMoveState";
import classNames from "classnames";
import { preventDefault } from "../../helper/documentHelper";
import { characterStepDuration, movementAnimations } from "../../constants/animation";
import { timeout } from "../../helper/asyncHelper";

interface ICharacterInMotionProps {
    levelData: ILevelData;
}

export const CharacterController: Component<ICharacterInMotionProps> = (props: ICharacterInMotionProps) => {
    const stateRef = getStateService();
    const [charIndex] = getCharacter(stateRef);
    const [progressCoords, setProgressCoords] = getProgressCoords(stateRef);

    const [stepCount, setStepCount] = createSignal<number>(0);
    const [direction, setDirection] = createSignal<Direction>(Direction.right);
    const [isMoving, setIsMoving] = createSignal<boolean>(false);
    const [charAnimState, setCharAnimState] = createSignal<CharacterStateEnum>(CharacterStateEnum.right);

    onMount(() => {
        Mousetrap.bind(knownKeybinds.w, (e: any) => moveCharacter(e, Direction.up));
        Mousetrap.bind(knownKeybinds.s, (e: any) => moveCharacter(e, Direction.down));
        Mousetrap.bind(knownKeybinds.a, (e: any) => moveCharacter(e, Direction.left));
        Mousetrap.bind(knownKeybinds.d, (e: any) => moveCharacter(e, Direction.right));
    });

    onCleanup(() => {
        Mousetrap.unbind(knownKeybinds.w);
        Mousetrap.unbind(knownKeybinds.s);
        Mousetrap.unbind(knownKeybinds.a);
        Mousetrap.unbind(knownKeybinds.d);
    });

    const moveCharacter = (e: any, direction: Direction) => {
        preventDefault(e);
        console.log(e);

        if (isMoving()) return;

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
    }

    const moveCharacterAnimated = async (direction: Direction, dest: ILevelCoord) => {
        const animFrames = movementAnimations[direction];
        const stepIndex = (stepCount() % 2 == 0) ? 0 : 2
        setDirection(direction);
        setCharAnimState(animFrames[stepIndex]);
        setIsMoving(true);
        setProgressCoords(dest);

        await timeout(characterStepDuration / 2);
        setCharAnimState(animFrames[stepIndex + 1]);

        await timeout(characterStepDuration / 2);
        setCharAnimState(animFrames[0]);
        setStepCount(i => i + 1);
        setIsMoving(false);
    }

    return (
        <div
            class={classNames('character-container', Direction[direction()], { 'moving': isMoving() })}
            style={{
                width: `${unitInPx}px`,
                height: `${unitInPx}px`,
                transform: `translate(${progressCoords().x * unitInPx}px, ${progressCoords().y * unitInPx}px) translate(-2px, -2px)`,
            }}
        >
            <Character
                charIndex={charIndex()}
                state={charAnimState()}
            />
        </div>
    );
}