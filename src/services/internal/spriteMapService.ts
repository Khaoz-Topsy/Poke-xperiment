import { Container, Service } from 'typedi';
import { ISpriteMapLookupContainer } from '../../contracts/spriteMapLookup';
import { createCanvasToCutImage, cutImageFromOtherImage, updateCustomStyleTag } from '../../helper/documentHelper';
import { characterZIndex, numCharacters, unitInPx } from '../../constants/game';
import { characterStepDuration } from '../../constants/animation';

@Service()
export class SpriteMapService {
    private spriteMapLookupContainer?: ISpriteMapLookupContainer;

    loadAllSprites = async () => {
        return Promise.all([
            this.loadSpriteMap,
        ]);
    }

    getSpriteMap = async (): Promise<ISpriteMapLookupContainer> => {
        if (this.spriteMapLookupContainer != null) {
            return this.spriteMapLookupContainer;
        }

        return this.loadSpriteMap();
    }

    loadSpriteMap = async (): Promise<ISpriteMapLookupContainer> => {
        const spriteSourceJson: string = '/assets/tileset/default.json';
        const spriteMapResp = await fetch(spriteSourceJson);
        const spriteMap: ISpriteMapLookupContainer = await spriteMapResp.json();

        const spriteSource: string = '/assets/tileset/default.png';
        //spriteMapLookup().source ?? (defaultSpriteMap.source!);
        cutImageFromOtherImage(
            spriteSource,
            (image: HTMLImageElement) => {
                const cssMapItems = [
                    `--sprite-item-map: url("${spriteSource}");`,
                    `--sprite-item-map-x: ${spriteMap.width}px;`,
                    `--sprite-item-map-y: ${spriteMap.height}px;`,
                    `--sprite-item-cell-size: ${unitInPx}px;`,
                ];
                for (const spriteMapLookupItem of spriteMap.definitions) {
                    const dataUri = createCanvasToCutImage(image, spriteMapLookupItem);
                    if (dataUri == null) continue;

                    cssMapItems.push(`--sprite-item-${spriteMapLookupItem.type}: url("${dataUri}");`)
                }
                updateCustomStyleTag(`poke-sprite-map-style`, `:root { ${cssMapItems.join('\n')} }`);
            }
        );

        this.spriteMapLookupContainer = spriteMap;
        return spriteMap;
    }

    loadCharacterSprites = async (charIndex: number) => {

        const spriteSource: string = '/assets/characters/default.png';
        //spriteMapLookup().source ?? (defaultSpriteMap.source!);
        cutImageFromOtherImage(
            spriteSource,
            (image: HTMLImageElement) => {
                const cssMapItems = [
                    `--sprite-item-character-step-duration: ${characterStepDuration}ms;`,
                    `--sprite-item-character-zindex: ${characterZIndex};`,
                ];
                const spriteMapLookupItem = {
                    x: (charIndex * 20),
                    y: 0,
                    width: 180,
                    height: 20,
                };

                for (let charIndex = 0; charIndex < numCharacters; charIndex++) {
                    const dataUri = createCanvasToCutImage(image, spriteMapLookupItem);
                    if (dataUri == null) return;
                    cssMapItems.push(`--sprite-item-character-${charIndex}: url("${dataUri}");`);
                }

                updateCustomStyleTag(`poke-sprite-char-style`, `:root { ${cssMapItems.join('\n')} }`);
            }
        );
    }
}

export const getSpriteMapServ = () => Container.get(SpriteMapService);

