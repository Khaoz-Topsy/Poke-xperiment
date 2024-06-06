import { Component } from 'solid-js';
import classNames from 'classnames';

import { SpriteItemType } from '../../contracts/spriteItem';
import { unitInPx } from '../../constants/game';

interface ILevelControlSpriteItemProps {
  type: SpriteItemType;
  isActive: boolean;
  width: number;
  height: number;
  onClick: (isActive: boolean, type: SpriteItemType) => void;
}

export const LevelControlSpriteItem: Component<ILevelControlSpriteItemProps> = (
  props: ILevelControlSpriteItemProps,
) => {
  return (
    <div
      class={classNames('sprite-tile', props.type, {
        'is-active': props.isActive,
      })}
      onClick={() => props.onClick(props.isActive, props.type)}
      style={{
        width: `${props.width * unitInPx}px`,
        height: `${props.height * unitInPx}px`,
        'background-image': `var(--sprite-item-${props.type})`,
      }}
      draggable={false}
    ></div>
  );
};
