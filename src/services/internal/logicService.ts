import { Container, Service } from 'typedi';
import { ILevelData } from '../../contracts/levelData';
import { ILevelCoord } from '../../contracts/levelCoord';
import { CharacterCanMoveState } from '../../constants/enum/characterCanMoveState';
import { unitInPx } from '../../constants/game';

@Service()
export class LogicService {

    canMove = (level: ILevelData, dest: ILevelCoord): CharacterCanMoveState => {

        console.log('canMove', { ...dest })
        if ((dest.x * unitInPx) > level.sizeX) {
            return CharacterCanMoveState.denied;
        }
        if ((dest.y * unitInPx) > level.sizeY) {
            return CharacterCanMoveState.denied;
        }

        let canWalkOntoTile = false;
        for (const walkableSection of level.walkableTiles) {
            const startX = Math.min(walkableSection.startX, walkableSection.endX);
            const endX = Math.max(walkableSection.startX, walkableSection.endX);
            const xCoordIsOk = (dest.x <= endX && dest.x >= startX);
            if (xCoordIsOk == false) continue;

            const startY = Math.min(walkableSection.startY, walkableSection.endY);
            const endY = Math.max(walkableSection.startY, walkableSection.endY);
            const yCoordIsOk = (dest.y <= endY && dest.y >= startY);

            if (xCoordIsOk && yCoordIsOk) {
                canWalkOntoTile = true;
                break;
            }
        }

        if (canWalkOntoTile == false) {
            return CharacterCanMoveState.denied;
        }

        for (const interaction of level.interactionTiles) {
            if (interaction.x == dest.x && interaction.y == dest.y) {
                return CharacterCanMoveState.interaction;
            }
        }

        return CharacterCanMoveState.allowed;
    }
}

export const getLogicServ = () => Container.get(LogicService);

