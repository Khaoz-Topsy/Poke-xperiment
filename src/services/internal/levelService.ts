import { Container, Service } from 'typedi';
import { ILevelData } from '../../contracts/levelData';

@Service()
export class LevelService {

    loadLevel = async (levelId: string): Promise<ILevelData> => {
        const levelUrl: string = `/assets/level/${levelId}.json`;
        const levelDataResp = await fetch(levelUrl);
        const levelData: ILevelData = await levelDataResp.json();
        return levelData;
    }
}

export const getLevelServ = () => Container.get(LevelService);

