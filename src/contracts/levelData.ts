import { ILevelInteraction } from "./levelInteraction";
import { ILevelLayer } from "./levelLayer";
import { ILevelWalkable } from "./levelWalkable";
import { SpriteItemType } from "./spriteItem";

export interface ILevelData {
    id: string;
    name: string;
    sizeX: number;
    sizeY: number;
    defaultBackgroundTile: SpriteItemType;
    walkableTiles: Array<ILevelWalkable>;
    interactionTiles: Array<ILevelInteraction>;
    layers: Array<ILevelLayer>;
}
