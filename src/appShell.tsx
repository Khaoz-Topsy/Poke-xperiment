import { Center, Flex, hope } from "@hope-ui/solid";
import { Route, Routes } from "@solidjs/router";
import { Component, createSignal, lazy, onMount, Show, Suspense } from 'solid-js';

import { Sidebar } from './components/common/sidebar';
import { CenterLoading, LoadingSpinner } from './components/core/loading';
import { routes } from './constants/route';
import { HomePage, RedirectToHome } from "./pages/home";
import { NotFoundPage } from "./pages/notFound";
import { LevelPage } from "./pages/level";
import { getStateService } from "./services/store/stateService";
import { getProgress } from "./services/store/sections/progressState";
import { NetworkState } from "./constants/enum/networkState";
import { ILevelData } from "./contracts/levelData";
import { ISpriteMapLookupContainer } from "./contracts/spriteMapLookup";
import { createCanvasToCutImage, cutImageFromOtherImage, updateCustomStyleTag } from "./helper/documentHelper";
import { getSpriteMapServ } from "./services/internal/spriteMapService";
import { numColumns, numRows } from "./constants/game";
import { EmbedPage } from "./pages/embed";
import { getCharacter } from "./services/store/sections/userState";

const AboutPage = lazy(() => import("./pages/about"));
const LevelBuilderPage = lazy(() => import("./pages/builder"));
const SpriteMapperPage = lazy(() => import("./pages/spriteMapper"));

export const AppShell: Component = () => {
    const stateRef = getStateService();
    const [charIndex] = getCharacter(stateRef);

    const [networkState, setNetworkState] = createSignal<NetworkState>(NetworkState.Loading);

    onMount(() => {
        const allPromises = [
            getSpriteMapServ().loadDefaultSpriteMap(),
            getSpriteMapServ().loadCharacterSprites(charIndex()),
        ];
        Promise.all(allPromises)
            .then(() => setNetworkState(NetworkState.Success))
            .catch(() => setNetworkState(NetworkState.Error));

        updateCustomStyleTag(`poke-game-rules-style`, `:root { --num-columns: ${numColumns}; --num-rows: ${numRows} }`);
    });

    return (
        <>
            <Show when={networkState() == NetworkState.Error}>
                <h1>Error</h1>
            </Show>
            <Show when={networkState() == NetworkState.Loading}>
                <CenterLoading />
            </Show>
            <Show when={networkState() == NetworkState.Success}>
                <Routes>
                    <Route path={routes.about} component={AboutPage} />
                    <Route path={routes.level} component={LevelPage} />
                    <Route path={routes.embed} component={EmbedPage} />
                    <Route path={routes.levelBuilder} component={LevelBuilderPage} />
                    <Route path={routes.spriteMapper} component={SpriteMapperPage} />

                    <Route path={routes.actualHome} component={HomePage} />
                    <Route path={routes.home} component={RedirectToHome} />
                    <Route path={"*"} element={<NotFoundPage />} />
                </Routes>
            </Show>
        </>
    );
};