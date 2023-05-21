import { LevelInteractionType } from "../constants/enum/levelInteractionType";
import { Level } from "../constants/game";

export interface ILevelInteraction {
    id: string;
    type: LevelInteractionType;
    x: number;
    y: number;
}


export interface ILevelNavigateInteraction extends ILevelInteraction {
    level: Level;
}
