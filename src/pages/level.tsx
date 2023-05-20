import { Component, createEffect } from 'solid-js';

import { CommonLayout } from '../components/common/layout';
import { LevelWrapper } from '../components/level/levelWrapper';
import { updateCustomStyleTag } from '../helper/documentHelper';
import { getScale } from '../services/store/sections/userState';
import { getStateService } from '../services/store/stateService';

export const LevelPage: Component = () => {
    const stateRef = getStateService();
    const [uiScale, setUiScale] = getScale(stateRef);

    createEffect(() => {
        updateCustomStyleTag(`poke-sprite-user-style`, `:root { --level-scale: ${((uiScale() ?? 100) / 100)} }`);
    });

    return (
        <CommonLayout>
            <LevelWrapper
                uiScale={uiScale()}
                setUiScale={(newValue: number) => setUiScale(newValue)}
            />
        </CommonLayout>
    );
};
