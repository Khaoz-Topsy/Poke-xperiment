import { ILevelTile } from "./levelTile";

export interface ILevelLayer {
    id: string;
    name: string;
    zindex?: number;
    items: Array<ILevelTile>;
}
