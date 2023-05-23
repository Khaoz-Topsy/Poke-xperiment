import { StateService } from "../stateService";

export interface IUserState {
    name: string;
    char: number;
    scale: number;
}

export const getUserName = (stateService: StateService): [state: () => string, setState: (state: string) => void] => [
    () => stateService.getState().user.name,
    (newName: string) => stateService.setState(s => s.user.name = newName),
];

export const getCharacter = (stateService: StateService): [state: () => number, setState: (state: number) => void] => [
    () => stateService.getState().user?.char ?? 0,
    (newChar: number) => stateService.setState(s => s.user.char = newChar),
];

export const getScale = (stateService: StateService): [state: () => number, setState: (state: number) => void] => [
    () => stateService.getState().user.scale,
    (newScale: number) => stateService.setState(s => s.user.scale = newScale),
];