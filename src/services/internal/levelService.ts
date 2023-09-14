import { Container, Service } from 'typedi';
import { ILevelData } from '../../contracts/levelData';
import { uuidv4 } from '../../helper/guidHelper';

@Service()
export class LevelService {

    loadLevel = async (levelId: string): Promise<ILevelData> => {
        const levelUrl: string = `/assets/level/${levelId}.json`;
        const levelDataResp = await fetch(levelUrl);
        const levelData: ILevelData = await levelDataResp.json();
        return levelData;
    }

    regenIds = (levelData: ILevelData): ILevelData => {
        levelData.id = uuidv4();
        for (const levelLayer of levelData.layers) {
            levelLayer.id = uuidv4();
            for (const levelItem of levelLayer.items) {
                levelItem.id = uuidv4();
            }
        }
        return levelData;
    }
}

export const getLevelServ = () => Container.get(LevelService);

