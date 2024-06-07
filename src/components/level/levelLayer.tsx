import { Component, JSX } from 'solid-js';

import { ILevelLayer } from '../../contracts/levelLayer';
import { noContextMenu } from '../../helper/documentHelper';
import { classNames } from '@hope-ui/solid';

export interface ILevelLayerProps {
  layer: ILevelLayer;
  additionalClasses?: string;
  children: JSX.Element;
}

export const LevelLayer: Component<ILevelLayerProps> = (props: ILevelLayerProps) => {
  return (
    <div
      class={classNames('level-layer', props.additionalClasses)}
      data-id={props.layer.id}
      onContextMenu={noContextMenu}
    >
      {props.children}
    </div>
  );
};
