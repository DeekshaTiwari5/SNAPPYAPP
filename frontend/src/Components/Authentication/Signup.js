import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const handleClick = () => setShow(!show);

  const postDetails = (pic) => { 
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image!",
        description: "Warning",
        status: "success",
        duration: 5000,
        isClosable:true,
        position:"top",
      });
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "snappy");
      data.append("cloud_name", "dluljurer");
      fetch("https://api.cloudinary.com/v1_1/dluljurer/image/upload", {
        method: "post",
        body: data,
      }).then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "buttom",
      });
      setLoading(false);
      return;
    }
  };

  
   const submitHandler = async () => {
     setLoading(true);
     if (!name || !email || !password || !confirmPassword) {
       toast({
         title: "Please Fill all the Fields",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position: "top",
       });
       setLoading(false);
       return;
     }
     if (!password || !confirmPassword) {
       toast({
         title: "Password Didn't Matched!",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       setLoading(false);
       return;
     }
     console.log(name, email, password, pic);
     try {
       const config = {
         headers: {
           "Content-type": "application/json",
         },
       };

       const response = await axios.post(
         "/api/user",
         { name, email, password, pic },
         config
       );

       // Log the entire response for debugging
       console.log("Response:", response);
       if (response && response.data) {
         const { data } = response;
         console.log("Data:", data);
         toast({
           title: "Registration Successful",
           status: "success",
           duration: 5000,
           isClosable: true,
           position: "top",
         });

         localStorage.setItem("userInfo", JSON.stringify(data));
         setLoading(false);
         navigate.push("/chats");
       } else {
         throw new Error("Unexpected response format");
       }
     } catch (error) {
       toast({
         title: "Error Occurred!",
         description: error.response?.data?.message || "Unknown error",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position: "top",
       });
       setLoading(false);
     }
   };
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Id</FormLabel>
        <Input
         
          placeholder="Enter your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
