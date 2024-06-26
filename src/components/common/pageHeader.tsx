import { Flex, Heading } from '@hope-ui/solid';
import { Component, JSX } from 'solid-js';

interface IProps {
  text: string;
  class?: string;
}

export const PageHeader: Component<IProps> = (props: IProps) => {
  return (
    <Flex
      class={`page-title noselect ${props.class}`}
      position="relative"
      direction="row"
      justifyContent="center"
      paddingTop="2em"
      mb="1em"
    >
      <Heading size="3xl">{props.text}</Heading>
    </Flex>
  );
};
