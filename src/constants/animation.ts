import { CharacterStateEnum } from "./enum/characterStateEnum";
import { Direction } from "./enum/direction";

export const characterStepDuration = 200;
export const characterMoveTileDuration = characterStepDuration * 2;

export const movementAnimations = {
    [Direction.up]: [
        CharacterStateEnum.up,
        CharacterStateEnum.up1,
        CharacterStateEnum.up,
        CharacterStateEnum.up2,
    ],
    [Direction.down]: [
        CharacterStateEnum.down,
        CharacterStateEnum.down1,
        CharacterStateEnum.down,
        CharacterStateEnum.down2,
    ],
    [Direction.left]: [
        CharacterStateEnum.left,
        CharacterStateEnum.left1,
        CharacterStateEnum.left,
        CharacterStateEnum.left2,
    ],
    [Direction.right]: [
        CharacterStateEnum.right,
        CharacterStateEnum.right1,
        CharacterStateEnum.right,
        CharacterStateEnum.right2,
    ],
}