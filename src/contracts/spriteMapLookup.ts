import { SpriteItemType } from "./spriteItem";

export interface ISpriteMapLookupContainer {
    width: number;
    height: number;
    definitions: Array<ISpriteMapLookup>;
}

export interface ISpriteMapLookup extends ISpriteMapDimensions {
    type: SpriteItemType;
}

export interface ISpriteMapDimensions {
    x: number;
    y: number;
    width: number;
    height: number;
}