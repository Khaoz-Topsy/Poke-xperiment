import { Route, Routes } from '@solidjs/router';
import { Component, Show, createSignal, lazy, onMount } from 'solid-js';

import { CenterLoading } from './components/core/loading';
import { NetworkState } from './constants/enum/networkState';
import { numColumns, numRows } from './constants/game';
import { routes } from './constants/route';
import { updateCustomStyleTag } from './helper/documentHelper';
import { EmbedPage } from './pages/embed';
import { HomePage, RedirectToHome } from './pages/home';
import { LevelPage } from './pages/level';
import { NotFoundPage } from './pages/notFound';
import { getSpriteMapServ } from './services/internal/spriteMapService';

const AboutPage = lazy(() => import('./pages/about'));
const LevelBuilderPage = lazy(() => import('./pages/builder'));
const SpriteMapperPage = lazy(() => import('./pages/spriteMapper'));

export const AppShell: Component = () => {
  const [networkState, setNetworkState] = createSignal<NetworkState>(NetworkState.Loading);

  onMount(() => {
    const allPromises = [
      getSpriteMapServ().loadDefaultSpriteMap(),
      getSpriteMapServ().loadCharacterSprites(),
    ];
    Promise.all(allPromises)
      .then(() => setNetworkState(NetworkState.Success))
      .catch(() => setNetworkState(NetworkState.Error));

    updateCustomStyleTag(
      `poke-game-rules-style`,
      `:root { --num-columns: ${numColumns}; --num-rows: ${numRows} }`,
    );
  });

  return (
    <>
      <Show when={networkState() === NetworkState.Error}>
        <h1>Error</h1>
      </Show>
      <Show when={networkState() === NetworkState.Loading}>
        <CenterLoading />
      </Show>
      <Show when={networkState() === NetworkState.Success}>
        <Routes>
          <Route path={routes.about} component={AboutPage} />
          <Route path={routes.level} component={LevelPage} />
          <Route path={routes.embed} component={EmbedPage} />
          <Route path={routes.levelBuilder} component={LevelBuilderPage} />
          <Route path={routes.spriteMapper} component={SpriteMapperPage} />

          <Route path={routes.actualHome} component={HomePage} />
          <Route path={routes.home} component={RedirectToHome} />
          <Route path={'*'} element={<NotFoundPage />} />
        </Routes>
      </Show>
    </>
  );
};
