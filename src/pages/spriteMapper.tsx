import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  HStack,
  Image,
  Input,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  Textarea,
  VStack,
} from '@hope-ui/solid';
import { Component, For, Show, createSignal } from 'solid-js';

import { Card } from '../components/common/card';
import { DottedBorder } from '../components/common/dottedBorder';
import { CommonLayout } from '../components/common/layout';
import { PageHeader } from '../components/common/pageHeader';
import { SpriteMapperForm } from '../components/form/spriteMapperForm';
import { SpriteMapperTile } from '../components/tile/spriteMapperTile';
import { unitInPx } from '../constants/game';
import { SpriteItemType } from '../contracts/spriteItem';
import { ISpriteMapLookup, ISpriteMapLookupContainer } from '../contracts/spriteMapLookup';
import { copyToClipboard, preventDefault } from '../helper/documentHelper';
import { readFileAsync, readImageFileAsync } from '../helper/fileHelper';
import { anyObject } from '../helper/typescriptHacks';
import { getSpriteMapServ } from '../services/internal/spriteMapService';

export const SpriteMapperPage: Component = () => {
  let elemImg: HTMLInputElement | undefined;
  let elemJson: HTMLInputElement | undefined;

  const [step, setStep] = createSignal<number>(0);
  const [zoomPerc, setZoomPerc] = createSignal<number>(100);
  const [jsonTabIndex, setJsonTabIndex] = createSignal<number>(0);
  const [spriteTabIndex, setSpriteTabIndex] = createSignal<number>(0);
  const [spriteMapContainer, setSpriteMapContainer] =
    createSignal<ISpriteMapLookupContainer>(anyObject);
  const [spriteMapSrc, setSpriteMapSrc] = createSignal<string>();
  const [selectedDefinition, setSelectedDefinition] = createSignal<ISpriteMapLookup>();

  const onUploadSpriteMap = async (event: any) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setSpriteMapSrc(fileUrl);
    // const imgData = await readImageFileAsync(file)
    // setSpriteMapContainer((prev) => ({
    //     ...prev,
    //     width: imgData.width,
    //     height: imgData.height,
    // }))
    // setTabIndex(2);
    event.target.value = null;
  };

  const onUploadSpriteMapJson = async (event: any) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const templateJsonRef = event.target.files[0];
    const templateJson = await readFileAsync(templateJsonRef);
    const templObj = JSON.parse(templateJson.toString());
    setSpriteMapContainer(templObj);
    setJsonTabIndex(2);

    event.target.value = null;
  };

  const regenSpriteMap = async (spriteMap: ISpriteMapLookupContainer, spriteSource?: string) => {
    if (spriteMap == null || spriteSource == null) return;
    await getSpriteMapServ().loadSpriteMap(spriteMap, spriteSource);
  };

  const navigateToEditStep = async () => {
    if (spriteMapContainer() == null || spriteMapSrc() == null) return;

    await regenSpriteMap(spriteMapContainer(), spriteMapSrc());
    setStep(1);
  };

  const editSelectedDefinition = (propsName: string) => (event: any) => {
    const value = event?.target?.value;
    if (value == null) return;

    setSelectedDefinition((prev: any) => ({
      ...prev,
      [propsName]: value,
    }));
  };

  const addDefinition = () => {
    setSpriteMapContainer((prev: ISpriteMapLookupContainer) => {
      const newDefinitions = [...prev.definitions, selectedDefinition()!];

      const newMap = {
        ...prev,
        definitions: orderDefinitions(newDefinitions),
      };
      regenSpriteMap(newMap, spriteMapSrc());
      return newMap;
    });
    setSpriteTabIndex(0);
  };

  const editDefinition = () => {
    setSpriteMapContainer((prev: ISpriteMapLookupContainer) => {
      const selectedDef = selectedDefinition();
      if (selectedDef == null) return prev;

      const newDefinitions = prev.definitions.map((def) => {
        if (def.type == selectedDef.type) return selectedDef;
        return def;
      });

      const newMap = {
        ...prev,
        definitions: orderDefinitions(newDefinitions),
      };
      regenSpriteMap(newMap, spriteMapSrc());
      return newMap;
    });
    setSpriteTabIndex(0);
  };

  const orderDefinitions = (definitions: Array<ISpriteMapLookup>): Array<ISpriteMapLookup> => {
    // const width = spriteMapContainer().width ?? 100;

    return definitions.sort((a: ISpriteMapLookup, b: ISpriteMapLookup) => {
      // const aRank = a.x + (a.y * width);
      // const bRank = b.x + (b.y * width);
      return a.type > b.type ? 1 : b.type > a.type ? -1 : 0;
    });
  };

  const removeDefinition = (type: SpriteItemType) => (event: any) => {
    preventDefault(event);
    setSpriteMapContainer((prev: ISpriteMapLookupContainer) => ({
      ...prev,
      definitions: prev.definitions.filter((d) => d.type != type),
    }));
  };

  const copyJsonSpriteMap = () => {
    const json = JSON.stringify(spriteMapContainer(), null, 2);
    copyToClipboard(json);
  };

  return (
    <CommonLayout>
      <Flex w="100%" h="100vh" justifyContent="center" flexDirection="column">
        <PageHeader text="Sprite mapper" />
        <Container>
          <Center>Map icons from a sprite image</Center>
        </Container>
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
                            <Image
                              src={spriteMapSrc()}
                              alt="upload image"
                              maxH="50vh"
                              draggable={false}
                            />
                          </DottedBorder>
                        }
                      >
                        <Box
                          cursor="pointer"
                          onClick={() => (elemImg as any)?.click?.()}
                          width="60%"
                        >
                          <DottedBorder>
                            <VStack>
                              <Image
                                src="/assets/img/uploadImg.png"
                                alt="upload image"
                                draggable={false}
                              />
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
                    <Tabs
                      height="60vh"
                      fitted
                      variant="pills"
                      index={jsonTabIndex()}
                      onChange={setJsonTabIndex}
                    >
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
                              <Image
                                src="/assets/img/uploadJson.png"
                                alt="upload json"
                                draggable={false}
                              />
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
                <Button mt="2em" width="50%" onClick={navigateToEditStep}>
                  Next step
                </Button>
              </Center>
            </Container>
          </Show>
          <Show when={step() == 1}>
            <Container pb="2em">
              <Flex gap="1em" px="1em" minH="50vh" maxH="75vh">
                <VStack flex={1}>
                  <HStack mb="0.5em">
                    <Button variant="subtle" onClick={() => setZoomPerc((prev) => prev + 10)}>
                      Zoom in
                    </Button>
                    <Button variant="ghost" mx="0.5em" disabled>
                      {zoomPerc()}%
                    </Button>
                    <Button variant="subtle" onClick={() => setZoomPerc((prev) => prev - 10)}>
                      Zoom out
                    </Button>
                  </HStack>
                  <Box
                    flexGrow={1}
                    position="relative"
                    width="100%"
                    overflowY="auto"
                    style={{ zoom: `${zoomPerc()}%` }}
                  >
                    <Image src={spriteMapSrc()} class="definition-sprite-map" alt="upload image" />
                    <Show when={selectedDefinition() != null}>
                      <div
                        class="definition-block"
                        style={{
                          width: `${selectedDefinition()!.width * unitInPx}px`,
                          height: `${selectedDefinition()!.height * unitInPx}px`,
                          transform: `translate(${selectedDefinition()!.x}px, ${
                            selectedDefinition()!.y
                          }px)`,
                        }}
                      ></div>
                    </Show>
                  </Box>
                </VStack>
                <Box flex={1} overflowY="auto">
                  <Card>
                    <Tabs
                      fitted
                      variant="pills"
                      index={spriteTabIndex()}
                      onChange={setSpriteTabIndex}
                    >
                      <TabList>
                        <Tab>Existing tiles</Tab>
                        <Tab>Add/Edit tile</Tab>
                      </TabList>
                      <TabPanel>
                        <Grid templateColumns="repeat(2, 1fr)" gap="$6">
                          <For each={spriteMapContainer().definitions}>
                            {(definition) => (
                              <SpriteMapperTile
                                definition={definition}
                                selectedDefinition={selectedDefinition()}
                                setSelectedDefinition={(newDef: ISpriteMapLookup) =>
                                  setSelectedDefinition(newDef)
                                }
                                removeDefinition={removeDefinition(definition.type)}
                                editDefinition={(newDef: ISpriteMapLookup) => {
                                  setSelectedDefinition(newDef);
                                  setSpriteTabIndex(1);
                                }}
                              />
                            )}
                          </For>
                        </Grid>
                      </TabPanel>
                      <TabPanel>
                        <SpriteMapperForm
                          selectedDefinition={selectedDefinition()}
                          editSelectedDefinition={editSelectedDefinition}
                          editDefinition={editDefinition}
                          addDefinition={addDefinition}
                        />
                      </TabPanel>
                    </Tabs>
                  </Card>
                </Box>
              </Flex>
              <Center>
                <Button mt="2em" width="50%" onClick={copyJsonSpriteMap}>
                  Copy JSON
                </Button>
              </Center>
            </Container>
          </Show>
        </Center>
      </Flex>
    </CommonLayout>
  );
};

export default SpriteMapperPage;
