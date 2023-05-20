import { Component, For } from "solid-js";

interface IProps {
    defaultBackgroundTile: string;
}

export const LevelBackground: Component<IProps> = (props: IProps) => {
    return (
        <div class="level-bg">
            <div
                class="content"
                style={{
                    'background-image': `var(--sprite-item-${props.defaultBackgroundTile})`,
                }}
                draggable={false}
            ></div>
        </div>
    );
}