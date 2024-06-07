import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
  createDisclosure,
} from '@hope-ui/solid';
import { Component, Show, createEffect, createSignal } from 'solid-js';

import { layerCssClassOptions, unitInPx } from '../../constants/game';
import { ILevelData } from '../../contracts/levelData';
import { ILevelLayer } from '../../contracts/levelLayer';
import { ISpriteMapLookup } from '../../contracts/spriteMapLookup';
import { LevelControlSpriteItem } from './levelControlSpriteItem';
import { ILevelTile } from '../../contracts/levelTile';
import { LevelItem } from './levelItem';

export interface ILevelLayerControlProps {
  levelData?: ILevelData;
  lookup?: Array<ISpriteMapLookup>;
  selectedLayerIndex: number;
  selectedSpriteItem?: string;
  selectedSpriteItemToPaste?: ISpriteMapLookup;
  layerClasses: Array<string>;
  unselectSpriteItem: () => void;
}

export const LevelLayerDetails: Component<ILevelLayerControlProps> = (
  props: ILevelLayerControlProps,
) => {
  const { isOpen, onClose } = createDisclosure();
  const [currentLayer, setCurrentLayer] = createSignal<ILevelLayer>();
  const [currentItemOnLayer, setCurrentItemOnLayer] = createSignal<ILevelTile>();

  createEffect(() => {
    setCurrentLayer(props.levelData?.layers?.[props.selectedLayerIndex]);

    if (
      props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddGrid) === true ||
      props.layerClasses.includes(layerCssClassOptions.showWalkableZone)
    ) {
      props.unselectSpriteItem?.();
    }

    const currentItemId = props.selectedSpriteItem;
    const currentItemObj = props.levelData?.layers?.[props.selectedLayerIndex]?.items?.find(
      (i) => i.id === currentItemId,
    );
    setCurrentItemOnLayer(currentItemObj);
  });

  const canSelectSprite = (): boolean =>
    props.selectedSpriteItemToPaste == null &&
    props.selectedSpriteItem == null &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddGrid) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZone) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddStart) === false;

  const canDeSelectSprite = (): boolean =>
    props.selectedSpriteItemToPaste == null &&
    props.selectedSpriteItem != null &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddGrid) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZone) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddStart) === false;

  const canNudgeSelectSprite = (): boolean =>
    props.selectedSpriteItemToPaste == null &&
    props.selectedSpriteItem != null &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddGrid) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZone) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddStart) === false;

  const canPlaceSelectSprite = (): boolean =>
    props.selectedSpriteItemToPaste != null &&
    props.selectedSpriteItem == null &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddGrid) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZone) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddStart) === false;

  const canAddWalkableSection = (): boolean =>
    props.selectedSpriteItemToPaste == null &&
    props.selectedSpriteItem == null &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddGrid) === true &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZone) === true &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddStart) === false;

  const canAddWalkableStart = (): boolean =>
    props.selectedSpriteItemToPaste == null &&
    props.selectedSpriteItem == null &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddGrid) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZone) === true &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddStart) === true;

  const canDeleteItem = (): boolean =>
    props.selectedSpriteItemToPaste == null &&
    props.selectedSpriteItem == null &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddGrid) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZone) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddStart) === false;

  const canDeleteWalkableSection = (): boolean =>
    props.selectedSpriteItemToPaste == null &&
    props.selectedSpriteItem == null &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddGrid) === false &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZone) === true &&
    props.layerClasses.includes(layerCssClassOptions.showWalkableZoneAddStart) === false;

  return (
    <>
      <Box class="layer-controls-container left">
        <Flex justifyContent="center" flexDirection="column" class="layer-details" gap="5px">
          <Show when={props.selectedSpriteItemToPaste != null}>
            <Text textAlign="center" size="xl">
              Sprite data:
            </Text>
            <Box
              class={(props.selectedSpriteItemToPaste?.width ?? 0) < 4 ? 'zoom-item-2' : ''}
              mx="auto"
            >
              <LevelControlSpriteItem
                {...props.selectedSpriteItemToPaste!}
                isActive={false}
                onClick={() => {}}
              />
            </Box>
            <Text textAlign="center">{props.selectedSpriteItemToPaste?.type}</Text>
            <Text textAlign="center">
              <span>width: </span>
              <b>{(props.selectedSpriteItemToPaste?.width ?? 0) * unitInPx}px</b>
            </Text>
            <Text textAlign="center">
              <span>height: </span>
              <b>{(props.selectedSpriteItemToPaste?.height ?? 0) * unitInPx}px</b>
            </Text>
            <Button colorScheme="neutral" mt="0.5em" onClick={props.unselectSpriteItem}>
              Un-select
            </Button>
            <Divider my="1em" />
          </Show>

          <Show when={currentItemOnLayer() != null}>
            <Text textAlign="center" size="xl">
              Selected Sprite:
            </Text>
            <Box class={(currentItemOnLayer()?.width ?? 0) < 4 ? 'zoom-item-2' : ''} mx="auto">
              <LevelItem {...currentItemOnLayer()!} isActive={false} lookup={props.lookup ?? []} />
            </Box>
            <Text textAlign="center">{currentItemOnLayer()?.type}</Text>
            <Text textAlign="center">
              <span>x: </span>
              <b>{currentItemOnLayer()?.x ?? 0}</b>
            </Text>
            <Text textAlign="center">
              <span>y: </span>
              <b>{currentItemOnLayer()?.y ?? 0}</b>
            </Text>
            <Text textAlign="center">
              <span>width: </span>
              <b>{(currentItemOnLayer()?.width ?? 0) * unitInPx}px</b>
            </Text>
            <Text textAlign="center">
              <span>height: </span>
              <b>{(currentItemOnLayer()?.height ?? 0) * unitInPx}px</b>
            </Text>
            <Button colorScheme="neutral" mt="0.5em" onClick={props.unselectSpriteItem}>
              Un-select
            </Button>
            <Divider my="1em" />
          </Show>

          <Show when={currentLayer() != null}>
            <Text textAlign="center" size="xl">
              Layer data:
            </Text>
            <Text textAlign="center">
              <span>id: </span>
              {currentLayer()?.id}
            </Text>
            <Text textAlign="center">
              <span>name: </span>
              {currentLayer()?.name}
            </Text>
            <Text textAlign="center">
              <span>items: </span>
              {currentLayer()?.items?.length}
            </Text>
          </Show>

          <Spacer />
          <Divider my="1em" />
          <Text textAlign="center" size="xl">
            Controls:
          </Text>
          <Show when={canSelectSprite()}>
            <Text>
              <span>Left click</span>: Select sprite on current layer
            </Text>
          </Show>
          <Show when={canDeSelectSprite()}>
            <Text>
              <span>Left click</span>: Select or deselect sprite on current layer
            </Text>
          </Show>
          <Show when={canPlaceSelectSprite()}>
            <Text>
              <span>Left click</span>: Place selected sprite on current layer
            </Text>
          </Show>
          <Show when={canAddWalkableSection()}>
            <Text>
              <span>Left click</span>: 1st click to set the start point, 2nd click to set the end
            </Text>
          </Show>
          <Show when={canAddWalkableStart()}>
            <Text>
              <span>Left click</span>: Set the start block of the level
            </Text>
          </Show>

          <Show when={canNudgeSelectSprite()}>
            <Text>
              <span>Arrow keys</span>: Nudge select sprite ini desired direction on current layer
            </Text>
          </Show>

          <Show when={canDeleteItem()}>
            <Text>
              <span>Right click</span>: Delete highlighted item on current layer
            </Text>
          </Show>
          <Show when={canDeleteWalkableSection()}>
            <Text>
              <span>Right click</span>: Delete highlighted walkable section
            </Text>
          </Show>
        </Flex>
      </Box>
      <Modal opened={isOpen()} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Layer settings</ModalHeader>
          <ModalBody>
            <Box>
              <VStack as="form" spacing="$5" alignItems="stretch" maxW="$96" mx="auto"></VStack>
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
