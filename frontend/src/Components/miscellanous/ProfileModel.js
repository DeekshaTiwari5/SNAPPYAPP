import { Button,Flex,IconButton, Image, Text, useDisclosure } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalCloseButton,
} from "@chakra-ui/react";
import React from 'react'

const ProfileModel = ({user,children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal  size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="400px">
        <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center">
            {user.name}</ModalHeader>
          <ModalCloseButton />
                  <Flex
                      display="flex"
                      flexDir="column"
                      alignItems="center"
                      justifyContent="space-between"
                  >
           <Image
             borderRadius="full"      
             boxSize="150px"
             src={user.pic}
             alt={user.name}         
         />
         <Text fontFamily="Work sans" fontSize={{base:"28px",md:"30px"}}>
             Email:{user.email}
         </Text>
          </Flex>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>  
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModel