import { classNames } from "@hope-ui/solid";
import { Component } from "solid-js";
import { CharacterStateEnum } from "../../constants/enum/characterStateEnum";
import { characterSize } from "../../constants/game";

interface ICharacterProps {
    charIndex: number;
    state: CharacterStateEnum;
    scale?: number;
}

export const Character: Component<ICharacterProps> = (props: ICharacterProps) => {

    const rightStates: any = {
        9: 2,
        10: 7,
        11: 8,
    };

    const getPosX = (state: CharacterStateEnum) => {
        let xPos = state;
        if (rightStates[state] != null) {
            xPos = rightStates[state];
        }
        return xPos * characterSize;
    }

    const getPosY = (state: CharacterStateEnum, charIndex: number) => {

        return charIndex * characterSize;
    }

    const getScale = (state: CharacterStateEnum, scale?: number) => {
        const result = scale ?? 1;
        if (rightStates[state] != null) {
            return `-${result}, ${result}`
        }
        return `${result}, ${result}`;
    }

    return (
        <div
            class={classNames('character-tile', props.state?.toString?.())}
            style={{
                'background-position-y': `-${getPosY(props.state, props.charIndex)}px`,
                'background-position-x': `-${getPosX(props.state)}px`,
                'background-image': `var(--sprite-item-character-${props.charIndex})`,
                'transform': `scale(${getScale(props.state, props.scale)})`,
            }}
            draggable={false}
        ></div>
    );
}