import classNames from "classnames";
import { Component } from "solid-js";

import { unitInPx } from "../../constants/game";
import { ILevelWalkable } from "../../contracts/levelWalkable";
import { preventDefault } from "../../helper/documentHelper";

interface IProps extends ILevelWalkable {
    onRightClick: (id: string) => void;
}

export const WalkableItem: Component<IProps> = (props: IProps) => {

    const onRightClick = (id: string) => (e: any) => {
        preventDefault(e);
        props.onRightClick(id);
    }

    return (
        <div
            class={classNames('walkable-tile')}
            style={{
                top: `${(props.startY) * unitInPx}px`,
                left: `${(props.startX) * unitInPx}px`,
                width: `${((props.endX - props.startX) + 1) * unitInPx}px`,
                height: `${((props.endY - props.startY) + 1) * unitInPx}px`,
                'background-color': 'rgba(200, 0, 0, 0.5)',
            }}
            onContextMenu={onRightClick(props.id)}
            draggable={false}
        ></div>
    );
}