import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  createDisclosure,
} from '@hope-ui/solid';
import { Component, For } from 'solid-js';

import { numCharacters } from '../../constants/game';
import { CharacterInMotion } from './characterInMotion';

interface ICharacterSelectionModalProps {
  charIndex: number;
  disabled: boolean;
  scale?: number;
  selectCharacter: (charIndex: number) => void;
}

export const CharacterSelectionModal: Component<ICharacterSelectionModalProps> = (
  props: ICharacterSelectionModalProps,
) => {
  const { isOpen, onOpen, onClose } = createDisclosure();

  return (
    <>
      <Button
        variant="ghost"
        p="2em 1.5em"
        borderRadius="1em"
        disabled={props.disabled}
        onClick={props.disabled ? () => {} : onOpen}
      >
        <CharacterInMotion charIndex={props.charIndex} scale={2} />
      </Button>
      <Modal opened={isOpen()} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Level selector</ModalHeader>
          <ModalBody>
            <Box pl="1em">
              <SimpleGrid columns={3} gap="$10">
                <For each={Array.from(Array(numCharacters).keys())}>
                  {(_, index) => (
                    <Button
                      variant={index() === props.charIndex ? 'outline' : 'ghost'}
                      p="2em 1.5em"
                      borderRadius="1em"
                      class="pointer"
                      onClick={() => props.selectCharacter(index())}
                    >
                      <CharacterInMotion charIndex={index()} scale={2} />
                    </Button>
                  )}
                </For>
              </SimpleGrid>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
