import { Component, For, createEffect, createSignal } from 'solid-js';

import classNames from 'classnames';
import { columnAndRowGridCells, numColumns } from '../../constants/game';
import { SpriteItemType } from '../../contracts/spriteItem';
import { noContextMenu, updateCustomStyleTag } from '../../helper/documentHelper';
import { ILevelCoord } from '../../contracts/levelCoord';

interface IProps {
  colSpan?: number;
  rowSpan?: number;
  selectedCoord?: ILevelCoord;
  additionalClassNames?: string;
  onClick: (colIndex: number, rowIndex: number) => void;
}

export const LevelControlPasteGrid: Component<IProps> = (props: IProps) => {
  createEffect(() => {
    const basCssSelector =
      '.level-container .level-layer.editor-paste.colspan-<colnum> .sprite-tile:hover <siblingCss> + .sprite-tile:after { opacity: 0.5; }';
    const colSpanCount = props.colSpan ?? 1;

    const cssRules = [
      `.level-layer.editor-paste.walkable .x-${props.selectedCoord?.x}.y-${props.selectedCoord?.y}:after { background-color: red; opacity: 0.5; }`,
    ];

    const rowLoopCount = props.rowSpan ?? 1;
    for (let rowIndex = 0; rowIndex < rowLoopCount; rowIndex++) {
      let numSibling = numColumns * rowIndex;
      if (numSibling > 1) numSibling--;

      for (let colIndex = 0; colIndex < colSpanCount; colIndex++) {
        if (rowIndex == 0 && colIndex == colSpanCount - 1) continue;

        const siblingCss = Array.from(Array(numSibling + colIndex).keys())
          .map((d) => '+ .sprite-tile')
          .join(' ');

        cssRules.push(
          basCssSelector
            .replaceAll('<colnum>', colSpanCount.toString())
            .replaceAll('<siblingCss>', siblingCss),
        );
      }
    }

    updateCustomStyleTag(`poke-sprite-map-highlight-style`, cssRules.join(' '));
  });

  return (
    <div
      class={classNames(
        'level-layer',
        'editor-paste',
        props.additionalClassNames,
        `colspan-${props.colSpan ?? 1}`,
        `rowspan-${props.rowSpan ?? 1}`,
      )}
      onContextMenu={noContextMenu}
    >
      <For each={columnAndRowGridCells}>
        {(_: number, index) => {
          const colIndex = index() % numColumns;
          const rowIndex = Math.floor(index() / numColumns);
          return (
            <div
              class={classNames('sprite-tile', 'unknown', `x-${colIndex}`, `y-${rowIndex}`)}
              onClick={() => props.onClick(colIndex, rowIndex)}
              style={{
                'background-image': `var(--sprite-item-${SpriteItemType.unknown})`,
              }}
              draggable={false}
            ></div>
          );
        }}
      </For>
    </div>
  );
};
