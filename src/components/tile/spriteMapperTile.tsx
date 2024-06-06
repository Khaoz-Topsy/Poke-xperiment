import { Button, Center, Flex, GridItem, Text, VStack } from '@hope-ui/solid';
import classNames from 'classnames';
import { Component } from 'solid-js';
import { ISpriteMapLookup } from '../../contracts/spriteMapLookup';
import { Card } from '../common/card';
import { LevelControlSpriteItem } from '../level/levelControlSpriteItem';

interface IProps {
  definition: ISpriteMapLookup;
  selectedDefinition: ISpriteMapLookup | undefined;
  setSelectedDefinition: (newDef: ISpriteMapLookup) => void;
  removeDefinition: (event: any) => void;
  editDefinition: (event: any) => void;
}

export const SpriteMapperTile: Component<IProps> = (props: IProps) => {
  return (
    <GridItem
      class={classNames('sprite-mapper-tile', {
        active: props.definition.type == props.selectedDefinition?.type,
      })}
    >
      <Card overflowY="hidden">
        <Flex onClick={() => props.setSelectedDefinition(props.definition)}>
          <Center class={`sprite size-${props.definition.width}-${props.definition.width}`}>
            <LevelControlSpriteItem {...props.definition} isActive={false} onClick={() => {}} />
          </Center>
          <VStack class="details">
            <Text>{props.definition.type}</Text>
          </VStack>
        </Flex>
        <Button class="close" colorScheme="danger" onClick={props.removeDefinition} zIndex={100}>
          X
        </Button>
        <Button
          class="edit"
          colorScheme="info"
          onClick={() => props.editDefinition(props.definition)}
          zIndex={100}
        >
          ✏️
        </Button>
      </Card>
    </GridItem>
  );
};
