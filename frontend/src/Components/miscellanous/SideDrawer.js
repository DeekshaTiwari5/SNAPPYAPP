import React,{useEffect, useState} from 'react'
import { Button, Tooltip, Text, Flex, Avatar, Drawer, useDisclosure, DrawerHeader, DrawerOverlay, DrawerContent, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import axios from 'axios';
import UserListenItem from '../UserAvatar/UserListenItem';
import NotificationBadge, { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const {
      user,
      setSelectedChat,
      notification,
      setNotification,
      chats,
      setChats,
    } = ChatState("");
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate();
    const toast = useToast();


   useEffect(() => {
     console.log("Chats updated:", chats);
   }, [chats]);



    const logoutHandler =  () => {
        localStorage.removeItem("userInfo");
        navigate("/")
    };


     const handleSearch = async () => {
       if (!search) {
         toast({
           title: "Please Enter something in search",
           status: "warning",
           duration: 5000,
           isClosable: true,
           position: "top-left",
         });
         return;
       }
       try {
         setLoading(true);

         const config = {
           headers: {
             Authorization: `Bearer ${user.token}`,
           },
         };
         const { data } = await axios.get(`/api/user?search=${search}`, config);
        //  console.log(data);
        //  if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

         setLoading(false);
         setSearchResult(data);
         console.log(data);
       } catch (error) {
         toast({
           title: "Error Occured!",
           description: "Failed to Load the Search Results",
           status: "warning",
           duration: 5000,
           isClosable: true,
           position: "bottom-left",
         });
       }
    };
    


    const accessChat = async (userId) => {
      // console.log("accessChat:",userId);

      try {
        setLoadingChat(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(`/api/chat`, { userId }, config);
        // console.log("axios.post response:", data);
        // Add logic to handle the response and update the chats list
         if (data._id && !chats.find((c) => c._id === data._id)) {
           setChats((prevChats) => [data, ...prevChats]);
           setSelectedChat(data);
           setLoadingChat(false);
           onClose();
         }
        // if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        // setSelectedChat(data);
        // setLoadingChat(false);
        // onClose();
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    
  return (
    <>
      <Flex
        color="black"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search  User to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa fa-search" aria-hidden="true"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text color="black" as="b" fontSize="2xl" fontFamily="Work sans">
          Snappy
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
              <MenuList pl={2}>
                {!notification.length && "No New Messages"}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
          </Menu>
          <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Flex>

      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
        style={{ color: "black" }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottom="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Flex align="center" justify="space-between" p={1}>
              <Input
                placeholder="Search By name and email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button isLoading={loading} onClick={handleSearch}>
                Go
              </Button>
            </Flex>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListenItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;