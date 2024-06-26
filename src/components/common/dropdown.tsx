import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectPlaceholder,
  SelectTrigger,
  SelectValue,
  Text,
} from '@hope-ui/solid';
import { Component, For, JSX, Show, createEffect, createSignal } from 'solid-js';
import { CustomImage } from './image';

export interface IDropdownOption {
  title: string;
  value: string;
  image?: string;
  backgroundImg?: string;
}

interface IProps {
  title?: string;
  placeholder?: string | JSX.Element;
  multiple?: boolean;
  selectedValues?: Array<string>;
  options: Array<IDropdownOption>;
  onSelect?: (values: string | Array<string>) => void;
}

export const Dropdown: Component<IProps> = (props: IProps) => {
  const [selectedOptions, setSelectedOptions] = createSignal(props.selectedValues ?? [], {
    equals: false,
  });

  createEffect(() => {
    setSelectedOptions(props.selectedValues ?? []);
  });

  const onSelectOption = (selectedOpts: any) => {
    setSelectedOptions(selectedOpts);
    props.onSelect?.(selectedOpts);
  };

  const getOptionFromValue = (value: string | number) => {
    const matchingOpt = props.options.find((opt) => opt.value === value);
    return matchingOpt;
  };

  return (
    <FormControl>
      <Show when={props.title != null}>
        <FormLabel>{props.title}</FormLabel>
      </Show>
      <Select multiple={props.multiple} value={selectedOptions()} onChange={onSelectOption}>
        <SelectTrigger>
          <SelectPlaceholder>{props.placeholder}</SelectPlaceholder>
          <SelectValue>
            {({ selectedOptions }) => (
              <Flex alignItems="flex-start">
                <For each={selectedOptions}>
                  {(selectedOption) => (
                    <Flex mr="1em">
                      <Show when={getOptionFromValue(selectedOption.value)?.image != null}>
                        <CustomImage
                          src={getOptionFromValue(selectedOption.value)!.image}
                          alt={getOptionFromValue(selectedOption.value)!.title}
                          borderRadius={3}
                          height="1.5em"
                          width="1.5em"
                          mr="0.5em"
                        />
                      </Show>
                      <Show when={getOptionFromValue(selectedOption.value)?.backgroundImg != null}>
                        <Box
                          background={getOptionFromValue(selectedOption.value)!.backgroundImg}
                          borderRadius={3}
                          height="1.5em"
                          width="1.5em"
                          mr="0.5em"
                        />
                      </Show>
                      <Text textAlign="start">{selectedOption.textValue}</Text>
                    </Flex>
                  )}
                </For>
              </Flex>
            )}
          </SelectValue>
          <SelectIcon />
        </SelectTrigger>
        <SelectContent>
          <SelectListbox>
            <For each={props.options}>
              {(item) => (
                <SelectOption value={item.value}>
                  <Show when={item.image != null}>
                    <CustomImage
                      src={item.image}
                      alt={item.title}
                      borderRadius={5}
                      maxHeight="2em"
                      maxWidth="2em"
                      ml="0.5em"
                    />
                  </Show>
                  <Show when={item.backgroundImg != null}>
                    <Box
                      background={item.backgroundImg}
                      borderRadius={3}
                      height="1.5em"
                      width="1.5em"
                      ml="0.5em"
                    />
                  </Show>
                  <SelectOptionText>{item.title}</SelectOptionText>
                  <SelectOptionIndicator />
                </SelectOption>
              )}
            </For>
          </SelectListbox>
        </SelectContent>
      </Select>
    </FormControl>
  );
};
