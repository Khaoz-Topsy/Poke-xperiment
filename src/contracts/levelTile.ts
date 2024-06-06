import { SpriteItemType } from "./spriteItem";

export interface ILevelTile {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  type: SpriteItemType;
}
