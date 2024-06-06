import { Box, Button, FormControl, FormLabel, HStack, Input, VStack } from '@hope-ui/solid';
import { Component } from 'solid-js';
import { ISpriteMapLookup } from '../../contracts/spriteMapLookup';

interface IProps {
  selectedDefinition: ISpriteMapLookup | undefined;
  editSelectedDefinition: (propsName: string) => (event: any) => void;
  editDefinition: () => void;
  addDefinition: () => void;
}

export const SpriteMapperForm: Component<IProps> = (props: IProps) => {
  const renderFormItem = (renderProps: {
    title: string;
    type: string;
    propName: string;
    placeholder: string;
  }) => {
    return (
      <FormControl>
        <FormLabel>{renderProps.title}</FormLabel>
        <Input
          type={renderProps.type}
          name={renderProps.propName}
          value={(props.selectedDefinition as any)?.[renderProps.propName] ?? ''}
          onChange={props.editSelectedDefinition(renderProps.propName)}
          placeholder={renderProps.placeholder}
        />
      </FormControl>
    );
  };

  return (
    <VStack spacing="$5" alignItems="stretch" mx="auto">
      {renderFormItem({
        type: 'text',
        title: 'Type',
        propName: 'type',
        placeholder: 'grass1',
      })}
      <HStack>
        {renderFormItem({
          type: 'number',
          title: 'X position',
          propName: 'x',
          placeholder: '16',
        })}
        <Box m="3px"></Box>
        {renderFormItem({
          type: 'number',
          title: 'Y position',
          propName: 'y',
          placeholder: '16',
        })}
      </HStack>
      <HStack>
        {renderFormItem({
          type: 'number',
          title: 'Width (cells)',
          propName: 'width',
          placeholder: '1',
        })}
        <Box m="3px"></Box>
        {renderFormItem({
          type: 'number',
          title: 'Height (cells)',
          propName: 'height',
          placeholder: '1',
        })}
      </HStack>
      <HStack mt="1em" gap="0.5em">
        <Button flex={1} onClick={() => props.editDefinition()}>
          Edit tile
        </Button>
        <Button flex={1} onClick={() => props.addDefinition()}>
          Add tile
        </Button>
      </HStack>
    </VStack>
  );
};
