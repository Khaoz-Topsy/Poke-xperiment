import { Box } from '@hope-ui/solid';
import { Component, JSX } from 'solid-js';
import { Property } from 'csstype';
import classNames from 'classnames';

interface IProps {
  class?: string;
  width?: string;
  overflowY?: Property.OverflowY;
  children: JSX.Element;
}

export const Card: Component<IProps> = (props: IProps) => {
  return (
    <Box
      class={classNames('card', props.class)}
      border="1px solid $neutral5"
      p="$4"
      width={props.width}
      borderTopRadius="$lg"
      borderBottomRadius="$lg"
      overflowY={props.overflowY ?? 'auto'}
    >
      {props.children}
    </Box>
  );
};
