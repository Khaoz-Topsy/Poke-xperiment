import { LevelInteractionType } from "../constants/enum/levelInteractionType";
import { Level } from "../constants/game";
import { ILevelCoord } from "./levelCoord";

export interface ILevelInteraction extends ILevelCoord {
    id: string;
    type: LevelInteractionType;
}


export interface ILevelNavigateInteraction extends ILevelInteraction {
    level: Level;
}
