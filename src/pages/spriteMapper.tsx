import { Box, Image, Center, Container, Flex, Tab, TabList, TabPanel, Tabs, Text, Textarea, VStack, Input, Button, Spacer, Grid, GridItem, HStack, FormControl, FormLabel } from '@hope-ui/solid';
import classNames from "classnames";
import Mousetrap from 'mousetrap';
import { Component, For, Show, createSignal, onCleanup, onMount } from 'solid-js';

import { CommonLayout } from '../components/common/layout';
import { CenterLoading } from '../components/core/loading';
import { LevelContainer } from '../components/level/levelContainer';
import { LevelControlPasteGrid } from '../components/level/levelControlPasteGrid';
import { LevelControlSpriteItem } from '../components/level/levelControlSpriteItem';
import { LevelItem } from '../components/level/levelItem';
import { LevelLayer } from '../components/level/levelLayer';
import { LevelLayerControl } from '../components/level/levelLayerControl';
import { LevelSelectorModal } from '../components/level/levelSelector';
import { WalkableItem } from '../components/level/walkableItem';
import { NetworkState } from '../constants/enum/networkState';
import { Level, layerCssClassOptions, unitInPx } from '../constants/game';
import { knownKeybinds } from '../constants/keybind';
import { ILevelCoord } from '../contracts/levelCoord';
import { ILevelData } from '../contracts/levelData';
import { ILevelLayer } from '../contracts/levelLayer';
import { ILevelTile } from '../contracts/levelTile';
import { ILevelWalkable } from '../contracts/levelWalkable';
import { SpriteItemType } from '../contracts/spriteItem';
import { ISpriteMapLookup, ISpriteMapLookupContainer } from '../contracts/spriteMapLookup';
import { uuidv4 } from '../helper/guidHelper';
import { stringInputPopup } from '../helper/popupHelper';
import { addLayerMapper, addSpriteToMapMapper, handleWalkableGridSelectMapper, removeSpriteFromMapMapper, removeWalkableGridItemMapper } from '../mapper/levelData';
import { getLevelServ } from '../services/internal/levelService';
import { getSpriteMapServ } from '../services/internal/spriteMapService';
import { getScale } from '../services/store/sections/userState';
import { getStateService } from '../services/store/stateService';
import { PageHeader } from '../components/common/pageHeader';
import { anyObject } from '../helper/typescriptHacks';
import { Card } from '../components/common/card';
import { DottedBorder } from '../components/common/dottedBorder';
import { readFileAsync } from '../helper/fileHelper';

