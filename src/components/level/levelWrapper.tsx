import { Component, For, JSX, Show, createSignal, onMount } from 'solid-js';

import { NetworkState } from '../../constants/enum/networkState';
import { ILevelData } from '../../contracts/levelData';
import { ILevelLayer } from '../../contracts/levelLayer';
import { ILevelTile } from '../../contracts/levelTile';
import { ISpriteMapLookupContainer } from '../../contracts/spriteMapLookup';
import { getLevelServ } from '../../services/internal/levelService';
import { getSpriteMapServ } from '../../services/internal/spriteMapService';
import { getProgressLevel } from '../../services/store/sections/progressState';
import { getStateService } from '../../services/store/stateService';
import { CharacterController } from '../character/characterController';
import { CenterLoading } from '../core/loading';
import { LevelContainer } from './levelContainer';
import { LevelItem } from './levelItem';
import { LevelLayer } from './levelLayer';
import { Button, Center, Flex } from '@hope-ui/solid';
import { PageHeader } from '../common/pageHeader';
import { Link } from '@solidjs/router';
import { routes } from '../../constants/route';

export interface ILevelCompProps {
  uiScale: number;
  setUiScale: (newValue: number) => void;
  wrapper?: (name: string, children: JSX.Element) => JSX.Element;
}

export const LevelWrapper: Component<ILevelCompProps> = (props: ILevelCompProps) => {
  const stateRef = getStateService();
  const [progressLvl] = getProgressLevel(stateRef);

  const [networkState, setNetworkState] = createSignal<NetworkState>(NetworkState.Loading);
  const [levelData, setLevelData] = createSignal<ILevelData>();
  const [mapLookup, setMapLookup] = createSignal<ISpriteMapLookupContainer>();

  onMount(() => {
    const allPromises = [loadSpriteMap(), loadLevel()];
    Promise.all(allPromises)
      .then(() => setNetworkState(NetworkState.Success))
      .catch(() => setNetworkState(NetworkState.Error));
  });

  const loadSpriteMap = async () => {
    const spriteMap = await getSpriteMapServ().getSpriteMap();
    setMapLookup(spriteMap);
  };

  const loadLevel = async () => {
    const levelData = await getLevelServ().loadLevel(progressLvl());
    setLevelData(levelData);
  };

  return (
    <>
      <Show when={networkState() === NetworkState.Error}>
        <Flex w="100%" h="100vh" justifyContent="center" flexDirection="column" position="relative">
          <PageHeader text="Something went wrong"></PageHeader>
          <Center>
            <Link href={routes.home}>
              <Button>Go home</Button>
            </Link>
          </Center>
        </Flex>
      </Show>
      <Show when={networkState() === NetworkState.Loading}>
        <CenterLoading />
      </Show>
      <Show
        when={networkState() === NetworkState.Success && levelData() != null && mapLookup() != null}
      >
        <LevelContainer
          name={levelData()?.name ?? 'unknown'}
          defaultBackgroundTile={levelData()?.defaultBackgroundTile ?? ''}
          uiScale={props.uiScale}
          setUiScale={props.setUiScale}
          wrapper={props.wrapper}
        >
          <For each={levelData()!.layers}>
            {(layer: ILevelLayer) => (
              <LevelLayer layer={layer}>
                <For each={layer.items}>
                  {(level: ILevelTile) => (
                    <LevelItem {...level} lookup={mapLookup()!.definitions} />
                  )}
                </For>
              </LevelLayer>
            )}
          </For>
          <CharacterController levelData={levelData()!} />
        </LevelContainer>
      </Show>
    </>
  );
};
