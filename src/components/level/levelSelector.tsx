import { Component, For } from 'solid-js';

import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, createDisclosure } from '@hope-ui/solid';
import { Level } from '../../constants/game';

export interface ILevelSelectorModalProps {
    loadLevel: (level: Level) => void;
}

export const LevelSelectorModal: Component<ILevelSelectorModalProps> = (props: ILevelSelectorModalProps) => {

    const { isOpen, onOpen, onClose } = createDisclosure();

    const loadLevel = (level: Level) => {
        props.loadLevel(level);
        onClose();
    }

    return (
        <>
            <Button onClick={onOpen} mr="2px">Load level</Button>
            <Modal opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Level selector</ModalHeader>
                    <ModalBody>
                        <Box pl="1em">
                            <ul>
                                <For each={Object.values(Level).filter((l: any) => isNaN(l) && l != Level.none)}>
                                    {(level: Level) => (
                                        <li class="pointer" onClick={() => loadLevel(level)}>{level}</li>
                                    )}
                                </For>
                                <li class="pointer" onClick={() => loadLevel(Level.none)}>New Level</li>
                            </ul>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};