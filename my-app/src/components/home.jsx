import React from "react";
import { Button, ChakraProvider, Text } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import "../styles/nav.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate("/" + path);
  }

  return (
    <div>
      <ChakraProvider>
        <div className="welcome-pg">
          <Text fontSize='5xl'>Welcome to LingoShare!</Text>
          <Button onClick={() => handleClick("signup")} className="btn" rightIcon={<ArrowForwardIcon />} variant='outline'>
            Sign Up
          </Button>
          <Button onClick={() => handleClick("login")} className="btn" rightIcon={<ArrowForwardIcon />} variant='outline'>
            Login
          </Button>
        </div>
      </ChakraProvider>      

    </div>
  );
}
