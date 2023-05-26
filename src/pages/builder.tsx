import { Box, Button, Center } from '@hope-ui/solid';
import classNames from "classnames";
import Mousetrap from 'mousetrap';
import { Component, For, Show, createSignal, onCleanup, onMount } from 'solid-js';

import { CommonLayout } from '../components/common/layout';
import { CenterLoading } from '../components/core/loading';
import { LevelContainer } from '../components/level/levelContainer';
import { LevelControlPasteGrid } from '../components/level/levelControlPasteGrid';
import { LevelControlSpriteItem } from '../components/level/levelControlSpriteItem';
import { LevelItem } from '../components/level/levelItem';
import { LevelLayer } from '../components/level/levelLayer';
import { LevelLayerControl } from '../components/level/levelLayerControl';
import { LevelSelectorModal } from '../components/level/levelSelector';
import { WalkableItem } from '../components/level/walkableItem';
import { NetworkState } from '../constants/enum/networkState';
import { Level, layerCssClassOptions, unitInPx } from '../constants/game';
import { knownKeybinds } from '../constants/keybind';
import { ILevelCoord } from '../contracts/levelCoord';
import { ILevelData } from '../contracts/levelData';
import { ILevelLayer } from '../contracts/levelLayer';
import { ILevelTile } from '../contracts/levelTile';
import { ILevelWalkable } from '../contracts/levelWalkable';
import { SpriteItemType } from '../contracts/spriteItem';
import { ISpriteMapLookup, ISpriteMapLookupContainer } from '../contracts/spriteMapLookup';
import { uuidv4 } from '../helper/guidHelper';
import { stringInputPopup } from '../helper/popupHelper';
import { addLayerMapper, addSpriteToMapMapper, handleWalkableGridSelectMapper, removeSpriteFromMapMapper, removeWalkableGridItemMapper } from '../mapper/levelData';
import { getLevelServ } from '../services/internal/levelService';
import { getSpriteMapServ } from '../services/internal/spriteMapService';
import { getScale } from '../services/store/sections/userState';
import { getStateService } from '../services/store/stateService';

