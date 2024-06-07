import { ILevelTile } from './levelTile';

export interface ILevelLayer {
  id: string;
  name: string;
  items: Array<ILevelTile>;
}
