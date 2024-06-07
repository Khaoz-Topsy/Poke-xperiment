import { Component, JSX } from 'solid-js';
import classNames from 'classnames';

import { SpriteItemType } from '../../contracts/spriteItem';
import { unitInPx } from '../../constants/game';

interface ILevelControlSpriteItemProps {
  type: SpriteItemType;
  isActive: boolean;
  width: number;
  height: number;
  isInGrid?: boolean;
  onClick: (isActive: boolean, type: SpriteItemType) => void;
}

export const LevelControlSpriteItem: Component<ILevelControlSpriteItemProps> = (
  props: ILevelControlSpriteItemProps,
) => {
  const getStyles = (localProps: ILevelControlSpriteItemProps) => {
    const styles: JSX.CSSProperties = {
      'background-image': `var(--sprite-item-${localProps.type})`,
    };
    if (localProps.isInGrid === true) {
      styles['grid-area'] = `span ${localProps.height} / span ${localProps.width}`;
    } else {
      styles.width = localProps.isInGrid ? 'unset' : `${localProps.width * unitInPx}px`;
      styles.height = `${localProps.height * unitInPx}px`;
    }

    return styles;
  };

  return (
    <div
      class={classNames('sprite-tile', props.type, {
        'is-active': props.isActive,
      })}
      onClick={() => props.onClick(props.isActive, props.type)}
      style={getStyles(props)}
      draggable={false}
    ></div>
  );
};
