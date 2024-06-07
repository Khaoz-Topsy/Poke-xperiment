import { Direction } from './enum/direction';

export const numColumns = 32;
export const numRows = 18;
export const numCharacters = 12;
export const columnAndRowGridCells = Array.from(Array(numColumns * numRows).keys());

export const characterSize = 21;
export const characterZIndex = 200;
export const unitInPx = 16;

export const movementDiff = {
  [Direction.none]: [0, 0],
  [Direction.up]: [0, -1],
  [Direction.down]: [0, 1],
  [Direction.left]: [-1, 0],
  [Direction.right]: [1, 0],
};

export const layerCssClassOptions = {
  disableLayerLevelOpacity: 'disable-layer-level-opacity',
  showLayerContainerOverflow: 'show-layer-container-overflow',
  showWalkableZone: 'show-walkable-zone',
  showWalkableZoneAddGrid: 'show-walkable-zone-add-grid',
  showWalkableZoneAddStart: 'show-walkable-zone-add-start',
};

export enum Level {
  none = 'none',
  intro = 'intro',
}
