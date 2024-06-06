import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  VStack,
  createDisclosure,
} from '@hope-ui/solid';
import classNames from 'classnames';
import { Component, For, createSignal } from 'solid-js';

import { layerCssClassOptions } from '../../constants/game';
import { ILevelData } from '../../contracts/levelData';
import { ILevelLayer } from '../../contracts/levelLayer';
import { Dropdown } from '../common/dropdown';
import { ISpriteMapLookupContainer } from '../../contracts/spriteMapLookup';

export interface ILevelLayerControlProps {
  levelData: ILevelData;
  mapLookup: ISpriteMapLookupContainer;
  selectedLayerIndex: number;
  layerClasses: Array<string>;
  addLayer: () => void;
  setSelectedLayerIndex: (index: number) => void;
  setBackgroundTile: (newBgTile: string) => void;
  setLayerClasses: (newClasses: Array<string>) => void;
}

export const LevelLayerControl: Component<ILevelLayerControlProps> = (
  props: ILevelLayerControlProps,
) => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [selectedWalkableTileDisplay, setSelectedWalkableTileDisplay] = createSignal<Array<string>>(
    ['none'],
  );

  const renderSwitchControl = (
    className: string,
    title: string,
    layerClasses: Array<string>,
    onClick?: (existed: boolean) => void,
  ) => {
    return (
      <FormControl>
        <Switch
          variant="outline"
          checked={layerClasses.includes(className)}
          onClick={() => setLayerClass(className, layerClasses, onClick)}
        >
          {title}
        </Switch>
      </FormControl>
    );
  };

  const setLayerClass = (
    className: string,
    layerClasses: Array<string>,
    onClick?: (existed: boolean) => void,
  ) => {
    const exists = layerClasses.includes(className);
    if (exists) {
      props.setLayerClasses(layerClasses.filter((c) => c != className));
    } else {
      props.setLayerClasses([...layerClasses, className]);
    }
    onClick?.(exists);
  };

  return (
    <>
      <Box class="layer-controls-container right">
        <Flex justifyContent="center" flexDirection="column" class="layer-controls" gap="5px">
          <Text textAlign="center" size="xl">
            Layers{' '}
            <span class="settings" onClick={onOpen}>
              ⚙️
            </span>
          </Text>
          <For each={props.levelData?.layers ?? []}>
            {(layer: ILevelLayer, index) => (
              <div
                class={classNames('layer-select', {
                  'is-active': index() == props.selectedLayerIndex,
                })}
                onClick={() => props.setSelectedLayerIndex(index())}
                draggable={false}
              >
                {layer.name}
                <br />
                <small>{layer.items.length}x items</small>
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
              <VStack as="form" spacing="$5" alignItems="stretch" maxW="$96" mx="auto">
                <Dropdown
                  title="Deffault background tile"
                  selectedValues={[props.levelData.defaultBackgroundTile]}
                  options={props.mapLookup.definitions
                    .filter((def) => def.tags.includes('background'))
                    .map((def) => ({
                      title: def.type,
                      value: def.type,
                      backgroundImg: `var(--sprite-item-${def.type})`,
                    }))}
                  onSelect={(value: any) => {
                    props.setBackgroundTile(value);
                  }}
                />
                {renderSwitchControl(
                  layerCssClassOptions.disableLayerLevelOpacity,
                  'Disable layer opacity',
                  props.layerClasses,
                )}
                {renderSwitchControl(
                  layerCssClassOptions.showLayerContainerOverflow,
                  'Show layer overflow',
                  props.layerClasses,
                )}
                <Dropdown
                  title="Walkable tile display"
                  selectedValues={selectedWalkableTileDisplay()}
                  options={[
                    {
                      title: 'Not shown',
                      value: 'none',
                    },
                    {
                      title: 'Add walkable tiles',
                      value: 'add-tiles',
                    },
                    {
                      title: 'Remove walkable tiles',
                      value: 'show-tiles',
                    },
                    {
                      title: 'Set default start tile',
                      value: 'start-tile',
                    },
                  ]}
                  onSelect={(value: any) => {
                    let classesToAdd: Array<string> = [layerCssClassOptions.showWalkableZone];
                    let allWalkableClasses: Array<string> = [
                      layerCssClassOptions.showWalkableZone,
                      layerCssClassOptions.showWalkableZoneAddGrid,
                      layerCssClassOptions.showWalkableZoneAddStart,
                    ];

                    if (value === 'none') {
                      classesToAdd = [];
                    }
                    if (value === 'add-tiles') {
                      classesToAdd.push(layerCssClassOptions.showWalkableZoneAddGrid);
                    }
                    if (value === 'start-tile') {
                      classesToAdd.push(layerCssClassOptions.showWalkableZoneAddStart);
                    }

                    const classesAfterRemoval = props.layerClasses.filter(
                      (c) => allWalkableClasses.includes(c) === false,
                    );
                    props.setLayerClasses([...classesAfterRemoval, ...classesToAdd]);
                    setSelectedWalkableTileDisplay(value);
                  }}
                />
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
