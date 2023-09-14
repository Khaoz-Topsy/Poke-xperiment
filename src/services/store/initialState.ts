import { Level, numRows } from "../../constants/game";
import { IProgressState } from "./sections/progressState";
import { ISidebarState } from "./sections/sidebarState";
import { IUserState } from "./sections/userState";

export interface IState {
    user: IUserState;
    sidebar: ISidebarState;
    progress: IProgressState;
}

export const initialState: IState = {
    user: {
        name: 'Bob',
        char: 0,
        scale: 100,
    },
    sidebar: {
        isOpen: false,
    },
    progress: {
        level: Level.none,
        coord: {
            x: 0,
            y: Math.floor(numRows / 2),
        }
    }
}
