import { useDisclosure } from '@chakra-ui/hooks';
import { IUser } from '../../Api/Models/User';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';

interface IProfileModalProps {
  user?: IUser;
  children?: any;
}

const ProfileModal = ({ user, children }: IProfileModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton onClick={onOpen} display={{ base: 'flex' }} icon={<ViewIcon />} aria-label={''} />
      )}

      <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h='410px'>
          <ModalHeader fontSize={'40px'} fontFamily={'Work sans'} display={'flex'} justifyContent={'center'}>{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'space-between'}>
            <Image borderRadius={'full'} boxSize={'150px'} src={`${user?.picture}?s=150`} alt={user?.name} />
            <Text>{user?.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
