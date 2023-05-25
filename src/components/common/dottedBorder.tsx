import { Box } from "@hope-ui/solid";
import classNames from "classnames";
import { Component, JSX } from "solid-js";

interface IProps {
    class?: string;
    width?: string;
    children: JSX.Element;
}

export const DottedBorder: Component<IProps> = (props: IProps) => {
    return (
        <Box
            class={classNames('noselect', props.class)}
            border="5px dashed $neutral5"
            p="$7"
            width={props.width}
            borderTopRadius="$lg"
            borderBottomRadius="$lg"
            draggable={false}
            overflowY="auto"
        >
            {props.children}
        </Box>
    );
}