import React,{useEffect} from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from '../Components/Authentication/Login'
import SignUp  from "../Components/Authentication/Signup";
import { useNavigate } from "react-router-dom";


const Homepage = () => {
  
  const navigate = useNavigate();
      useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (user) {
          navigate("/chats");
        }
      }, [navigate]);
    

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px"
      >
        <Text
          fontSize="x-large"
          fontFamily="Work Sans"
          color="black"
          textAlign={"center"}
        >
          Snappy
        </Text>
      </Box>
      <Box bg={"white"} w="100%" p={4}  color="black" borderRadius="1g" borderWidth="1px">
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
                <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
