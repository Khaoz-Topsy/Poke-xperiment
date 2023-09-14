import { Component, JSX, Show } from "solid-js";

import { Button, Center, Flex, classNames } from "@hope-ui/solid";
import { PageHeader } from "../common/pageHeader";
import { LevelBackground } from "./levelBackground";

interface IProps {
    name: string;
    additionalCss?: string;
    defaultBackgroundTile: string;
    children: JSX.Element;
    additionControls?: JSX.Element;
    leftControls?: JSX.Element;
    rightControls?: JSX.Element;
    bottomControls?: JSX.Element;
    uiScale: number;
    setUiScale: (newValue: number) => void;
    wrapper?: (name: string, children: JSX.Element) => JSX.Element;
}

export const LevelContainer: Component<IProps> = (props: IProps) => {

    const applyWrapper = (name: string, children: JSX.Element) => {
        if (props.wrapper == null) {
            return (
                <Flex w="100%" h="100vh" justifyContent="center" flexDirection="column" position="relative">
                    <PageHeader text={name}></PageHeader>
                    <Center class="controls">
                        {props.additionControls}
                        <Button onClick={() => props.setUiScale(props.uiScale + 10)} mr="2px">+</Button>
                        <Button onClick={() => props.setUiScale(props.uiScale - 10)}>-</Button>
                    </Center>
                    <Show when={props.leftControls != null}>
                        {props.leftControls}
                    </Show>
                    <Center class="level-children-wrapper" flexGrow={1} position="relative">
                        {children}
                    </Center>
                    <Show when={props.rightControls != null}>
                        {props.rightControls}
                    </Show>
                    <Show
                        when={props.bottomControls != null}
                        fallback={<PageHeader text=""></PageHeader>}
                    >
                        {props.bottomControls}
                    </Show>
                </Flex>
            );
        }

        return props.wrapper(name, children);
    }

    return (
        <>
            {applyWrapper(
                props.name,
                <div
                    class={classNames('level-container', props.additionalCss)}
                    style={{ '--level-scale': ((props.uiScale ?? 100) / 100) }}
                >
                    <LevelBackground
                        defaultBackgroundTile={props.defaultBackgroundTile}
                    />
                    {props.children}
                </div>
            )}
        </>
    );
}