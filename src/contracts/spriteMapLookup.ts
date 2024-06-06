import { SpriteItemType } from "./spriteItem";

export interface ISpriteMapLookupContainer {
  width: number;
  height: number;
  definitions: Array<ISpriteMapLookup>;
}

export interface ISpriteMapLookup extends ISpriteMapDimensions {
  type: SpriteItemType;
  tags: Array<string>;
}

export interface ISpriteMapDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}
