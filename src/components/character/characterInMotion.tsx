import { Component, createSignal, onCleanup } from "solid-js";
import { Character } from "./character";
import { CharacterStateEnum } from "../../constants/enum/characterStateEnum";

interface ICharacterInMotionProps {
    charIndex: number;
    scale?: number;
}

export const CharacterInMotion: Component<ICharacterInMotionProps> = (props: ICharacterInMotionProps) => {
    const states = [
        CharacterStateEnum.left1,
        CharacterStateEnum.left,
        CharacterStateEnum.left2,
        CharacterStateEnum.left,
    ];

    const [stateIndex, setStateIndex] = createSignal<number>(states.length);

    const characterStateInterval = setInterval(() => {
        setStateIndex((stateIndex() + 1) % states.length);
    }, 200);

    onCleanup(() => clearInterval(characterStateInterval));

    return (
        <Character
            charIndex={props.charIndex}
            state={states[stateIndex()]}
            scale={props.scale}
        />
    );
}