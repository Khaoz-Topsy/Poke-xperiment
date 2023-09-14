import { Box, Center, Flex, Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, createDisclosure, Button, VStack, FormControl, FormLabel, Input, Switch } from '@hope-ui/solid';
import classNames from 'classnames';
import { Component, For, Show } from 'solid-js';

import { ILevelData } from '../../contracts/levelData';
import { ILevelLayer } from '../../contracts/levelLayer';
import { layerCssClassOptions } from '../../constants/game';

export interface ILevelLayerControlProps {
    levelData: ILevelData;
    selectedLayerIndex: number;
    layerClasses: Array<string>;
    addLayer: () => void;
    toggleWalkableGrid: (newValue?: boolean) => void;
    setSelectedLayerIndex: (index: number) => void;
    setLayerClasses: (newClasses: Array<string>) => void;
}

export const LevelLayerControl: Component<ILevelLayerControlProps> = (props: ILevelLayerControlProps) => {

    const { isOpen, onOpen, onClose } = createDisclosure();

    const renderSwitchControl = (className: string, title: string, layerClasses: Array<string>, onClick?: (existed: boolean) => void) => {
        return (
            <FormControl>
                <Switch
                    variant="outline"
                    checked={layerClasses.includes(className)}
                    onClick={() => setLayerClass(className, layerClasses, onClick)}
                >{title}</Switch>
            </FormControl>
        );
    }

    const setLayerClass = (className: string, layerClasses: Array<string>, onClick?: (existed: boolean) => void) => {
        const exists = layerClasses.includes(className);
        if (exists) {
            props.setLayerClasses(layerClasses.filter(c => c != className));
        } else {
            props.setLayerClasses([...layerClasses, className]);
        }
        onClick?.(exists);
    }

    const toggleWalkableGrid = (existed: boolean) => {
        if (existed) {
            const newClss = props.layerClasses.filter(c => c != layerCssClassOptions.showWalkableZoneAddGrid);
            props.setLayerClasses(newClss);
            props.toggleWalkableGrid(false);
        }
    }

    const toggleWalkableZoneAddGrid = () => {
        props.toggleWalkableGrid();
    }

    return (
        <>
            <Box class="layer-controls-container right">
                <Flex justifyContent="center" flexDirection="column" class="layer-controls" gap="5px">
                    <Text textAlign="center" size="xl">Layers <span class="settings" onClick={onOpen}>⚙️</span></Text>
                    <For each={(props.levelData?.layers ?? [])}>
                        {(layer: ILevelLayer, index) => (
                            <div
                                class={classNames('layer-select', { 'is-active': (index() == props.selectedLayerIndex) })}
                                onClick={() => props.setSelectedLayerIndex(index())}
                                draggable={false}
                            >
                                {layer.name}<br /><small>{layer.items.length}x items</small>
                            </div>
                        )}
                    </For>
                    <Center class="layer-select" onClick={props.addLayer} draggable={false}>
                        + Add Layer
                    </Center>
                </Flex>
            </Box>
            <Modal opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Layer settings</ModalHeader>
                    <ModalBody>
                        <Box>
                            <VStack
                                as="form"
                                spacing="$5"
                                alignItems="stretch"
                                maxW="$96"
                                mx="auto"
                            >
                                {renderSwitchControl(layerCssClassOptions.disableLayerLevelOpacity, 'Disable layer opacity', props.layerClasses)}
                                {renderSwitchControl(layerCssClassOptions.showLayerContainerOverflow, 'Show layer overflow', props.layerClasses)}
                                {renderSwitchControl(layerCssClassOptions.showWalkableZone, 'Show walkable tiles', props.layerClasses, (exists: boolean) => toggleWalkableGrid(exists))}
                                <Show when={props.layerClasses.includes(layerCssClassOptions.showWalkableZone)}>
                                    {renderSwitchControl(layerCssClassOptions.showWalkableZoneAddGrid, 'Add walkable section', props.layerClasses, () => toggleWalkableZoneAddGrid())}
                                </Show>

                            </VStack>
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