import { Level } from '../../../constants/game';
import { ILevelCoord } from '../../../contracts/levelCoord';
import { initialState } from '../initialState';
import { StateService } from '../stateService';

export interface IProgressState {
  level: Level;
  coord: ILevelCoord;
}

export const getProgress = (
  stateService: StateService,
): [state: () => IProgressState, setState: (state: IProgressState) => void] => [
  () => stateService.getState().progress ?? initialState.progress,
  (newProgress: IProgressState) => stateService.setState((s) => (s.progress = newProgress)),
];

export const getProgressLevel = (
  stateService: StateService,
): [state: () => Level, setState: (state: Level) => void] => [
  () => stateService.getState().progress?.level ?? initialState.progress.level,
  (newLevel: Level) => stateService.setState((s) => (s.progress.level = newLevel)),
];

export const getProgressCoords = (
  stateService: StateService,
): [state: () => ILevelCoord, setState: (state: ILevelCoord) => void] => [
  () => stateService.getState().progress?.coord ?? initialState.progress.coord,
  (newCoord: ILevelCoord) => stateService.setState((s) => (s.progress.coord = newCoord)),
];
