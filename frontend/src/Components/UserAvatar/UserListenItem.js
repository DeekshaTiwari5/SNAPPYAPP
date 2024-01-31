import React from 'react'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

const UserListenItem = ({ user, handleFunction }) => {
 
  return (
    <Flex
      onClick={handleFunction}
      cursor="pointer"
      bg="#38E8E8"
      _hover={{
        background: "#38B2AC",
        color:"white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email :</b>
          {user.email}
        </Text>
      </Box>
    </Flex>
  )
}

export default UserListenItem;