export const SpriteMapperPage: Component = () => {

    let elemImg: HTMLInputElement | undefined;
    let elemJson: HTMLInputElement | undefined;

    const [step, setStep] = createSignal<number>(0);
    const [tabIndex, setTabIndex] = createSignal<number>(0);
    const [spriteMapContainer, setSpriteMapContainer] = createSignal<ISpriteMapLookupContainer>(anyObject);
    const [spriteMapSrc, setSpriteMapSrc] = createSignal<string>();
    const [selectedDefinition, setSelectedDefinition] = createSignal<ISpriteMapLookup>();

    const onUploadSpriteMap = (event: any) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        setSpriteMapSrc(URL.createObjectURL(event.target.files[0]));
        event.target.value = null;
    }

    const onUploadSpriteMapJson = async (event: any) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const templateJsonRef = event.target.files[0];
        const templateJson = await readFileAsync(templateJsonRef);
        const templObj = JSON.parse(templateJson.toString());
        setSpriteMapContainer(templObj);
        setTabIndex(2);

        event.target.value = null;
    }

    const editSelectedDefinition = (propsName: string) => (event: any) => {
        const value = event?.target?.value;
        if (value == null) return;

        setSelectedDefinition((prev: any) => ({
            ...prev,
            [propsName]: value,
        }));
    }

    const renderFormItem = (renderProps: {
        title: string;
        type: string;
        propName: string;
        placeholder: string;
    }) => {
        return (
            <FormControl>
                <FormLabel>{renderProps.title}</FormLabel>
                <Input
                    type={renderProps.type}
                    name={renderProps.propName}
                    value={(selectedDefinition() as any)?.[renderProps.propName] ?? ''}
                    onChange={editSelectedDefinition(renderProps.propName)}
                    placeholder={renderProps.placeholder}
                />
            </FormControl>
        );
    }

    return (
        <CommonLayout>
            <Flex w="100%" h="100vh" justifyContent="center" flexDirection="column">
                <PageHeader text="Sprite mapper"></PageHeader>
                <Center class="sprite-map" flexGrow={1} position="relative">
                    <Show when={step() == 0}>
                        <Container pb="2em">
                            <Flex gap="1em" px="1em" minH="50vh">
                                <Box flex={1}>
                                    <Card width="100%">
                                        <Center p="2em" height="60vh">
                                            <Show
                                                when={spriteMapSrc() == null}
                                                fallback={
                                                    <DottedBorder>
                                                        <Image src={spriteMapSrc()} alt="upload image" maxH="50vh" draggable={false} />
                                                    </DottedBorder>
                                                }
                                            >
                                                <Box cursor="pointer" onClick={() => (elemImg as any)?.click?.()} width="60%">
                                                    <DottedBorder>
                                                        <VStack>
                                                            <Image src="/assets/img/uploadImg.png" alt="upload image" draggable={false} />
                                                            <br />
                                                            <Text>Upload a png, jpg, etc</Text>
                                                            <Input
                                                                ref={elemImg}
                                                                id="spritemap"
                                                                placeholder="sprite map image"
                                                                accept="image/*"
                                                                type="file"
                                                                style={{ display: 'none' }}
                                                                onChange={onUploadSpriteMap}
                                                            />
                                                        </VStack>
                                                    </DottedBorder>
                                                </Box>
                                            </Show>
                                        </Center>
                                    </Card>
                                </Box>
                                <Box flex={1}>
                                    <Card>
                                        <Tabs height="60vh" fitted variant="pills" index={tabIndex()} onChange={setTabIndex}>
                                            <TabList>
                                                <Tab>New sprite map</Tab>
                                                <Tab>Upload JSON</Tab>
                                                <Tab>Paste JSON</Tab>
                                            </TabList>
                                            <TabPanel>
                                                <DottedBorder>
                                                    <VStack>
                                                        <Image src="/assets/img/pikachu.png" alt="pikachu" draggable={false} />
                                                        <br />
                                                        <Text>Sprite map object will be created</Text>
                                                    </VStack>
                                                </DottedBorder>
                                            </TabPanel>
                                            <TabPanel>
                                                <Box pt="2em" cursor="pointer" onClick={() => (elemJson as any)?.click?.()}>
                                                    <DottedBorder>
                                                        <VStack>
                                                            <Image src="/assets/img/uploadJson.png" alt="upload json" draggable={false} />
                                                            <br />
                                                            <Text>Upload a JSON file</Text>
                                                            <Input
                                                                ref={elemJson}
                                                                id="spritemap"
                                                                placeholder="sprite map image"
                                                                accept="application/JSON"
                                                                type="file"
                                                                style={{ display: 'none' }}
                                                                onChange={onUploadSpriteMapJson}
                                                            />
                                                        </VStack>
                                                    </DottedBorder>
                                                </Box>
                                            </TabPanel>
                                            <TabPanel height="95% !important">
                                                <Textarea
                                                    width="100% !important"
                                                    height="100% !important"
                                                    value={JSON.stringify(spriteMapContainer(), null, 4)}
                                                />
                                            </TabPanel>
                                        </Tabs>
                                    </Card>
                                </Box>
                            </Flex>
                            <Center>
                                <Button mt="2em" width="50%" onClick={() => setStep(1)}>Next step</Button>
                            </Center>
                        </Container>
                    </Show>
                    <Show when={step() == 1}>
                        <Container pb="2em">
                            <Flex gap="1em" px="1em" minH="50vh" maxH="75vh">
                                <Box flex={1} position="relative" overflowY="auto">
                                    <Image src={spriteMapSrc()} class="definition-sprite-map" alt="upload image" />
                                    <Show when={selectedDefinition() != null}>
                                        <div class="definition-block" style={{
                                            width: `${selectedDefinition()!.width * unitInPx}px`,
                                            height: `${selectedDefinition()!.height * unitInPx}px`,
                                            transform: `translate(${selectedDefinition()!.x}px, ${selectedDefinition()!.y}px)`
                                        }}></div>
                                    </Show>
                                </Box>
                                <Box flex={1} overflowY="auto">
                                    <Card>
                                        <Tabs fitted variant="pills">
                                            <TabList>
                                                <Tab>Existing tiles</Tab>
                                                <Tab>New tile</Tab>
                                            </TabList>
                                            <TabPanel>
                                                <Grid templateColumns="repeat(2, 1fr)" gap="$6">
                                                    <For each={spriteMapContainer().definitions}>
                                                        {(definition) => (
                                                            <GridItem class={classNames('sprite-mapper-tile', { 'active': definition.type == selectedDefinition()?.type })} onClick={() => setSelectedDefinition(definition)}>
                                                                <Card overflowY="hidden">
                                                                    <Flex>
                                                                        <Center class={`sprite size-${definition.width}-${definition.width}`}>
                                                                            <LevelControlSpriteItem
                                                                                {...definition}
                                                                                isActive={false}
                                                                                onClick={() => { }}
                                                                            />
                                                                        </Center>
                                                                        <VStack class="details">
                                                                            <Text>{definition.type}</Text>
                                                                        </VStack>
                                                                    </Flex>
                                                                </Card>
                                                            </GridItem>
                                                        )}
                                                    </For>
                                                </Grid>
                                            </TabPanel>
                                            <TabPanel>
                                                <VStack
                                                    spacing="$5"
                                                    alignItems="stretch"
                                                    mx="auto"
                                                >
                                                    {renderFormItem({
                                                        type: 'text',
                                                        title: 'Type',
                                                        propName: 'type',
                                                        placeholder: 'grass1'
                                                    })}
                                                    <HStack>
                                                        {renderFormItem({
                                                            type: 'number',
                                                            title: 'X position',
                                                            propName: 'x',
                                                            placeholder: '16'
                                                        })}
                                                        <Box m="3px"></Box>
                                                        {renderFormItem({
                                                            type: 'number',
                                                            title: 'Y position',
                                                            propName: 'y',
                                                            placeholder: '16'
                                                        })}
                                                    </HStack>
                                                    <HStack>
                                                        {renderFormItem({
                                                            type: 'number',
                                                            title: 'Width (cells)',
                                                            propName: 'width',
                                                            placeholder: '1'
                                                        })}
                                                        <Box m="3px"></Box>
                                                        {renderFormItem({
                                                            type: 'number',
                                                            title: 'Height (cells)',
                                                            propName: 'height',
                                                            placeholder: '1'
                                                        })}
                                                    </HStack>
                                                </VStack>
                                            </TabPanel>
                                        </Tabs>
                                        {/* {
            "type": "grass1",
            "tags": [
                "grass"
            ],
            "x": 16,
            "y": 0,
            "width": 1,
            "height": 1
        } */}
                                    </Card>
                                </Box>
                            </Flex>
                            <Center>
                                <Button mt="2em" width="50%" onClick={() => setStep(2)}>Next step</Button>
                            </Center>
                        </Container>
                    </Show>
                </Center>
            </Flex>
        </CommonLayout>
    );
};

export default SpriteMapperPage;
