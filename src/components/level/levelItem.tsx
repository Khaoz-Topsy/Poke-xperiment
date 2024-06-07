import { Component, createEffect, createSignal } from 'solid-js';
import classNames from 'classnames';

import { ILevelTile } from '../../contracts/levelTile';
import { ISpriteMapLookup } from '../../contracts/spriteMapLookup';
import { unitInPx } from '../../constants/game';

interface IProps extends ILevelTile {
  lookup: Array<ISpriteMapLookup>;
  isActive?: boolean;
  onLeftClick?: () => void;
  onRightClick?: () => void;
}

export const LevelItem: Component<IProps> = (props: IProps) => {
  const [width, setWidth] = createSignal(props.width);
  const [height, setHeight] = createSignal(props.height);

  createEffect(() => {
    const spriteMapMeta = props.lookup.find((li) => li.type === props.type);
    if (spriteMapMeta == null) {
      return <div>Error</div>;
    }

    const tempWidth = spriteMapMeta.width * unitInPx;
    const tempHeight = spriteMapMeta.height * unitInPx;

    setWidth(tempWidth);
    setHeight(tempHeight);
  });

  const onRightClick = (e: any) => {
    e?.preventDefault?.();
    props.onRightClick?.();
  };

  return (
    <div
      class={classNames('level-tile', props.type, {
        'is-active': props.isActive === true,
      })}
      style={{
        top: `${props.y}px`,
        left: `${props.x}px`,
        width: `${width()}px`,
        height: `${height()}px`,
        'background-image': `var(--sprite-item-${props.type})`,
      }}
      onClick={props.onLeftClick}
      onContextMenu={onRightClick}
      draggable={false}
    ></div>
  );
};
