import { ILevelCoord } from '../contracts/levelCoord';
import { ILevelData } from '../contracts/levelData';
import { ILevelTile } from '../contracts/levelTile';
import { ILevelWalkable } from '../contracts/levelWalkable';
import { ISpriteMapLookup } from '../contracts/spriteMapLookup';
import { uuidv4 } from '../helper/guidHelper';
import { anyObject } from '../helper/typescriptHacks';

export const addSpriteToMapMapper =
  (item: ISpriteMapLookup, id: string, selectedLayerIndex: number) =>
  (prev: ILevelData | undefined): ILevelData => {
    const prevLvl = prev ?? anyObject;
    const layers = prevLvl?.layers ?? [];
    const selectedLayer = layers[selectedLayerIndex];
    return {
      ...prevLvl,
      layers: [
        ...layers.slice(0, selectedLayerIndex),
        {
          ...selectedLayer,
          items: [...selectedLayer.items, { ...item, id }],
        },
        ...layers.slice(selectedLayerIndex + 1),
      ],
    };
  };

export const removeSpriteFromMapMapper =
  (itemId: string, selectedLayerIndex: number) =>
  (prev: ILevelData | undefined): ILevelData => {
    const prevLvl = prev ?? anyObject;
    const layers = prevLvl?.layers ?? [];
    const selectedLayer = layers[selectedLayerIndex];
    return {
      ...prevLvl,
      layers: [
        ...layers.slice(0, selectedLayerIndex),
        {
          ...selectedLayer,
          items: [...selectedLayer.items.filter((i: ILevelTile) => i.id != itemId)],
        },
        ...layers.slice(selectedLayerIndex + 1),
      ],
    };
  };

export const addLayerMapper =
  (layerName: string) =>
  (prev: ILevelData | undefined): ILevelData => {
    const prevLvl = prev ?? anyObject;
    return {
      ...prevLvl,
      layers: [
        ...(prevLvl?.layers ?? []),
        {
          id: uuidv4(),
          name: layerName,
          items: [],
        },
      ],
    };
  };

export const handleWalkableGridSelectMapper =
  (startCoord: ILevelCoord, currentCoord: ILevelCoord) =>
  (prev: ILevelData | undefined): ILevelData => {
    const prevLvl = prev ?? anyObject;
    const walkableTiles: Array<ILevelWalkable> = prevLvl.walkableTiles ?? [];
    const newWalkableTile: ILevelWalkable = {
      id: uuidv4(),
      startX: Math.min(startCoord.x, currentCoord.x),
      startY: Math.min(startCoord.y, currentCoord.y),
      endX: Math.max(startCoord.x, currentCoord.x),
      endY: Math.max(startCoord.y, currentCoord.y),
    };

    return {
      ...prevLvl,
      walkableTiles: [...walkableTiles, newWalkableTile],
    };
  };

export const handleWalkableStartMapper =
  (startCoord: ILevelCoord) =>
  (prev: ILevelData | undefined): ILevelData => {
    const prevLvl = prev ?? anyObject;
    return {
      ...prevLvl,
      startTile: startCoord,
    };
  };

export const removeWalkableGridItemMapper =
  (id: string) =>
  (prev: ILevelData | undefined): ILevelData => {
    const prevLvl = prev ?? anyObject;
    const walkableTiles: Array<ILevelWalkable> = prevLvl.walkableTiles ?? [];

    return {
      ...prevLvl,
      walkableTiles: [...walkableTiles.filter((w) => w.id != id)],
    };
  };
