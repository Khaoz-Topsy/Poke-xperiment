import { Component, JSX } from 'solid-js';

import { ILevelLayer } from '../../contracts/levelLayer';
import { noContextMenu } from '../../helper/documentHelper';

export interface ILevelLayerProps {
    layer: ILevelLayer;
    additionalClasses?: string;
    children: JSX.Element;
}

export const LevelLayer: Component<ILevelLayerProps> = (props: ILevelLayerProps) => {
    return (
        <div
            class={`level-layer ${props.layer.id} ${props.additionalClasses}`}
            data-id={props.layer.id}
            onContextMenu={noContextMenu}
        >
            {props.children}
        </div>
    );
};