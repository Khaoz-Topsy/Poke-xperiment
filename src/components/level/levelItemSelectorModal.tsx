import { SolidBottomsheet } from 'solid-bottomsheet';
import { Component, For, createSignal } from 'solid-js';

import 'solid-bottomsheet/styles.css';

import { Box, Button } from '@hope-ui/solid';
import { SpriteItemType } from '../../contracts/spriteItem';
import { ISpriteMapLookup, ISpriteMapLookupContainer } from '../../contracts/spriteMapLookup';
import { LevelControlSpriteItem } from './levelControlSpriteItem';

interface IProps {
  mapLookup: ISpriteMapLookupContainer | undefined;
  selectedSpriteItemToPaste: ISpriteMapLookup | undefined;
  toggleSelectedSprite: (isActive: boolean, spriteItem: ISpriteMapLookup) => void;
}

export const LevelItemSelectorModal: Component<IProps> = (props: IProps) => {
  const [isOpen, setOpen] = createSignal(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} mr="2px">
        Select an item
      </Button>
      {isOpen() && (
        <SolidBottomsheet
          variant="snap"
          defaultSnapPoint={({ maxHeight }: any) => maxHeight / 2}
          snapPoints={({ maxHeight }: any) => [maxHeight, maxHeight / 4]}
          onClose={() => setOpen(false)}
        >
          <Box class="select-sprite-item">
            <For
              each={(props.mapLookup?.definitions ?? [])
                .filter((m) => m.type != SpriteItemType.unknown)
                .sort((a, b) => a.width + a.height - (b.width + b.height))}
            >
              {(item: ISpriteMapLookup) => (
                <LevelControlSpriteItem
                  {...item}
                  isInGrid={true}
                  isActive={item.type === props.selectedSpriteItemToPaste?.type}
                  onClick={(isActive, _) => {
                    props.toggleSelectedSprite(isActive, item);
                    setOpen(false);
                  }}
                />
              )}
            </For>
          </Box>
        </SolidBottomsheet>
      )}
    </>
  );
};