export const LevelBuilderPage: Component = () => {
    const stateRef = getStateService();
    const [uiScale, setUiScale] = getScale(stateRef);

    const [networkState, setNetworkState] = createSignal<NetworkState>(NetworkState.Loading);
    const [levelData, setLevelData] = createSignal<ILevelData>();
    const [mapLookup, setMapLookup] = createSignal<ISpriteMapLookupContainer>();

    const [layerClasses, setLayerClasses] = createSignal<Array<string>>([]);
    const [showWalkableGrid, setShowWalkableGrid] = createSignal<boolean>(false);
    const [walkableBoxStart, setWalkableBoxStart] = createSignal<ILevelCoord>();

    const [selectedSpriteItem, setSelectedSpriteItem] = createSignal<string>();
    const [selectedLayerIndex, setSelectedLayerIndex] = createSignal<number>(0);
    const [selectedSpriteItemToPaste, setSelectedSpriteItemToPaste] = createSignal<ISpriteMapLookup>();

    onMount(() => {
        const allPromises = [
            getSpriteMapServ().getSpriteMap().then(spriteMap => setMapLookup(spriteMap)),
        ];
        Promise.all(allPromises)
            .then(() => setNetworkState(NetworkState.Success))
            .catch(() => setNetworkState(NetworkState.Error));

        Mousetrap.bind(knownKeybinds.up, () => moveSelected(0, -1));
        Mousetrap.bind(knownKeybinds.right, () => moveSelected(1, 0));
        Mousetrap.bind(knownKeybinds.down, () => moveSelected(0, 1));
        Mousetrap.bind(knownKeybinds.left, () => moveSelected(-1, 0));
    });

    onCleanup(() => {
        Mousetrap.unbind(knownKeybinds.up);
        Mousetrap.unbind(knownKeybinds.right);
        Mousetrap.unbind(knownKeybinds.down);
        Mousetrap.unbind(knownKeybinds.left);
    });

    const loadLevel = async (level: Level) => {
        const levelData = await getLevelServ().loadLevel(level);
        setLevelData(levelData);
        setSelectedLayerIndex(0);
    }

    const addSpriteToMap = (item: ISpriteMapLookup, id: string) => {
        setLevelData(addSpriteToMapMapper(item, id, selectedLayerIndex()));
    }

    const removeSpriteFromMap = (itemId: string) => {
        setLevelData(removeSpriteFromMapMapper(itemId, selectedLayerIndex()));
    }

    const addLayer = async () => {
        const layerName = await stringInputPopup({
            input: 'text',
            title: 'New Layer name',
        });
        if (layerName == null || layerName.length < 1) return;

        setLevelData(addLayerMapper(layerName));
        setSelectedLayerIndex(prev => prev + 1);
        setSelectedSpriteItem(undefined);
    }

    const selectLayer = (index: number) => {
        setSelectedLayerIndex(index);
        setSelectedSpriteItem(undefined);
    }

    const toggleSelected = (levelItemId: string) => {
        const isActive = levelItemId == selectedSpriteItem();
        if (isActive) {
            setSelectedSpriteItem(undefined);
            return;
        }

        setSelectedSpriteItem(levelItemId);
    }

    const toggleSelectedSprite = (isActive: boolean, spriteItem: ISpriteMapLookup) => {
        if (isActive) {
            setSelectedSpriteItemToPaste(undefined);
            return;
        }

        setSelectedSpriteItemToPaste(spriteItem);
    }

    const pasteSprite = (colIndex: number, rowIndex: number) => {

        const specs = (mapLookup()?.definitions ?? []).find(d => d.type == selectedSpriteItemToPaste()?.type)
        if (specs == null) return;

        addSpriteToMap({
            x: (colIndex * unitInPx),
            y: (rowIndex * unitInPx),
            width: specs.width,
            height: specs.height,
            type: specs.type,
        }, uuidv4());
    }

    const moveSelected = (x: number, y: number) => {
        if (selectedSpriteItem() == null) {
            return;
        }

        const currentItemId = selectedSpriteItem()!;
        const currentItemObj = levelData()?.layers?.[selectedLayerIndex()]?.items?.find(i => i.id == currentItemId);
        if (currentItemObj == null) return;

        removeSpriteFromMap(currentItemId);
        addSpriteToMap({
            type: currentItemObj.type,
            x: currentItemObj.x + (x * unitInPx),
            y: currentItemObj.y + (y * unitInPx),
            width: currentItemObj.width!,
            height: currentItemObj.height!,
        }, currentItemId)
    }

    const copyJsonLevel = () => {
        try {
            const json = JSON.stringify(levelData(), null, 2);
            navigator?.clipboard?.writeText?.(json);
        } catch { }
    }

    const handleWalkableGridSelect = (colIndex: number, rowIndex: number) => {
        const currentCoord: ILevelCoord = { x: colIndex, y: rowIndex };
        const startCoord = walkableBoxStart();

        if (startCoord == null) {
            setWalkableBoxStart(currentCoord);
            return;
        }

        setLevelData(handleWalkableGridSelectMapper(startCoord, currentCoord));
        setWalkableBoxStart(undefined);
    }

    const removeWalkableGridItem = (id: string) => {
        setLevelData(removeWalkableGridItemMapper(id));
    }

    return (
        <CommonLayout>
            <div class={classNames('builder', layerClasses())}>
                <Show when={networkState() == NetworkState.Error}>
                    <h1>Error</h1>
                </Show>
                <Show when={networkState() == NetworkState.Loading}>
                    <CenterLoading />
                </Show>
                <Show when={networkState() == NetworkState.Success && mapLookup() != null}>
                    <LevelContainer
                        name="Level Builder"
                        defaultBackgroundTile={levelData()?.defaultBackgroundTile ?? ''}
                        additionControls={<>
                            <Show when={levelData() != null}>
                                <Button onClick={copyJsonLevel} mr="2px">Copy level.json</Button>
                            </Show>
                            <LevelSelectorModal loadLevel={loadLevel} />
                        </>}
                        uiScale={uiScale()}
                        setUiScale={(newValue: number) => setUiScale(newValue)}
                        rightControls={
                            <Show when={levelData() != null}>
                                <LevelLayerControl
                                    levelData={levelData()!}
                                    selectedLayerIndex={selectedLayerIndex()}
                                    layerClasses={layerClasses()}
                                    addLayer={addLayer}
                                    toggleWalkableGrid={() => setShowWalkableGrid(prev => !prev)}
                                    setSelectedLayerIndex={selectLayer}
                                    setLayerClasses={(newArr: Array<string>) => setLayerClasses(newArr)}
                                />
                            </Show>
                        }
                        bottomControls={
                            <Box px="1em" pb="0.5em">
                                <For each={(mapLookup()?.definitions ?? []).filter(m => m.type != SpriteItemType.unknown)}>
                                    {(item: ISpriteMapLookup) => (
                                        <LevelControlSpriteItem
                                            {...item}
                                            isActive={item.type == selectedSpriteItemToPaste()?.type}
                                            onClick={(isActive, _) => toggleSelectedSprite(isActive, item)}
                                        />
                                    )}
                                </For>
                            </Box>
                        }
                    >
                        <Show
                            when={levelData() != null}
                            fallback={<Center class="level-layer">Load a level to edit it</Center>}
                        >
                            <For each={(levelData()?.layers ?? [])}>
                                {(layer: ILevelLayer, index) => (
                                    <LevelLayer layer={layer} additionalClasses={classNames('editor', { 'not-active': (index() != selectedLayerIndex()) })}>
                                        <For each={(layer?.items ?? [])}>
                                            {(levelItem: ILevelTile) => (index() == selectedLayerIndex())
                                                ? (
                                                    <LevelItem
                                                        {...levelItem}
                                                        lookup={mapLookup()?.definitions ?? []}
                                                        onLeftClick={() => toggleSelected(levelItem.id)}
                                                        onRightClick={() => removeSpriteFromMap(levelItem.id)}
                                                        isActive={levelItem.id == selectedSpriteItem()}
                                                    />
                                                )
                                                : (<LevelItem {...levelItem} lookup={mapLookup()?.definitions ?? []} />)
                                            }
                                        </For>
                                    </LevelLayer>
                                )}
                            </For>
                        </Show>
                        <Show when={layerClasses().includes(layerCssClassOptions.showWalkableZone)}>
                            <LevelLayer layer={{ id: 'walkable-layer', name: 'Walkable Layer', items: [] }}>
                                <For each={(levelData()?.walkableTiles ?? [])}>
                                    {(walkable: ILevelWalkable) => (
                                        <WalkableItem {...walkable} onRightClick={removeWalkableGridItem} />
                                    )}
                                </For>
                            </LevelLayer>
                        </Show>
                        <Show when={selectedSpriteItemToPaste() != null}>
                            <LevelControlPasteGrid
                                colSpan={selectedSpriteItemToPaste()?.width}
                                rowSpan={selectedSpriteItemToPaste()?.height}
                                onClick={pasteSprite}
                            />
                        </Show>
                        <Show when={showWalkableGrid() == true && layerClasses().includes(layerCssClassOptions.showWalkableZone)}>
                            <LevelControlPasteGrid
                                colSpan={1}
                                rowSpan={1}
                                selectedCoord={walkableBoxStart()}
                                additionalClassNames="walkable"
                                onClick={handleWalkableGridSelect}
                            />
                        </Show>
                    </LevelContainer>
                </Show>
            </div>
        </CommonLayout>
    );
};

export default LevelBuilderPage;
