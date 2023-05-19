import { Box, Button, Center, FormControl, FormLabel, Input } from '@hope-ui/solid';
import { useNavigate } from '@solidjs/router';
import { Component, Show, onMount } from 'solid-js';

import { Card } from '../components/common/card';
import { CenterLoading } from '../components/core/loading';
import { Level } from '../constants/game';
import { routes } from '../constants/route';
import { getProgressLevel } from '../services/store/sections/progressState';
import { getCharacter, getUserName } from '../services/store/sections/userState';
import { getStateService } from '../services/store/stateService';
import { CommonLayout } from '../components/common/layout';
import { CharacterInMotion } from '../components/character/characterInMotion';

export const HomePage: Component = () => {
    const navigate = useNavigate();

    const stateRef = getStateService();
    const [userName, setUserName] = getUserName(stateRef);
    const [charIndex, setCharIndex] = getCharacter(stateRef);
    const [level, setLevel] = getProgressLevel(stateRef);

    const startGame = () => {
        setLevel(Level.intro);
        setTimeout(() => navigate(routes.level), 250);
    }

    return (
        <CommonLayout>
            <Center h="100vh" class="home-page">
                <Card>
                    <Box p="1em">
                        <Center mb="1em">
                            <CharacterInMotion
                                charIndex={charIndex()}
                                scale={2}
                            />
                        </Center>
                        <FormControl mb="1em">
                            <FormLabel for="username">Username</FormLabel>
                            <Input
                                id="username"
                                type="text"
                                value={userName()}
                                onChange={(e: any) => setUserName(e?.target?.value ?? '')}
                            />
                        </FormControl>
                        <Show
                            when={level() != Level.none}
                            fallback={<Button w="100%" onClick={startGame}>Start game</Button>}
                        >
                            <Button w="100%" onClick={() => navigate(routes.level)}>Continue game</Button>
                        </Show>
                    </Box>
                </Card>
            </Center>
        </CommonLayout>
    );
};

export const RedirectToHome: Component = () => {
    const navigate = useNavigate();
    navigate(routes.actualHome);

    return (
        <CenterLoading />
    );
};
