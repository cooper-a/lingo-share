import "../styles/nav.css";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import React, { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [showLogin, setShowLogin] = useState(false);
  // console.log(user);

  const handleClick = (path) => {
    navigate("/" + path);
  };

  useEffect(() => {
    if (user && Object.keys(user).length !== 0) {
      navigate("/dashboard");
    } else if (user === null) {
      setShowLogin(true);
    }
  }, [user, navigate, showLogin]);

  return (
    <div>
      {showLogin ? (
        <ChakraProvider>
          <div className="welcome-pg">
            <Text fontSize="5xl">Welcome to LingoShare!</Text>
            <Button
              className="btn"
              height={"50px"}
              marginTop={"50px"}
              onClick={() => handleClick("signup")}
              rightIcon={<ArrowForwardIcon />}
              variant="outline"
            >
              Sign Up
            </Button>
            <Button
              className="btn"
              height={"50px"}
              onClick={() => handleClick("login")}
              rightIcon={<ArrowForwardIcon />}
              variant="outline"
            >
              Login
            </Button>
          </div>
        </ChakraProvider>
      ) : (
        <></>
      )}
    </div>
  );
}
